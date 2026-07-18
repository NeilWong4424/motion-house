import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { EASE, type EaseName, type SpringName } from "./easing";
import { useEnter } from "./reveal";

// =============================================================================
// Kinetic typography — type as motion.
// =============================================================================
// Beyond TextReveal (rise+fade, in reveal.tsx). These treat type as the graphic:
// emphasis, swaps, sweeps, tracking. Style-agnostic — colour/size/font from the
// caller. The craft rule holds: per-character motion belongs on 1–3 words, never
// a sentence; big display type, one weight jump, and let it SIT so it can be
// read after it stops moving.

/**
 * Pop one word for emphasis on `at`: a quick scale + optional colour shift that
 * settles. Use on the single word the line turns on — scarcity is the point.
 */
export const Emphasis: React.FC<{
  children: React.ReactNode;
  at?: number;
  preset?: SpringName;
  color?: string;
  scale?: number;
  style?: React.CSSProperties;
}> = ({ children, at = 0, preset = "bouncy", color, scale = 1.14, style }) => {
  const s = useEnter(at, preset);
  return (
    <span style={{ display: "inline-block", transform: `scale(${interpolate(s, [0, 1], [1, scale])})`, color, transformOrigin: "center", ...style }}>
      {children}
    </span>
  );
};

/**
 * Swap one word out for another: the old rises out and fades, the new rises in.
 * `at` is the swap frame; `d` the crossover length. Keeps a fixed inline slot so
 * neighbours don't reflow.
 */
export const WordSwap: React.FC<{
  from: string;
  to: string;
  at: number;
  d?: number;
  travel?: number;
  ease?: EaseName;
  style?: React.CSSProperties;
}> = ({ from, to, at, d = 12, travel = 24, ease = "easeOutQuart", style }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + d], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE[ease] });
  return (
    <span style={{ position: "relative", display: "inline-block", ...style }}>
      {/* invisible sizer keeps the wider of the two words' width */}
      <span style={{ visibility: "hidden" }}>{from.length >= to.length ? from : to}</span>
      <span style={{ position: "absolute", inset: 0, opacity: 1 - p, transform: `translateY(${-travel * p}px)` }}>{from}</span>
      <span style={{ position: "absolute", inset: 0, opacity: p, transform: `translateY(${travel * (1 - p)}px)` }}>{to}</span>
    </span>
  );
};

/**
 * A colour bar sweeps behind (or under) text — a highlight landing on a phrase.
 * `under` draws it as an underline stripe rather than a full-height fill.
 */
export const HighlightSweep: React.FC<{
  children: React.ReactNode;
  color: string;
  at?: number;
  d?: number;
  under?: boolean;
  ease?: EaseName;
  style?: React.CSSProperties;
}> = ({ children, color, at = 0, d = 16, under = false, ease = "easeOutQuart", style }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + d], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE[ease] });
  return (
    <span style={{ position: "relative", display: "inline-block", padding: "0 4px", ...style }}>
      <span
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: under ? 2 : 0,
          top: under ? undefined : 0,
          height: under ? "0.18em" : "100%",
          background: color,
          transformOrigin: "left",
          transform: `scaleX(${p})`,
          zIndex: 0,
        }}
      />
      <span style={{ position: "relative", zIndex: 1 }}>{children}</span>
    </span>
  );
};

/**
 * Letters settle in from wide tracking: starts spaced out and loose, tightens to
 * rest. A classic title-card entrance. Use on short display lines.
 */
export const TrackingIn: React.FC<{
  text: string;
  at?: number;
  d?: number;
  fromSpacing?: number;
  ease?: EaseName;
  style?: React.CSSProperties;
}> = ({ text, at = 0, d = 22, fromSpacing = 28, ease = "easeOutExpo", style }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + d], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE[ease] });
  return (
    <span style={{ display: "inline-block", letterSpacing: interpolate(p, [0, 1], [fromSpacing, 0]), opacity: p, ...style }}>
      {text}
    </span>
  );
};

/**
 * Per-line mask reveal: each line wipes up behind its own mask, staggered. Reads
 * as printed rather than projected — no fade. Generalises MaskWipe to multi-line.
 */
export const LineMask: React.FC<{
  lines: string[];
  at?: number;
  step?: number;
  d?: number;
  ease?: EaseName;
  lineStyle?: React.CSSProperties;
}> = ({ lines, at = 0, step = 4, d = 16, ease = "easeOutQuart", lineStyle }) => {
  const frame = useCurrentFrame();
  return (
    <span style={{ display: "block" }}>
      {lines.map((line, i) => {
        const delay = at + i * step;
        const p = interpolate(frame, [delay, delay + d], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE[ease] });
        const mask = `linear-gradient(to top, #000 ${p}%, transparent ${p}%)`;
        return (
          <span key={i} style={{ display: "block", WebkitMaskImage: mask, maskImage: mask, ...lineStyle }}>
            {line}
          </span>
        );
      })}
    </span>
  );
};
