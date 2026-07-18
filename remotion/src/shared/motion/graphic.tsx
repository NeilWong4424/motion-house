import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { EASE, type EaseName, type SpringName } from "./easing";
import { useEnter } from "./reveal";

// =============================================================================
// Graphic motion — confident graphic shapes.
// =============================================================================
// The "confident graphic shapes" pillar (LoL-Worlds energy). Style-agnostic:
// every colour and size comes from the caller, so the same shape carries any
// design language. `LineDraw` is the shared foundation the data and logo modules
// build on — a stroke that draws itself on with stroke-dashoffset.
//
// Restraint still rules: a shape that draws on and then sits is punctuation. A
// shape that keeps wiggling is decoration. Draw it, land it, hold.

/**
 * Draw an SVG path on by animating stroke-dashoffset from full length to 0.
 * The foundation for marks, charts, brackets, underlines. Give it a `d` path in
 * a `viewBox`-normalised space (default 0 0 100 100) and a stroke colour.
 *
 *   <LineDraw d="M4 50 H96" stroke={accent} delay={6} duration={20} />
 */
export const LineDraw: React.FC<{
  d: string;
  stroke: string;
  /** SVG user-units. The path's own length is measured at runtime via pathLength. */
  strokeWidth?: number;
  delay?: number;
  duration?: number;
  ease?: EaseName;
  viewBox?: string;
  width?: number | string;
  height?: number | string;
  fill?: string;
  strokeLinecap?: "butt" | "round" | "square";
  style?: React.CSSProperties;
}> = ({
  d,
  stroke,
  strokeWidth = 2,
  delay = 0,
  duration = 20,
  ease = "easeOutQuart",
  viewBox = "0 0 100 100",
  width = "100%",
  height = "100%",
  fill = "none",
  strokeLinecap = "round",
  style,
}) => {
  const frame = useCurrentFrame();
  // pathLength normalises the path to 1 unit, so dash maths is path-independent.
  const p = interpolate(frame, [delay, delay + duration], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE[ease],
  });
  return (
    <svg viewBox={viewBox} width={width} height={height} style={style} preserveAspectRatio="none">
      <path
        d={d}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap={strokeLinecap}
        strokeLinejoin="round"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={p}
      />
    </svg>
  );
};

/**
 * An animated rule / divider / underline: a line that sweeps out from one end.
 * Horizontal by default. `origin` is which end it grows from.
 */
export const Rule: React.FC<{
  color: string;
  thickness?: number;
  delay?: number;
  duration?: number;
  vertical?: boolean;
  origin?: "start" | "center" | "end";
  ease?: EaseName;
  style?: React.CSSProperties;
}> = ({ color, thickness = 3, delay = 0, duration = 16, vertical = false, origin = "start", ease = "easeOutQuart", style }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [delay, delay + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE[ease],
  });
  const originMap = { start: vertical ? "top" : "left", center: "center", end: vertical ? "bottom" : "right" } as const;
  return (
    <div
      style={{
        background: color,
        transformOrigin: originMap[origin],
        transform: vertical ? `scaleY(${p})` : `scaleX(${p})`,
        [vertical ? "width" : "height"]: thickness,
        [vertical ? "height" : "width"]: "100%",
        ...style,
      }}
    />
  );
};

/**
 * A badge / chip that pops in on its spring. Content and colours from the caller;
 * the accent belongs to the design language, used sparingly.
 */
export const Badge: React.FC<{
  children: React.ReactNode;
  bg: string;
  fg: string;
  delay?: number;
  preset?: SpringName;
  radius?: number;
  padding?: string;
  border?: string;
  style?: React.CSSProperties;
}> = ({ children, bg, fg, delay = 0, preset = "crisp", radius = 8, padding = "8px 18px", border, style }) => {
  const s = useEnter(delay, preset);
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        background: bg,
        color: fg,
        borderRadius: radius,
        padding,
        border,
        opacity: s,
        transform: `scale(${interpolate(s, [0, 1], [0.9, 1])})`,
        ...style,
      }}
    >
      {children}
    </span>
  );
};

/**
 * Draw-on corner brackets around a region — a confident "look here" frame.
 * Renders four L-shaped strokes that draw in. `inset` pulls the brackets inward.
 */
export const Bracket: React.FC<{
  color: string;
  strokeWidth?: number;
  arm?: number;
  delay?: number;
  duration?: number;
  inset?: number;
  style?: React.CSSProperties;
}> = ({ color, strokeWidth = 3, arm = 22, delay = 0, duration = 16, inset = 0, style }) => {
  const a = arm;
  const lo = inset;
  const hi = 100 - inset;
  // top-left, top-right, bottom-right, bottom-left L-paths in a 0..100 box.
  const corners = [
    `M${lo} ${lo + a} V${lo} H${lo + a}`,
    `M${hi - a} ${lo} H${hi} V${lo + a}`,
    `M${hi} ${hi - a} V${hi} H${hi - a}`,
    `M${lo + a} ${hi} H${lo} V${hi - a}`,
  ];
  return (
    <div style={{ position: "absolute", inset: 0, ...style }}>
      {corners.map((d, i) => (
        <div key={i} style={{ position: "absolute", inset: 0 }}>
          <LineDraw d={d} stroke={color} strokeWidth={strokeWidth} delay={delay + i} duration={duration} />
        </div>
      ))}
    </div>
  );
};

/**
 * Morph between two clip-path shapes over the scene (or a window). Both shapes
 * must be the same clip-path type with the same point count for a clean tween.
 * Pass CSS `clip-path` strings; this crossfades the container while swapping —
 * a lightweight morph that avoids a path-interpolation dependency.
 */
export const ShapeMorph: React.FC<{
  children: React.ReactNode;
  from: string;
  to: string;
  delay?: number;
  duration?: number;
  ease?: EaseName;
}> = ({ children, from, to, delay = 0, duration = 20, ease = "easeInOutQuint" }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [delay, delay + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE[ease],
  });
  // Two layers, one clipped to `from` fading out, one to `to` fading in.
  return (
    <div style={{ position: "relative" }}>
      <div style={{ clipPath: from, opacity: 1 - p }}>{children}</div>
      <div style={{ position: "absolute", inset: 0, clipPath: to, opacity: p }}>{children}</div>
    </div>
  );
};
