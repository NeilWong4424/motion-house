import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { MYBOLA } from "../design";
import { displayFamily, t, rm } from "./tokens";
import { EASE } from "../../../shared/motion/easing";
import { useEnter } from "../../../shared/motion/reveal";
import { PhoneFrame } from "./PhoneFrame";
import { ChatOmnibar } from "./ChatOmnibar";

// =============================================================================
// Scene-1 hook OPTIONS — 4 calm, editorial, type-first treatments
// =============================================================================
// The reference film opens calm and editorial: a small badge -> a big headline ->
// a single giant chat bubble on a warm ground. These four adapt that register to
// MyBola's dark brand (black + a subtle blue depth glow). Every option is built
// from SEVERAL elements, each with its OWN entrance animation and timing — never a
// single fade. Rendered as separate compositions for the client to choose.

// Shared dark ground with a subtle blue depth glow that breathes in.
const Ground: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  const glow = interpolate(f, [0, 40], [0, 1], { extrapolateRight: "clamp", easing: EASE.easeOutQuart });
  return (
    <AbsoluteFill style={{ background: MYBOLA.black, alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
      <AbsoluteFill style={{ background: `radial-gradient(65% 50% at 50% 42%, rgba(0,145,255,0.14), transparent 72%)`, opacity: glow }} />
      {children}
    </AbsoluteFill>
  );
};

// A small "UJIAN TERTUTUP" pill badge with a line icon (like the ref's RESEARCH
// PREVIEW pill). Scales/fades in on its own spring.
const Badge: React.FC<{ delay: number }> = ({ delay }) => {
  const p = useEnter(delay, "settle");
  return (
    <div style={{ opacity: p, transform: `scale(${interpolate(p, [0, 1], [0.8, 1])})`, display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 9999, border: `1px solid ${MYBOLA.border}`, background: MYBOLA.secondary }}>
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={MYBOLA.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 3h6M10 3v6l-5 9a2 2 0 002 3h10a2 2 0 002-3l-5-9V3" /></svg>
      <span style={{ ...t.meta, color: MYBOLA.white, letterSpacing: 2, fontWeight: 600 }}>UJIAN TERTUTUP</span>
    </div>
  );
};

// A word-by-word display headline that rises each word on its own delay.
const WordHeadline: React.FC<{ words: string[]; accentFrom?: number; delay: number; step?: number; size?: number }> = ({ words, accentFrom = 999, delay, step = 4, size = 78 }) => (
  <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0 18px", maxWidth: 900 }}>
    {words.map((w, i) => (
      <Word key={i} word={w} delay={delay + i * step} accent={i >= accentFrom} size={size} />
    ))}
  </div>
);

const Word: React.FC<{ word: string; delay: number; accent: boolean; size: number }> = ({ word, delay, accent, size }) => {
  const p = useEnter(delay, "weighty");
  return (
    <span style={{ display: "inline-block", opacity: p, transform: `translateY(${interpolate(p, [0, 1], [28, 0])}px)`, fontFamily: displayFamily, fontSize: size, lineHeight: 1.0, letterSpacing: 0.5, color: accent ? MYBOLA.primary : MYBOLA.white }}>
      {word}
    </span>
  );
};

// -----------------------------------------------------------------------------
// Option A — Badge -> serif-style headline (reference-faithful)
// Elements: glow, badge (scale), headline words (rise stagger), a thin accent
// rule that draws across under the headline.
// -----------------------------------------------------------------------------
export const HookBadge: React.FC = () => {
  const f = useCurrentFrame();
  const rule = interpolate(f, [46, 74], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.easeInOutQuint });
  return (
    <Ground>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
        <Badge delay={2} />
        <WordHeadline words={["Uruskan", "akademi", "anda"]} delay={10} step={4} size={82} />
        <WordHeadline words={["dari", "poket", "anda."]} accentFrom={0} delay={22} step={4} size={82} />
        {/* accent rule draws across */}
        <div style={{ width: 320, height: 3, background: MYBOLA.border, position: "relative", marginTop: 6 }}>
          <div style={{ position: "absolute", inset: 0, background: MYBOLA.primary, transform: `scaleX(${rule})`, transformOrigin: "left" }} />
        </div>
      </div>
    </Ground>
  );
};

// -----------------------------------------------------------------------------
// Option B — Giant chat bubble hook
// Elements: glow, a giant incoming bubble (rises), a typing-dots -> reply chip,
// then the headline slides up from the bottom. Ties the hook to the AI at once.
// -----------------------------------------------------------------------------
export const HookBubble: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const bub = spring({ frame: f - 4, fps, config: { damping: 15, stiffness: 120 } });
  const reply = spring({ frame: f - 40, fps, config: { damping: 15, stiffness: 120 } });
  const hl = spring({ frame: f - 74, fps, config: { damping: 18, stiffness: 95 } });
  return (
    <Ground>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 26, width: 900, padding: "0 60px" }}>
        {/* giant owner request bubble */}
        <div style={{ alignSelf: "flex-end", opacity: bub, transform: `translateY(${interpolate(bub, [0, 1], [40, 0])}px)`, maxWidth: 760, background: MYBOLA.secondary, borderRadius: "28px 28px 8px 28px", padding: "28px 34px" }}>
          <span style={{ fontFamily: t.body.fontFamily, fontSize: 46, lineHeight: 1.15, color: MYBOLA.white, letterSpacing: -0.5 }}>siapa belum bayar bulan ni?</span>
        </div>
        {/* AI reply chip */}
        <div style={{ alignSelf: "flex-start", opacity: reply, transform: `translateY(${interpolate(reply, [0, 1], [30, 0])}px)`, maxWidth: 620, background: "rgba(0,145,255,0.2)", borderRadius: "28px 28px 28px 8px", padding: "24px 30px" }}>
          <span style={{ fontFamily: t.body.fontFamily, fontSize: 38, lineHeight: 1.2, color: MYBOLA.white }}>{`3 ahli — ${rm(320)}. Mahu saya hantar peringatan?`}</span>
        </div>
        {/* headline slides up */}
        <div style={{ opacity: hl, transform: `translateY(${interpolate(hl, [0, 1], [30, 0])}px)`, marginTop: 22, textAlign: "center" }}>
          <span style={{ fontFamily: displayFamily, fontSize: 64, color: MYBOLA.white, letterSpacing: 0.5 }}>Cuma tanya. </span>
          <span style={{ fontFamily: displayFamily, fontSize: 64, color: MYBOLA.primary, letterSpacing: 0.5 }}>MyBola uruskan.</span>
        </div>
      </div>
    </Ground>
  );
};

// -----------------------------------------------------------------------------
// Option C — Problem -> promise
// Elements: glow, the "problem" line fades/holds, a strike or dim as it recedes,
// then the "promise" line rises in accent. Relatable-problem framing.
// -----------------------------------------------------------------------------
export const HookProblem: React.FC = () => {
  const f = useCurrentFrame();
  // problem visible first, then dims/recedes as the promise arrives.
  const prob = useEnter(4, "weighty");
  const recede = interpolate(f, [66, 86], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.easeOutQuart });
  const promise = useEnter(72, "weighty");
  return (
    <Ground>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24, padding: "0 80px", textAlign: "center" }}>
        {/* problem line */}
        <div style={{ opacity: prob * interpolate(recede, [0, 1], [1, 0.28]), transform: `translateY(${interpolate(prob, [0, 1], [20, 0])}px) scale(${interpolate(recede, [0, 1], [1, 0.92])})` }}>
          <span style={{ fontFamily: t.body.fontFamily, fontSize: 40, fontWeight: 500, color: MYBOLA.tertiary, lineHeight: 1.25 }}>Bil, sesi, kehadiran, bayaran…</span>
        </div>
        {/* promise line rises */}
        <div style={{ opacity: promise, transform: `translateY(${interpolate(promise, [0, 1], [30, 0])}px)` }}>
          <div style={{ fontFamily: displayFamily, fontSize: 80, color: MYBOLA.white, lineHeight: 1.0, letterSpacing: 0.5 }}>Semua dalam</div>
          <div style={{ fontFamily: displayFamily, fontSize: 80, color: MYBOLA.primary, lineHeight: 1.05, letterSpacing: 0.5 }}>satu poket.</div>
        </div>
      </div>
    </Ground>
  );
};

// -----------------------------------------------------------------------------
// Option D — Single phone, calm push-in
// Elements: glow, a phone that rises + slow push-in, a live chat inside it, and a
// headline that sets beside/below on its own delay. Product-present, still.
// -----------------------------------------------------------------------------
export const HookPhone: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: f, fps, config: { damping: 16, stiffness: 95 } });
  // slow continuous push-in on the phone (camera, not prop content).
  const push = interpolate(f, [0, 150], [0.92, 1.02], { easing: EASE.easeInOutQuint });
  const scale = push * interpolate(enter, [0, 1], [0.96, 1]);
  const hl = useEnter(70, "weighty");
  const proc = f >= 30 && f < 60;
  const replied = f >= 62;
  return (
    <Ground>
      <div style={{ position: "relative", width: "100%", height: "100%" }}>
        {/* phone rises + pushes in */}
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: `translate(-50%, -54%) translateY(${interpolate(enter, [0, 1], [50, 0])}px) scale(${scale})`, opacity: enter }}>
          <PhoneFrame time="9:12">
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", background: MYBOLA.black, paddingTop: 44 }}>
              <div style={{ flex: 1, padding: 12, display: "flex", flexDirection: "column", justifyContent: "flex-end", gap: 10 }}>
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <div style={{ maxWidth: 300, background: MYBOLA.secondary, borderRadius: "12px 12px 4px 12px", padding: 10 }}>
                    <span style={t.body}>siapa belum bayar?</span>
                  </div>
                </div>
                {replied && (
                  <div style={{ display: "flex", justifyContent: "flex-start" }}>
                    <div style={{ maxWidth: 300, background: "rgba(0,145,255,0.2)", borderRadius: "12px 12px 12px 4px", padding: 10 }}>
                      <span style={{ ...t.body, whiteSpace: "pre-wrap" }}>{`3 ahli belum bayar, jumlah ${rm(320)}.`}</span>
                    </div>
                  </div>
                )}
              </div>
              <div style={{ padding: 12, paddingBottom: 16 }}>
                <ChatOmnibar value="" processing={proc} dots={".".repeat((Math.floor(f / 8) % 4))} />
              </div>
            </div>
          </PhoneFrame>
        </div>
        {/* headline sets at the bottom, over the receding glow */}
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 120, textAlign: "center", opacity: hl, transform: `translateY(${interpolate(hl, [0, 1], [24, 0])}px)`, padding: "0 80px" }}>
          <span style={{ fontFamily: displayFamily, fontSize: 58, color: MYBOLA.white }}>Uruskan akademi anda — </span>
          <span style={{ fontFamily: displayFamily, fontSize: 58, color: MYBOLA.primary }}>dari poket anda.</span>
        </div>
      </div>
    </Ground>
  );
};
