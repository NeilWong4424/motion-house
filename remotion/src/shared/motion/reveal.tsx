import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { EASE, SPRING, type EaseName, type SpringName } from "./easing";

// =============================================================================
// Reveal kit — how things arrive on screen.
// =============================================================================
// Style-agnostic: every component takes colour/size from its caller, so the same
// reveal serves any design language. Compose these instead of hand-rolling
// timing per scene — consistent motion is most of what "premium" means.

/** Spring value 0->1 for an element starting at `delay` frames into the scene. */
export const useEnter = (delay = 0, preset: SpringName = "settle"): number => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: SPRING[preset] });
};

/**
 * Rise + fade. The workhorse entrance.
 * `distance` is how far it travels — keep it short (20-40px at 1080p); long
 * travel reads as sluggish no matter the curve.
 */
export const Rise: React.FC<{
  children: React.ReactNode;
  delay?: number;
  distance?: number;
  preset?: SpringName;
}> = ({ children, delay = 0, distance = 28, preset = "settle" }) => {
  const s = useEnter(delay, preset);
  return (
    <div style={{ opacity: s, transform: `translateY(${interpolate(s, [0, 1], [distance, 0])}px)` }}>
      {children}
    </div>
  );
};

/**
 * Stagger children so they land in sequence rather than together. This single
 * device separates amateur motion from professional: the eye follows an order.
 */
export const Stagger: React.FC<{
  children: React.ReactNode;
  delay?: number;
  step?: number;
  distance?: number;
  preset?: SpringName;
}> = ({ children, delay = 0, step = 3, distance = 28, preset = "settle" }) => (
  <>
    {React.Children.map(children, (child, i) => (
      <Rise delay={delay + i * step} distance={distance} preset={preset}>
        {child}
      </Rise>
    ))}
  </>
);

/**
 * Reveal text by line, word, or character.
 * `by="line"` is the safe default. `by="char"` is expensive-looking on short
 * display type and unreadable on long copy — use it on 1-3 words, never a
 * sentence.
 */
export const TextReveal: React.FC<{
  text: string;
  by?: "line" | "word" | "char";
  delay?: number;
  step?: number;
  distance?: number;
  preset?: SpringName;
  style?: React.CSSProperties;
}> = ({ text, by = "line", delay = 0, step = 3, distance = 24, preset = "settle", style }) => {
  const parts = by === "line" ? text.split("\n") : by === "word" ? text.split(" ") : [...text];
  const inline = by !== "line";
  return (
    <span style={{ display: inline ? "inline-flex" : "block", flexWrap: "wrap", ...style }}>
      {parts.map((part, i) => (
        <span key={i} style={{ display: inline ? "inline-block" : "block", whiteSpace: "pre" }}>
          <Rise delay={delay + i * step} distance={distance} preset={preset}>
            {part}
            {by === "word" && i < parts.length - 1 ? " " : ""}
          </Rise>
        </span>
      ))}
    </span>
  );
};

/**
 * Wipe content in behind a moving mask — no fade. Reads as crisp and physical;
 * good for type that should feel printed rather than projected.
 */
export const MaskWipe: React.FC<{
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  direction?: "up" | "down" | "left" | "right";
  ease?: EaseName;
}> = ({ children, delay = 0, duration = 18, direction = "up", ease = "easeOutQuart" }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [delay, delay + duration], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE[ease],
  });
  const from = { up: "to top", down: "to bottom", left: "to left", right: "to right" }[direction];
  return (
    <div style={{ WebkitMaskImage: `linear-gradient(${from}, #000 ${p}%, transparent ${p}%)`, maskImage: `linear-gradient(${from}, #000 ${p}%, transparent ${p}%)` }}>
      {children}
    </div>
  );
};

/** Count a number up. `format` controls separators/currency/decimals. */
export const CountUp: React.FC<{
  to: number;
  from?: number;
  delay?: number;
  duration?: number;
  ease?: EaseName;
  format?: (n: number) => string;
  style?: React.CSSProperties;
}> = ({ to, from = 0, delay = 0, duration = 30, ease = "easeOutExpo", format = (n) => Math.round(n).toLocaleString(), style }) => {
  const frame = useCurrentFrame();
  const v = interpolate(frame, [delay, delay + duration], [from, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE[ease],
  });
  return <span style={style}>{format(v)}</span>;
};

/**
 * Depth by differential speed. `depth` < 1 moves slower than the camera (further
 * away), > 1 faster (nearer). Subtle wins: 0.85 / 1.15 is plenty.
 */
export const Parallax: React.FC<{
  children: React.ReactNode;
  depth?: number;
  travel?: number;
  ease?: EaseName;
}> = ({ children, depth = 0.9, travel = 40, ease = "easeInOutQuint" }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const p = interpolate(frame, [0, durationInFrames], [0, 1], {
    extrapolateRight: "clamp",
    easing: EASE[ease],
  });
  return <div style={{ transform: `translateY(${p * travel * (1 - depth)}px)` }}>{children}</div>;
};
