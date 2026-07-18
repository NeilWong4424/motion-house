import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { MYBOLA } from "../design";
import { t, rm } from "./tokens";
import { EASE } from "../../../shared/motion/easing";
import { PhoneFrame, SCREEN_W, SCREEN_H } from "./PhoneFrame";
import { ChatOmnibar } from "./ChatOmnibar";

// =============================================================================
// TransitionS1S2 — seamless morph from the hook's giant bubble into the phone chat
// =============================================================================
// The scene-1 giant question bubble ("siapa belum bayar bulan ni?") does not hard-
// cut into scene 2 — it BLENDS: the same bubble shrinks and travels down-right into
// the phone's transcript slot while the phone frame + chat chrome fade up around it.
// Then the AI reply lands inside the phone and the chat continues. One continuous
// timeline drives the whole handoff so the bubble reads as a single object moving
// from headline-scale to a message inside the app.
//
// Coordinate model: everything is measured in the FINAL phone's on-screen space so
// the bubble's end state matches the real transcript exactly. The phone is centred
// and scaled by PHONE_FILL (as in the launch Stage); the transcript's first "Anda"
// bubble sits near the bottom, right-aligned, inside 12px padding.

const PHONE_FILL = 1.4;

// The launch chat's first owner message (must match ChatScene step 0 verbatim).
const Q = "siapa belum bayar?";
const A = `3 ahli belum bayar, jumlah ${rm(320)}. Mahu saya hantar peringatan?`;

export const TransitionS1S2: React.FC = () => {
  const f = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // ---- phases (frames) ----
  // 0-18   hook holds: giant bubble sits (as it ended scene 1)
  // 18-48  MORPH: bubble shrinks + travels into the phone; phone chrome fades up
  // 48-70  reply processing -> AI reply lands inside the phone; chat settles
  const morph = interpolate(f, [18, 48], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.easeInOutQuint });

  // Phone chrome (frame, status bar, omnibar, background) fades up during the morph.
  const chrome = interpolate(f, [22, 46], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.easeOutQuart });

  // Glow from the hook fades out as the phone takes over.
  const glow = interpolate(f, [18, 44], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Phone geometry on screen (centred, scaled).
  const phoneScreenW = SCREEN_W * PHONE_FILL;
  const phoneScreenH = SCREEN_H * PHONE_FILL;
  const phoneLeft = (width - phoneScreenW) / 2;
  const phoneTop = (height - phoneScreenH) / 2;

  // --- bubble start state (hook): big, upper-centre-right, ~46px text ---
  const startFontSize = 46;
  const startPadV = 28;
  const startPadH = 34;
  const startW = 720; // giant bubble width
  const startCX = width / 2 + 60; // slightly right of centre
  const startCY = height * 0.44;
  const startRadius = 28;

  // --- bubble end state: the phone's first "Anda" message slot ---
  // Inside the phone: 12px transcript padding (× fill), right-aligned, above the
  // omnibar. Text ~16px × fill. Sits at ~68% down the screen at the transition.
  const pad = 12 * PHONE_FILL;
  const endFontSize = 16 * PHONE_FILL;
  const endPadV = 10 * PHONE_FILL;
  const endPadH = 10 * PHONE_FILL;
  const endW = 190 * PHONE_FILL; // measured single-line width of Q in-phone
  const endCX = phoneLeft + phoneScreenW - pad - endW / 2;
  const endCY = phoneTop + phoneScreenH * 0.68;
  const endRadius = 12 * PHONE_FILL;

  // Interpolate the shared bubble.
  const cx = interpolate(morph, [0, 1], [startCX, endCX]);
  const cy = interpolate(morph, [0, 1], [startCY, endCY]);
  const w = interpolate(morph, [0, 1], [startW, endW]);
  const fontSize = interpolate(morph, [0, 1], [startFontSize, endFontSize]);
  const padV = interpolate(morph, [0, 1], [startPadV, endPadV]);
  const padH = interpolate(morph, [0, 1], [startPadH, endPadH]);
  const radiusBR = interpolate(morph, [0, 1], [startRadius, endRadius]);
  const pointBR = interpolate(morph, [0, 1], [8, 4 * PHONE_FILL]); // pointing corner

  // Reply appears inside the phone after the morph settles.
  const replyIn = spring({ frame: f - 56, fps, config: { damping: 15, stiffness: 120 } });
  const proc = f >= 48 && f < 56;

  return (
    <AbsoluteFill style={{ background: MYBOLA.black, overflow: "hidden" }}>
      {/* hook glow fading out */}
      <AbsoluteFill style={{ background: `radial-gradient(65% 50% at 50% 42%, rgba(0,145,255,0.14), transparent 72%)`, opacity: glow }} />

      {/* The phone materialises. Its own transcript renders the REPLY + omnibar;
          the first owner bubble is the morphing element below (so it lands exactly
          in the transcript slot). Chrome opacity fades the whole phone up. */}
      <div style={{ position: "absolute", left: phoneLeft, top: phoneTop, opacity: chrome }}>
        <div style={{ transform: `scale(${PHONE_FILL})`, transformOrigin: "top left" }}>
          <PhoneFrame time="9:12">
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", background: MYBOLA.black, paddingTop: 44 }}>
              <div style={{ flex: 1, padding: 12, display: "flex", flexDirection: "column", justifyContent: "flex-end", gap: 10 }}>
                {/* spacer where the morphing owner bubble will land */}
                <div style={{ height: 44 }} />
                {/* AI reply lands after the morph */}
                <div style={{ opacity: replyIn, transform: `translateY(${interpolate(replyIn, [0, 1], [14, 0])}px)`, display: "flex", justifyContent: "flex-start" }}>
                  <div style={{ maxWidth: 288, background: "rgba(0,145,255,0.2)", borderRadius: "12px 12px 12px 4px", padding: 10 }}>
                    <span style={{ ...t.body, whiteSpace: "pre-wrap" }}>{A}</span>
                  </div>
                </div>
              </div>
              <div style={{ padding: 12, paddingBottom: 16 }}>
                <ChatOmnibar value="" processing={proc} dots={".".repeat((Math.floor(f / 8) % 4))} />
              </div>
            </div>
          </PhoneFrame>
        </div>
      </div>

      {/* The morphing bubble — one element, hook-scale -> in-phone message. Drawn
          above the phone so it visually becomes the transcript's first message. */}
      <div
        style={{
          position: "absolute",
          left: cx - w / 2,
          top: cy - (fontSize * 1.15 + padV * 2) / 2,
          width: w,
          background: MYBOLA.secondary,
          borderRadius: `${radiusBR}px ${radiusBR}px ${pointBR}px ${radiusBR}px`,
          padding: `${padV}px ${padH}px`,
          boxSizing: "border-box",
        }}
      >
        <span style={{ fontFamily: t.body.fontFamily, fontSize, lineHeight: 1.15, color: MYBOLA.white, letterSpacing: interpolate(morph, [0, 1], [-0.5, -0.31]), whiteSpace: "nowrap", overflow: "hidden" }}>
          {Q}
        </span>
      </div>
    </AbsoluteFill>
  );
};
