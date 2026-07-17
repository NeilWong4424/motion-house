import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { EASE, type EaseName } from "./easing";

// =============================================================================
// Transitions — how one scene becomes the next.
// =============================================================================
// Restraint rule: a video should use one or two transition types, not six. The
// transition is punctuation, not content — if the viewer notices it, it's too
// much. Hard cuts are underrated: cut on the beat and the edit disappears.

/**
 * Fade in at the head of a scene and out at its tail. The safe default, and what
 * the MyBola cut uses throughout.
 * `d` = frames of fade on each side.
 */
export const FadeIn: React.FC<{ children: React.ReactNode; d?: number }> = ({ children, d = 8 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const o = interpolate(frame, [0, d, durationInFrames - d, durationInFrames], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
};

/**
 * Slow settle across a scene: eases down from a slight scale-up while rising.
 * Gives a static composition life without moving anything the eye tracks.
 */
export const Drift: React.FC<{ children: React.ReactNode; scale?: number; rise?: number }> = ({
  children,
  scale = 0.035,
  rise = 22,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const p = interpolate(frame, [0, durationInFrames], [0, 1]);
  const e = p * p * (3 - 2 * p);
  return (
    <AbsoluteFill style={{ transform: `scale(${1 + scale - scale * e}) translateY(${-rise * (1 - e)}px)` }}>
      {children}
    </AbsoluteFill>
  );
};

/**
 * Slow cinematic camera: push in (or out) with optional drift across the scene.
 * The subject stays still; only the camera moves — that's what keeps a demo
 * feeling filmed rather than animated.
 */
export const Camera: React.FC<{
  children: React.ReactNode;
  zoomFrom?: number;
  zoomTo?: number;
  driftX?: number;
  driftY?: number;
  ease?: EaseName;
}> = ({ children, zoomFrom = 1.0, zoomTo = 1.045, driftX = 0, driftY = 0, ease = "easeInOutQuint" }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const p = interpolate(frame, [0, durationInFrames], [0, 1], {
    extrapolateRight: "clamp",
    easing: EASE[ease],
  });
  const z = zoomFrom + (zoomTo - zoomFrom) * p;
  return (
    <AbsoluteFill style={{ transform: `scale(${z}) translate(${driftX * p}px, ${driftY * p}px)` }}>
      {children}
    </AbsoluteFill>
  );
};

/**
 * Dip through a colour (black/white/brand) between beats. Reads as a deliberate
 * chapter break — stronger punctuation than a cross-dissolve.
 */
export const DipTo: React.FC<{ colour: string; at: number; d?: number }> = ({ colour, at, d = 6 }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [at - d, at, at + d], [0, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  if (o <= 0) return null;
  return <AbsoluteFill style={{ background: colour, opacity: o, pointerEvents: "none" }} />;
};

/**
 * Push the scene in from an edge. Directional continuity: push left when moving
 * "forward" through a narrative, right to go back.
 */
export const Push: React.FC<{
  children: React.ReactNode;
  from?: "left" | "right" | "top" | "bottom";
  d?: number;
  ease?: EaseName;
}> = ({ children, from = "right", d = 16, ease = "easeOutQuart" }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const p = interpolate(frame, [0, d], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE[ease],
  });
  const axis = from === "left" || from === "right" ? "X" : "Y";
  const sign = from === "left" || from === "top" ? -1 : 1;
  const span = axis === "X" ? width : height;
  return (
    <AbsoluteFill style={{ transform: `translate${axis}(${p * span * sign}px)` }}>{children}</AbsoluteFill>
  );
};
