import React from "react";
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame } from "remotion";
import { defineVideo, LANDSCAPE } from "../../../shared/engine/types";
import { familyOf } from "../../../shared/design/types";
import { useDesignFonts } from "../../../shared/design/fonts";
import { Rise, CountUp, ClipReveal, useEnter } from "../../../shared/motion/reveal";
import {
  Emphasis,
  TrackingIn,
  WordSwap,
} from "../../../shared/motion/type-kinetic";
import { LineDraw, Rule, Bracket, Badge } from "../../../shared/motion/graphic";
import { Lockup, Resolve } from "../../../shared/motion/logo";
import { EASE } from "../../../shared/motion/easing";
import { worldcupHype as D, GOLD_GRAD } from "../design";
import { Pitch, Kicker } from "../ui/stage";

// =============================================================================
// "Every four years." — the 2026 World Cup, broadcast hype cut. 30s, landscape.
// =============================================================================
// A different ANSWER to the same subject the worldcup2026 product explains: that
// cut HOLDS and teaches (one accent sorting teams); this one SLAMS — fast cuts
// (~3-4s/beat), confident graphic shapes drawing on, kinetic type as the hero,
// one held payoff, a logo resolve. Same "pitch at night" world (ui/stage.tsx),
// driven by this product's design.ts. See craft/broadcast-energy.md +
// craft/kinetic-type.md.
//
// Accent rule for this cut (design.ts): LIME MARKS THE SINGULAR — the one
// trophy, the one final, the champion. It appears exactly twice: the "ONE
// TROPHY" hero (scene 6) and the closing dot (scene 8). Everywhere else the
// drawn shapes are bone/muted, so when lime lands it means "there is one of this".

const FAMILY = familyOf(D.type.display);
const BODY = `'${D.type.body.family}', ${D.type.body.fallback}`;
// Display type is Anton — a single-weight, already-black ultra-condensed caps
// face (the FWC 2026 substitute). So H() ignores weight, sets ALL-CAPS, and uses
// near-zero tracking (condensed faces want tight-to-neutral, not the negative
// tracking Inter took). Anything that needs a lighter voice uses BODY (Inter).
const H = (size: number, extra?: React.CSSProperties): React.CSSProperties => ({
  fontFamily: FAMILY,
  fontSize: size,
  color: D.palette.fg,
  letterSpacing: "0.005em",
  lineHeight: 0.98,
  textTransform: "uppercase",
  ...extra,
});
// A muted supporting label in the BODY face (Inter), letterspaced caps.
const label = (size: number, extra?: React.CSSProperties): React.CSSProperties => ({
  fontFamily: BODY,
  fontSize: size,
  fontWeight: 600,
  color: D.palette.muted,
  letterSpacing: "0.24em",
  textTransform: "uppercase",
  ...extra,
});
// The metallic gold clipped to the glyphs — the trophy's colour, so it's
// reserved for the singular (hero, the FINAL slot, the closing lockup). Never a
// flat swatch: gold in this identity is a render, so it's always the gradient.
const GOLD_TEXT: React.CSSProperties = {
  background: GOLD_GRAD,
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  WebkitTextFillColor: "transparent",
  color: "transparent",
};

/** Broadcast beats are hard cuts on black. No cross-dissolves. */
const Scene: React.FC<{ children: React.ReactNode; black?: boolean }> = ({ children, black }) => (
  <Pitch black={black}>{children}</Pitch>
);

// A drawn chevron pair — the film's recurring graphic shape (forward = right).
const Chevrons: React.FC<{ delay?: number; color?: string; size?: number }> = ({
  delay = 0,
  color = D.palette.muted,
  size = 120,
}) => (
  <div style={{ position: "relative", width: size, height: size }}>
    <LineDraw
      d="M22 20 L64 50 L22 80 M52 20 L94 50 L52 80"
      stroke={color}
      strokeWidth={5}
      delay={delay}
      duration={12}
      width={size}
      height={size}
    />
  </div>
);

// ---------------------------------------------------------------------------
// 1 — 0-108 (3.6s). Cold open: 48 NATIONS tracks in, counts, rule sweeps.
// ---------------------------------------------------------------------------
const ColdOpen: React.FC = () => (
  <Scene black>
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 26, whiteSpace: "nowrap" }}>
        <CountUp
          to={48}
          duration={30}
          delay={6}
          ease="easeOutExpo"
          style={H(300, { letterSpacing: "-0.06em" })}
        />
        <TrackingIn text="NATIONS" at={20} d={22} fromSpacing={40} style={H(88)} />
      </div>
      {/* the rule sweeps under both, centre-out — the beat's underline */}
      <div style={{ position: "relative", width: 620, height: 4, marginTop: 30 }}>
        <Rule color={D.palette.fg} thickness={4} delay={34} duration={16} origin="center" />
      </div>
      <Rise delay={52} distance={18} preset="crisp">
        <div style={{ ...label(26, { letterSpacing: "0.34em" }), marginTop: 28 }}>
          One World Cup
        </div>
      </Rise>
    </AbsoluteFill>
  </Scene>
);

// ---------------------------------------------------------------------------
// 2 — 108-216 (3.6s). 3 HOSTS. 16 CITIES. Chevrons drive between them.
// ---------------------------------------------------------------------------
const Hosts: React.FC = () => (
  <Scene>
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 60 }}>
      <div style={{ textAlign: "right" }}>
        <div style={H(220)}>
          <Emphasis at={4} preset="bouncy">3</Emphasis>
        </div>
        <div style={{ ...label(30), marginTop: 10 }}>HOSTS</div>
      </div>
      <Chevrons delay={14} size={140} />
      <div style={{ textAlign: "left" }}>
        <div style={H(220)}>
          <Emphasis at={20} preset="bouncy">16</Emphasis>
        </div>
        <div style={{ ...label(30), marginTop: 10 }}>CITIES</div>
      </div>
    </AbsoluteFill>
    <div style={{ position: "absolute", left: 0, right: 0, top: 150, textAlign: "center" }}>
      <Rise delay={2} preset="crisp">
        <Kicker>Canada · Mexico · United States</Kicker>
      </Rise>
    </div>
  </Scene>
);

// ---------------------------------------------------------------------------
// 3 — 216-330 (3.8s). 104 MATCHES — a bracket frames the number.
// ---------------------------------------------------------------------------
const Matches: React.FC = () => (
  <Scene black>
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      {/* Box is wider than the content so the drawn arms frame it, never cross
          it — an earlier pass had inset=6 on a 760px box and the left arm ran
          straight through the "1" of 104. */}
      <div style={{ position: "relative", width: 1160, height: 420, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Bracket color={D.palette.muted} strokeWidth={4} arm={22} delay={8} duration={16} inset={2} />
        <div style={{ display: "flex", alignItems: "baseline", gap: 24 }}>
          <CountUp to={104} duration={34} delay={2} ease="easeOutExpo" style={H(240)} />
          <TrackingIn text="MATCHES" at={22} d={20} fromSpacing={26} style={H(64, { color: D.palette.muted })} />
        </div>
      </div>
    </AbsoluteFill>
  </Scene>
);

// ---------------------------------------------------------------------------
// 4 — 330-450 (4.0s). The scale line: bigger -> biggest, sweep lands.
// ---------------------------------------------------------------------------
const Biggest: React.FC = () => (
  <Scene>
    <AbsoluteFill style={{ alignItems: "flex-start", justifyContent: "center", paddingLeft: 150 }}>
      <div style={H(150, { lineHeight: 1.0 })}>
        <div>THE</div>
        {/* The swap IS the emphasis — BIGGER -> BIGGEST is the rhetorical move.
            One device per line (kinetic-type.md): the swap alone, no highlight. */}
        <div style={{ display: "flex", alignItems: "baseline", gap: 24 }}>
          <WordSwap from="BIGGER" to="BIGGEST" at={16} d={12} travel={30} />
        </div>
        <div>WORLD CUP EVER.</div>
      </div>
      <div style={{ marginTop: 36 }}>
        <Rise delay={44} preset="crisp" distance={18}>
          <div style={label(24, { letterSpacing: "0.16em" })}>
            48 nations · 104 matches · 39 days
          </div>
        </Rise>
      </div>
    </AbsoluteFill>
  </Scene>
);

// ---------------------------------------------------------------------------
// 5 — 450-588 (4.6s). The bracket collapses 32 -> 1. Fast staggered draw.
// ---------------------------------------------------------------------------
// A real feeding bracket: each round's slots pair up and a connector carries the
// winner one column right, converging to a single final line. The earlier pass
// drew disconnected dashes with a big empty gap on the right — it read as tally
// marks, not a tournament. Slots are short verticals; connectors are the
// horizontals that make the tree parse as "everything funnels to one".
const Collapse: React.FC = () => {
  const frame = useCurrentFrame();
  const ROUNDS = [16, 8, 4, 2, 1];
  const colW = 300;
  const x0 = 230;
  const midY = 560;
  const span = 560;
  const slotH = 26;
  // y of slot i within a round of n, centred on midY.
  const yOf = (n: number, i: number) => midY - span / 2 + (i + 0.5) * (span / n);
  return (
    <Scene>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: 150, top: 150 }}>
          <Rise delay={2} preset="crisp">
            <Kicker>One road. One trophy.</Kicker>
          </Rise>
        </div>
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }} viewBox="0 0 1920 1080" preserveAspectRatio="none">
          {ROUNDS.map((n, ri) => {
            const appear = interpolate(frame, [10 + ri * 11, 28 + ri * 11], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: EASE.easeOutQuart,
            });
            const x = x0 + ri * colW;
            const isFinal = ri === ROUNDS.length - 1;
            const nextN = ROUNDS[ri + 1];
            // Every slot is white EXCEPT the final — the singular gets the gold.
            const col = isFinal ? D.palette.accent : "rgba(244,244,242,0.55)";
            return (
              <g key={ri} opacity={appear}>
                {Array.from({ length: n }).map((_, i) => {
                  const y = yOf(n, i);
                  return (
                    <React.Fragment key={i}>
                      {/* the slot — a short vertical bar */}
                      <line
                        x1={x}
                        y1={y - slotH / 2}
                        x2={x}
                        y2={y + slotH / 2}
                        stroke={col}
                        strokeWidth={isFinal ? 7 : 3}
                        strokeLinecap="round"
                      />
                      {/* connector feeding this pair one column right (not on the
                          final column — nothing to feed) */}
                      {!isFinal && nextN && i % 2 === 0 && (() => {
                        const yTop = yOf(n, i);
                        const yBot = yOf(n, i + 1);
                        const yMid = yOf(nextN, Math.floor(i / 2));
                        const xNext = x0 + (ri + 1) * colW;
                        const grow = interpolate(frame, [20 + ri * 11, 40 + ri * 11], [0, 1], {
                          extrapolateLeft: "clamp",
                          extrapolateRight: "clamp",
                          easing: EASE.easeOutQuart,
                        });
                        return (
                          <g stroke="rgba(244,244,242,0.28)" strokeWidth={2} fill="none">
                            <line x1={x} y1={yTop} x2={x + (colW * 0.5) * grow} y2={yTop} />
                            <line x1={x} y1={yBot} x2={x + (colW * 0.5) * grow} y2={yBot} />
                            <line x1={x + colW * 0.5} y1={yTop} x2={x + colW * 0.5} y2={yBot} opacity={grow} />
                            <line x1={x + colW * 0.5} y1={yMid} x2={xNext} y2={yMid} opacity={grow} />
                          </g>
                        );
                      })()}
                    </React.Fragment>
                  );
                })}
                {isFinal && (
                  <text
                    x={x + 24}
                    y={midY + 9}
                    fill={D.palette.accent}
                    fontFamily={FAMILY}
                    fontSize={30}
                    letterSpacing="0.06em"
                  >
                    FINAL
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </AbsoluteFill>
    </Scene>
  );
};

// ---------------------------------------------------------------------------
// 6 — 588-720 (4.4s). HERO HOLD. ONE TROPHY — the only lime, and it breathes.
// ---------------------------------------------------------------------------
const Trophy: React.FC = () => {
  // Gold arrives via opacity ONLY — no transform ancestor, or the
  // background-clip:text goes transparent in headless Chrome (see note below).
  const heroIn = useEnter(14, "weighty");
  return (
  <Scene black>
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <Rise delay={2} preset="crisp">
        <div style={{ ...label(24, { letterSpacing: "0.32em" }), marginBottom: 26 }}>
          It all comes down to
        </div>
      </Rise>
      {/* The hero. Gold lands ONCE — the singular, the trophy. Metallic, not
          flat. NOTE: background-clip:text goes transparent inside a TRANSFORMED
          ancestor in headless Chrome, so the gold arrives via opacity only (no
          Rise/Emphasis/Breathe wrapper — those all set a transform). The
          luxury-restraint brand wants a held gold hero anyway. */}
      <div style={H(210, { textAlign: "center", ...GOLD_TEXT, opacity: heroIn })}>ONE TROPHY</div>
      <div style={{ position: "relative", width: 460, height: 4, marginTop: 34 }}>
        <Rule color={D.palette.accent} thickness={4} delay={30} duration={18} origin="center" />
      </div>
    </AbsoluteFill>
  </Scene>
  );
};

// ---------------------------------------------------------------------------
// 7 — 720-828 (3.6s). The date slams in — a clip wipe, bone rule.
// ---------------------------------------------------------------------------
// The final's date/venue is the one fact to confirm before shipping (same as the
// explainer cut). Held here as the concrete anchor before the logo.
const FINAL = "July 19, 2026 · MetLife Stadium";
const DateSlam: React.FC = () => (
  <Scene>
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <ClipReveal delay={4} duration={16} from="left">
        <div style={H(120)}>THE FINAL</div>
      </ClipReveal>
      <div style={{ position: "relative", width: 520, height: 3, margin: "28px 0" }}>
        <Rule color={D.palette.accent} thickness={3} delay={22} duration={14} origin="center" />
      </div>
      <Rise delay={30} preset="crisp" distance={16}>
        <div style={label(24, { letterSpacing: "0.14em" })}>{FINAL}</div>
      </Rise>
    </AbsoluteFill>
  </Scene>
);

// ---------------------------------------------------------------------------
// 8 — 828-900 (2.4s). Logo resolve: the 2026 lockup lands in gold, a single
// gold dot arriving last. The closing singular — the last gold in the film.
// ---------------------------------------------------------------------------
const Logo: React.FC = () => (
  <Scene black>
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <Resolve
        accentAt={26}
        accentPreset="weighty"
        gap={26}
        accent={
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 12, height: 12, borderRadius: 6, background: D.palette.accent, boxShadow: `0 0 20px ${D.palette.accent}55` }} />
            <div style={label(22, { letterSpacing: "0.32em" })}>FIFA WORLD CUP</div>
          </div>
        }
      >
        <Lockup
          direction="column"
          gap={12}
          markDelay={2}
          wordDelay={10}
          preset="weighty"
          mark={
            <Badge bg="transparent" fg={D.palette.fg} delay={2} border={`2px solid ${D.palette.muted}`} radius={10} padding="6px 20px">
              <span style={label(22, { letterSpacing: "0.28em", color: D.palette.fg })}>NORTH AMERICA</span>
            </Badge>
          }
          wordmark={<div style={H(220, { ...GOLD_TEXT })}>2026</div>}
        />
      </Resolve>
    </AbsoluteFill>
  </Scene>
);

// ---------------------------------------------------------------------------
// Assembly. Beats are hard cuts on a driving pulse (score cut to in audio).
// ---------------------------------------------------------------------------
const SCENES: [React.FC, number, number][] = [
  [ColdOpen, 0, 108],
  [Hosts, 108, 108],
  [Matches, 216, 114],
  [Biggest, 330, 120],
  [Collapse, 450, 138],
  [Trophy, 588, 132],
  [DateSlam, 720, 108],
  [Logo, 828, 72],
];

const WorldCupHype: React.FC = () => {
  useDesignFonts(D);
  return (
    <AbsoluteFill style={{ background: D.palette.bg }}>
      {SCENES.map(([C, from, dur], i) => (
        <Sequence key={i} from={from} durationInFrames={dur}>
          <C />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

export const worldcupHypeVideo = defineVideo({
  id: "WorldCup2026Hype",
  component: WorldCupHype,
  durationInFrames: 900,
  ...LANDSCAPE,
  // Sound direction — the shared prompt engine (engine/audio-prompt.ts) turns
  // this into a music-generation prompt for a 3rd-party AI generator. Beat frames
  // are the real SCENES table above; the drop is the "ONE TROPHY" hero (f588).
  audio: {
    style:
      "Cinematic sports-broadcast anthem — World Cup / LoL-Worlds opening-title energy. Epic, driving, triumphant, instrumental. Modern trailer-hybrid: orchestra meets electronic.",
    instrumentation:
      "Deep sub bass, punchy four-on-the-floor kick, tight snare/clap backbeat, driving hi-hats, big brass stabs, soaring epic strings, a bright anthemic synth/brass HOOK, taiko/boom hits on the accents. No vocals.",
    tempoKey:
      "128 BPM. A minor, lifting to a brighter, triumphant major-flavoured voicing at the drop.",
    hook:
      "A short, memorable, anthemic 4-note motif (synth + brass in unison) that repeats through the build and resolves HIGHER and brighter at the drop — the part a listener would hum.",
    beats: [
      { frame: 0, role: "intro", label: "ColdOpen (48 NATIONS)" },
      { frame: 108, role: "build", label: "Hosts (3 to 16)" },
      { frame: 216, role: "build", label: "Matches (bracket)" },
      { frame: 330, role: "build", label: "Biggest (BIGGER to BIGGEST)" },
      { frame: 450, role: "riser", label: "Collapse (32 to 1)" },
      { frame: 588, role: "drop", label: "Trophy (ONE TROPHY)" },
      { frame: 720, role: "sustain", label: "DateSlam (THE FINAL)" },
      { frame: 828, role: "outro", label: "Logo (gold 2026)" },
    ],
    stingerFrame: 854, // the gold "2026" lands; the decisive closing hit
    exclude:
      "No vocals, no lyrics, no spoken word. No lo-fi, no chillhop. No fade-out ending. No genre drift mid-track. No cheesy EDM festival vocal-chop. Keep it cinematic and premium, not generic stock.",
    sfxNotes:
      "struck impacts on each hard cut, a whoosh into the chevrons (~4.55s), a ringing bell stinger on the gold logo (28.47s) — from score.py compose_sfx.",
  },
});
