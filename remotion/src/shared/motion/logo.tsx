import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { type SpringName } from "./easing";
import { useEnter } from "./reveal";
import { LineDraw } from "./graphic";

// =============================================================================
// Logo / brand resolve — how a mark lands.
// =============================================================================
// Every launch film ends on a lockup. Today that's hand-rolled per cut; these
// are the reusable pieces. Style-agnostic — the mark path, wordmark, and colours
// come from the caller (the product's brand). The craft rule: a resolve is the
// film's final held frame — elements settle, the accent lands ONCE, and it holds.
// Not a spin, not a shine sweep — restraint is what reads as expensive.

/**
 * Draw a logo mark on: a stroke-reveal of the mark's path, optionally filling in
 * after the outline completes. `d` is the mark path in a 0..100 viewBox.
 */
export const MarkDraw: React.FC<{
  d: string;
  stroke: string;
  fill?: string;
  size?: number;
  strokeWidth?: number;
  delay?: number;
  duration?: number;
  /** Frames after the draw completes before the fill fades in. */
  fillDelay?: number;
}> = ({ d, stroke, fill, size = 200, strokeWidth = 3, delay = 0, duration = 26, fillDelay = 6 }) => {
  const frame = useCurrentFrame();
  const fillOpacity = fill
    ? interpolate(frame, [delay + duration + fillDelay, delay + duration + fillDelay + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 0;
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      {fill ? (
        <svg viewBox="0 0 100 100" width={size} height={size} style={{ position: "absolute", inset: 0, opacity: fillOpacity }}>
          <path d={d} fill={fill} />
        </svg>
      ) : null}
      <LineDraw d={d} stroke={stroke} strokeWidth={strokeWidth} delay={delay} duration={duration} width={size} height={size} />
    </div>
  );
};

/**
 * Assemble a lockup: the mark and the wordmark arrive together (or in sequence)
 * and settle. Pass the mark and wordmark as children; `gap` and `direction`
 * control the layout. This is the container; the mark can be a MarkDraw.
 */
export const Lockup: React.FC<{
  mark: React.ReactNode;
  wordmark: React.ReactNode;
  direction?: "row" | "column";
  gap?: number;
  markDelay?: number;
  wordDelay?: number;
  preset?: SpringName;
}> = ({ mark, wordmark, direction = "column", gap = 28, markDelay = 0, wordDelay = 8, preset = "weighty" }) => {
  const ws = useEnter(wordDelay, preset);
  const ms = useEnter(markDelay, preset);
  return (
    <div style={{ display: "flex", flexDirection: direction, alignItems: "center", gap }}>
      <div style={{ opacity: ms, transform: `scale(${interpolate(ms, [0, 1], [0.94, 1])})` }}>{mark}</div>
      <div style={{ opacity: ws, transform: `translateY(${interpolate(ws, [0, 1], [18, 0])}px)` }}>{wordmark}</div>
    </div>
  );
};

/**
 * The full resolve: a lockup that settles, then the accent lands ONCE — a single
 * accent element (a dot, a rule, a tagline) arriving last after a deliberate
 * beat. This is the ending, held. `accentAt` is when the accent lands.
 */
export const Resolve: React.FC<{
  children: React.ReactNode;
  accent: React.ReactNode;
  accentAt: number;
  accentPreset?: SpringName;
  gap?: number;
}> = ({ children, accent, accentAt, accentPreset = "crisp", gap = 30 }) => {
  const a = useEnter(accentAt, accentPreset);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap }}>
      {children}
      <div style={{ opacity: a, transform: `translateY(${interpolate(a, [0, 1], [12, 0])}px)` }}>{accent}</div>
    </div>
  );
};
