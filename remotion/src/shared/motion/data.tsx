import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { EASE, type EaseName } from "./easing";

// =============================================================================
// Data motion — numbers and charts that arrive.
// =============================================================================
// Style-agnostic: every colour and dimension comes from the caller (feed series
// colours from the design language or the dataviz skill's palette). The craft
// rule: animate a number HONESTLY — a bar grows to its true value once and holds;
// it does not overshoot past the real figure for drama. Reveal pacing carries
// the meaning; the chart is not decoration.
//
// `CountUp` (the number itself) lives in reveal.tsx. These are the marks.

/** Eased 0->1 progress over [delay, delay+duration]. Shared by every mark here. */
const useGrow = (delay: number, duration: number, ease: EaseName): number => {
  const frame = useCurrentFrame();
  return interpolate(frame, [delay, delay + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE[ease],
  });
};

/**
 * A bar that grows to `value` (0..1 of its track). Horizontal by default;
 * `vertical` makes it a column growing up.
 */
export const Bar: React.FC<{
  value: number;
  color: string;
  track?: string;
  thickness?: number;
  length?: number | string;
  vertical?: boolean;
  radius?: number;
  delay?: number;
  duration?: number;
  ease?: EaseName;
  style?: React.CSSProperties;
}> = ({ value, color, track = "transparent", thickness = 24, length = "100%", vertical = false, radius = 6, delay = 0, duration = 24, ease = "easeOutQuart", style }) => {
  const p = useGrow(delay, duration, ease) * value;
  const long = vertical ? { height: length, width: thickness } : { width: length, height: thickness };
  return (
    <div style={{ background: track, borderRadius: radius, overflow: "hidden", display: vertical ? "flex" : "block", alignItems: "flex-end", ...long, ...style }}>
      <div style={{ background: color, borderRadius: radius, transformOrigin: vertical ? "bottom" : "left", transform: vertical ? `scaleY(${p})` : `scaleX(${p})`, width: "100%", height: "100%" }} />
    </div>
  );
};

/** Alias — a Column is a vertical Bar. */
export const Column: React.FC<React.ComponentProps<typeof Bar>> = (props) => <Bar {...props} vertical />;

/**
 * A progress ring / arc that sweeps to `value` (0..1). `gap` leaves the ring
 * open at the bottom for a gauge feel (degrees of the full circle omitted).
 */
export const Ring: React.FC<{
  value: number;
  color: string;
  track?: string;
  size?: number;
  thickness?: number;
  gap?: number;
  delay?: number;
  duration?: number;
  ease?: EaseName;
  children?: React.ReactNode;
}> = ({ value, color, track = "rgba(255,255,255,0.12)", size = 200, thickness = 16, gap = 0, delay = 0, duration = 28, ease = "easeOutExpo", children }) => {
  const p = useGrow(delay, duration, ease) * value;
  const r = (size - thickness) / 2;
  const circ = 2 * Math.PI * r;
  const sweep = (360 - gap) / 360;
  const dash = circ * sweep;
  const rot = -90 + gap / 2; // start at top, centre the gap at the bottom
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: `rotate(${rot}deg)` }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={thickness} strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={thickness} strokeDasharray={`${dash * p} ${circ}`} strokeLinecap="round" />
      </svg>
      {children ? <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>{children}</div> : null}
    </div>
  );
};

/**
 * A line/area chart whose path draws on left-to-right. `points` are [x,y] in
 * data space; this maps them into an SVG viewBox and draws the stroke on, then
 * (optionally) fills the area under it.
 */
export const LineChart: React.FC<{
  points: [number, number][];
  stroke: string;
  fill?: string;
  strokeWidth?: number;
  width?: number;
  height?: number;
  pad?: number;
  delay?: number;
  duration?: number;
  ease?: EaseName;
}> = ({ points, stroke, fill = "none", strokeWidth = 3, width = 600, height = 300, pad = 12, delay = 0, duration = 32, ease = "easeInOutQuint" }) => {
  const frame = useCurrentFrame();
  const xs = points.map((p) => p[0]);
  const ys = points.map((p) => p[1]);
  const [x0, x1] = [Math.min(...xs), Math.max(...xs)];
  const [y0, y1] = [Math.min(...ys), Math.max(...ys)];
  const sx = (x: number) => pad + ((x - x0) / (x1 - x0 || 1)) * (width - 2 * pad);
  const sy = (y: number) => height - pad - ((y - y0) / (y1 - y0 || 1)) * (height - 2 * pad);
  const line = points.map((p, i) => `${i ? "L" : "M"}${sx(p[0])} ${sy(p[1])}`).join(" ");
  const area = `${line} L${sx(x1)} ${height - pad} L${sx(x0)} ${height - pad} Z`;
  const p = interpolate(frame, [delay, delay + duration], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE[ease] });
  const areaOpacity = interpolate(frame, [delay + duration * 0.6, delay + duration], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <svg width={width} height={height}>
      {fill !== "none" ? <path d={area} fill={fill} opacity={areaOpacity} /> : null}
      <path d={line} fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={p} />
    </svg>
  );
};

/**
 * An axis baseline + gridlines that arrive. Minimal by design — the data is the
 * subject, the axis is support (muted colour, thin).
 */
export const Axis: React.FC<{
  color: string;
  width?: number;
  height?: number;
  ticks?: number;
  delay?: number;
  duration?: number;
}> = ({ color, width = 600, height = 300, ticks = 4, delay = 0, duration = 14 }) => {
  const p = useGrow(delay, duration, "easeOutQuart");
  const rows = Array.from({ length: ticks }, (_, i) => (height / ticks) * (i + 1));
  return (
    <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
      {rows.map((y, i) => (
        <line key={i} x1={0} y1={y} x2={width * p} y2={y} stroke={color} strokeWidth={1} opacity={0.4} />
      ))}
      <line x1={0} y1={height} x2={width * p} y2={height} stroke={color} strokeWidth={2} />
    </svg>
  );
};

/**
 * A continuous horizontal marquee of items — the one legitimate use of a linear
 * rate (a ticker should not ease). `speed` is px/second.
 */
export const Ticker: React.FC<{
  children: React.ReactNode;
  speed?: number;
  gap?: number;
  style?: React.CSSProperties;
}> = ({ children, speed = 120, gap = 60, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const x = -(frame / fps) * speed;
  return (
    <div style={{ display: "flex", whiteSpace: "nowrap", gap, transform: `translateX(${x}px)`, ...style }}>
      {children}
      {children}
    </div>
  );
};
