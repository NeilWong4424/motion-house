import React from "react";
import { AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { MYBOLA } from "../design";
import { t, rm } from "./tokens";
import { EASE } from "../../../shared/motion/easing";
import { PhoneFrame, SCREEN_W, SCREEN_H, BEZEL } from "./PhoneFrame";
import { ChatOmnibar } from "./ChatOmnibar";
import { ChatMontage, montageDur } from "./ChatMontage";

// =============================================================================
// Scene1to2 — seamless hook -> chat, with BOTH bubbles morphing
// =============================================================================
// The hook shows two giant bubbles (owner question + AI reply). On the transition
// BOTH bubbles morph together: each travels from its scene-1 position to its exact
// scene-2 transcript slot while the phone chrome fades up around them. So there is
// no hard cut — the two hook bubbles literally become the first two messages in
// the phone. Coordinates are computed from the same layout math both scenes use,
// so the start matches scene 1 and the end matches scene 2 exactly.

const PHONE_FILL = 1.4;
export const HOOK_LEN = 78;
export const MORPH_LEN = 50;
export const OVERLAP = 10; // montage underlaps the morph by this many frames
export const MONTAGE_START = HOOK_LEN + MORPH_LEN; // 128
export const scene1to2Dur = MONTAGE_START + montageDur(1); // 598

// The two hook messages (must match ChatMontage step 0 verbatim at the end).
const Q = "siapa belum bayar?";
const A = `3 ahli belum bayar, jumlah ${rm(320)}:\n• Ahmad Faizal — ${rm(150)}\n• Nur Aisyah — ${rm(120)}\n• Danish Haiqal — ${rm(50)}\nMahu saya hantar peringatan?`;
// Shorter hook-phrasing of each (big type reads better trimmed); morphs to the
// full in-phone text as it shrinks. These MUST be measured for the hook rect
// heights below so the scene-1 bubble hugs its text (no dead space).
const Q_HOOK = "siapa belum bayar bulan ni?"; // 1 line at hook width
const A_HOOK = `3 ahli — ${rm(320)}.\nMahu saya hantar peringatan?`; // 2 lines at hook width

// A bubble's rectangle at a given moment: top-left anchor + box size + text
// metrics. Height is EXPLICIT (not driven by text flow) so the box hugs whatever
// text is showing — the hook box fits the hook text, the phone box fits the full
// text, and we lerp the height between them during the morph.
type Rect = { cx: number; top: number; w: number; h: number; font: number; padV: number; padH: number; radius: number; point: number };

const lerpRect = (a: Rect, b: Rect, p: number): Rect => ({
  cx: interpolate(p, [0, 1], [a.cx, b.cx]),
  top: interpolate(p, [0, 1], [a.top, b.top]),
  w: interpolate(p, [0, 1], [a.w, b.w]),
  h: interpolate(p, [0, 1], [a.h, b.h]),
  font: interpolate(p, [0, 1], [a.font, b.font]),
  padV: interpolate(p, [0, 1], [a.padV, b.padV]),
  padH: interpolate(p, [0, 1], [a.padH, b.padH]),
  radius: interpolate(p, [0, 1], [a.radius, b.radius]),
  point: interpolate(p, [0, 1], [a.point, b.point]),
});

// Geometry hook: given the frame size, return start (scene-1) and end (scene-2)
// rects for both bubbles, plus the phone origin. Both scenes read from this so
// they agree by construction.
const useGeometry = () => {
  const { width, height } = useVideoConfig();
  // The PhoneFrame's OUTER box (bezel included) is what gets scaled+positioned.
  const outerW = (SCREEN_W + BEZEL * 2) * PHONE_FILL;
  const outerH = (SCREEN_H + BEZEL * 2) * PHONE_FILL;
  // OUTER top-left: centre the whole device on screen (both parts use this).
  const phoneLeft = (width - outerW) / 2;
  const phoneTop = (height - outerH) / 2;
  // SCREEN top-left: inset from the outer box by the (scaled) bezel. Content
  // coordinates (bubbles, captions) are measured from HERE.
  const screenLeft = phoneLeft + BEZEL * PHONE_FILL;
  const screenTop = phoneTop + BEZEL * PHONE_FILL;
  const phoneW = SCREEN_W * PHONE_FILL;
  const phoneH = SCREEN_H * PHONE_FILL;

  // ---- scene-1 (hook) rects: two big bubbles stacked centre screen ----
  // Question sits above (right of centre); reply below it (left of centre), with a
  // real gap between them. Boxes hug their HOOK text: 1 line for Q, 2 lines for A.
  // Height = lines * font * lineHeight + 2 * padV. The pair is vertically centred.
  const colCX = width / 2;
  const qHookW = 720, aHookW = 660;
  const qFont1 = 46, qPadV1 = 28, qLines1 = 1;
  const aFont1 = 40, aPadV1 = 26, aLines1 = 2;
  const qH1 = qLines1 * qFont1 * 1.3 + qPadV1 * 2;
  const aH1 = aLines1 * aFont1 * 1.3 + aPadV1 * 2;
  const hookGap = 26;
  const pairH = qH1 + hookGap + aH1;
  const pairTop = (height - pairH) / 2; // centre the pair vertically
  const q1: Rect = { cx: colCX + 30, top: pairTop, w: qHookW, h: qH1, font: qFont1, padV: qPadV1, padH: 34, radius: 28, point: 8 };
  const a1: Rect = { cx: colCX - 40, top: pairTop + qH1 + hookGap, w: aHookW, h: aH1, font: aFont1, padV: aPadV1, padH: 30, radius: 28, point: 8 };

  // ---- scene-2 (in-phone transcript) rects ----
  // These MUST land exactly where ChatMontage renders step 0 (a DoneStep) at its
  // first frame, so the morph -> montage handoff is seamless. The montage's screen
  // (SCREEN_H tall, ×PHONE_FILL, offset to phone origin) is a bottom-anchored flex
  // column: [status 44] then flex{ pad 12, gap 10, justify flex-end } then
  // omnibar{ pad 12 / padBottom 16, GlassShell(52) }. Each ChatBubble = body then
  // 4px gap then an 18px meta caption. We measure the stack from the bottom up in
  // SCREEN space, then convert to on-screen top-left rects for the two bodies.
  const F = PHONE_FILL;
  const sBody = 16, sLine = 1.3, sPadV = 10, sPadH = 10; // ChatBubble metrics (px)
  const capBlock = 4 + 18; // gap + meta line under every bubble
  // Body heights (px, pre-fill). Q = 1 line; reply = 5 lines (full bullet list).
  const qBodyH = 1 * sBody * sLine + sPadV * 2;
  const aBodyH = 5 * sBody * sLine + sPadV * 2;
  const qBodyW = 190, aBodyW = 288; // measured max widths in-phone
  const omniBlock = 12 + 52 + 16; // omnibar wrapper (top pad + GlassShell + bottom pad)
  const fl60 = SCREEN_H; // screen bottom in SCREEN space
  // From the bottom: omnibar, then transcript bottom pad 12, then reply caption,
  // reply body, gap 10, question caption, question body.
  const aCapBottom = fl60 - omniBlock - 12;          // reply caption bottom
  const aBodyBottom = aCapBottom - capBlock;          // reply body bottom
  const aBodyTopS = aBodyBottom - aBodyH;             // reply body top (SCREEN)
  const qBodyBottom = aBodyTopS - 10 - capBlock;      // gap 10 + question caption
  const qBodyTopS = qBodyBottom - qBodyH;             // question body top (SCREEN)
  // Convert SCREEN-space to on-screen: SCREEN origin (bezel-inset) + value×fill.
  const toX = (sx: number) => screenLeft + sx * F;
  const toY = (sy: number) => screenTop + sy * F;
  const q2: Rect = {
    cx: toX(SCREEN_W - 12 - qBodyW / 2), top: toY(qBodyTopS),
    w: qBodyW * F, h: qBodyH * F, font: sBody * F, padV: sPadV * F, padH: sPadH * F,
    radius: 12 * F, point: 4 * F,
  };
  const a2: Rect = {
    cx: toX(12 + aBodyW / 2), top: toY(aBodyTopS),
    w: aBodyW * F, h: aBodyH * F, font: sBody * F, padV: sPadV * F, padH: sPadH * F,
    radius: 12 * F, point: 4 * F,
  };

  return { width, height, phoneLeft, phoneTop, phoneW, phoneH, q1, a1, q2, a2 };
};

// Render one bubble from a Rect. `mine` = owner (secondary, points bottom-right);
// else AI (primary tint, points bottom-left). Two text layers (hook phrasing and
// full in-phone text) are stacked and crossfaded via `textMix` (0 = hook, 1 =
// full) so the wording changes over several frames — never a one-frame pop.
const Bubble: React.FC<{ r: Rect; mine: boolean; hookText: string; fullText: string; opacity?: number; textMix?: number; caption?: string; capMix?: number; capScale?: number }> = ({ r, mine, hookText, fullText, opacity = 1, textMix = 0, caption, capMix = 0, capScale = 1 }) => {
  const spanBase: React.CSSProperties = { position: "absolute", top: r.padV, left: r.padH, right: r.padH, fontFamily: t.body.fontFamily, fontSize: r.font, lineHeight: 1.3, color: MYBOLA.white, letterSpacing: -0.31, whiteSpace: "pre-wrap", display: "block" };
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: r.cx - r.w / 2,
          top: r.top,
          width: r.w,
          height: r.h,
          opacity,
          background: mine ? MYBOLA.secondary : "rgba(0,145,255,0.2)",
          borderRadius: mine
            ? `${r.radius}px ${r.radius}px ${r.point}px ${r.radius}px`
            : `${r.radius}px ${r.radius}px ${r.radius}px ${r.point}px`,
          boxSizing: "border-box",
        }}
      >
        {/* Box height is explicit (r.h) so it hugs whichever text shows. Both text
            layers are absolutely positioned and crossfaded via textMix (0 = hook,
            1 = full) — never a one-frame swap, never dead space. */}
        <span style={{ ...spanBase, opacity: textMix }}>{fullText}</span>
        <span style={{ ...spanBase, opacity: 1 - textMix }}>{hookText}</span>
      </div>
      {/* Meta caption: fades in at the END of the morph so the handoff to the
          montage (which always shows captions) has nothing pop in. Positioned 4px
          (×scale) under the body, aligned to the bubble's own side, meta style. */}
      {caption && (
        <div
          style={{
            position: "absolute",
            top: r.top + r.h + 4 * capScale,
            left: r.cx - r.w / 2,
            width: r.w,
            textAlign: mine ? "right" : "left",
            opacity: capMix * opacity,
            fontFamily: t.meta.fontFamily,
            fontSize: 13 * capScale,
            fontWeight: 500,
            lineHeight: `${18 * capScale}px`,
            letterSpacing: -0.08,
            color: MYBOLA.tertiary,
          }}
        >
          {caption}
        </div>
      )}
    </>
  );
};

// ---- HOOK + MORPH as ONE continuous part (no Sequence boundary) ----
// A single clock (0 .. HOOK_LEN+MORPH_LEN) drives the SAME two bubbles the whole
// time: they spring in at the hook rect, hold, then interpolate to the phone
// transcript rect while the phone chrome fades up. Because it's one component with
// one set of elements, there is no cross-fade between two copies and no boundary
// flash — the earlier blink was caused by the hook/morph being separate Sequences.
const HookMorphPart: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const g = useGeometry();

  // Entrances (hook).
  const qIn = spring({ frame: f - 4, fps, config: { damping: 15, stiffness: 120 } });
  const aIn = spring({ frame: f - 40, fps, config: { damping: 15, stiffness: 120 } });

  // Morph begins at HOOK_LEN and runs MORPH_LEN.
  const morph = interpolate(f, [HOOK_LEN, HOOK_LEN + 34], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.easeInOutQuint });
  const chrome = interpolate(f, [HOOK_LEN + 6, HOOK_LEN + 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.easeOutQuart });
  const glow = interpolate(f, [0, 40, HOOK_LEN + 26], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Bubble rects: hold at hook rect (plus spring-in offset) until the morph, then
  // lerp to the phone rect.
  const qStart: Rect = { ...g.q1, top: g.q1.top + interpolate(qIn, [0, 1], [40, 0]) };
  const aStart: Rect = { ...g.a1, top: g.a1.top + interpolate(aIn, [0, 1], [30, 0]) };
  const qR = lerpRect(qStart, g.q2, morph);
  const aR = lerpRect(aStart, g.a2, morph);
  // Crossfade the wording over a window (not a single-frame swap).
  const textMix = interpolate(morph, [0.35, 0.65], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // Captions fade in at the very end of the morph so the montage (which always
  // shows them) has nothing pop in at the handoff.
  const capMix = interpolate(morph, [0.75, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // SETTLE: at the tail of the morph, dissolve from the hand-positioned morph
  // bubbles to the REAL ChatMontage (frozen at frame 0). The montage is the single
  // source of truth for scene-2 layout, so even if the morph bubbles land a hair
  // off, they melt into the exact montage — no jump at the seam (f127 already shows
  // the true montage, identical to f128's pure montage).
  const settle = interpolate(morph, [0.82, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: MYBOLA.black, overflow: "hidden" }}>
      {/* single glow: fades in over the hook, out during the morph */}
      <AbsoluteFill style={{ background: `radial-gradient(65% 50% at 50% 42%, rgba(0,145,255,0.14), transparent 72%)`, opacity: glow }} />

      {/* phone chrome fades up during the morph. Its transcript is the REAL montage
          frozen at frame 0, revealed by `settle` so the seam is a dissolve into the
          exact scene-2 layout, not a cut. Identical placement to MontagePart. */}
      <div style={{ position: "absolute", left: g.phoneLeft, top: g.phoneTop, opacity: chrome }}>
        <div style={{ transform: `scale(${PHONE_FILL})`, transformOrigin: "top left" }}>
          <PhoneFrame time="9:12">
            {/* empty chrome (omnibar only) UNDER the settling montage, so the phone
                is never bare while the montage is still transparent */}
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", background: MYBOLA.black, paddingTop: 44 }}>
              <div style={{ flex: 1 }} />
              <div style={{ padding: 12, paddingBottom: 16 }}>
                <ChatOmnibar value="" />
              </div>
            </div>
            {/* the real scene-2 transcript, frozen at its first frame */}
            <div style={{ position: "absolute", inset: 0, opacity: settle }}>
              <ChatMontage startStep={1} delay={9999} />
            </div>
          </PhoneFrame>
        </div>
      </div>

      {/* the SAME two bubbles the whole time; wording crossfades via textMix,
          captions fade in via capMix, and the whole pair dissolves out (1 - settle)
          as the real montage settles in beneath — so the seam is a clean dissolve */}
      <Bubble r={qR} mine hookText={Q_HOOK} fullText={Q} opacity={qIn * (1 - settle)} textMix={textMix} caption="Anda · 9:12 AM" capMix={capMix} capScale={PHONE_FILL} />
      <Bubble r={aR} mine={false} hookText={A_HOOK} fullText={A} opacity={aIn * (1 - settle)} textMix={textMix} caption="Pengurus Akademi · 9:12 AM" capMix={capMix} capScale={PHONE_FILL} />
    </AbsoluteFill>
  );
};

// ---- MONTAGE: phone chat continues from step 1 ----
// `startAt` freezes the montage clock for its first `startAt` frames so it can be
// mounted early (underlapping the morph) without advancing.
const MontagePart: React.FC<{ startAt?: number }> = ({ startAt = 0 }) => {
  const g = useGeometry();
  // IDENTICAL phone placement to HookMorphPart: absolute at the OUTER origin,
  // scaled from top-left. Any deviation (e.g. flex-centre / centre origin) shifts
  // every element and breaks the seam.
  return (
    <AbsoluteFill style={{ background: MYBOLA.black }}>
      <div style={{ position: "absolute", left: g.phoneLeft, top: g.phoneTop }}>
        <div style={{ transform: `scale(${PHONE_FILL})`, transformOrigin: "top left" }}>
          <PhoneFrame time="9:12">
            <ChatMontage startStep={1} delay={startAt} />
          </PhoneFrame>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const Scene1to2: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: MYBOLA.black }}>
      {/* Montage underlaps the hook+morph: it mounts OVERLAP frames early with its
          clock frozen, so its settled step-0 transcript is already painting when
          the hook+morph fades away — no bare/black frame at the seam. The single
          continuous hook+morph renders ON TOP for its whole span. */}
      <Sequence from={MONTAGE_START - OVERLAP}><MontagePart startAt={OVERLAP} /></Sequence>
      <Sequence from={0} durationInFrames={MONTAGE_START}><HookMorphPart /></Sequence>
    </AbsoluteFill>
  );
};
