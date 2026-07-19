import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { EASE, type EaseName } from "./easing";

// =============================================================================
// Morph — the continuity cut (match-on-action across a scene boundary)
// =============================================================================
// The golden-standard transition: an element on screen does not cut away, it
// BECOMES the next thing. A headline shrinks into a UI card; a photo settles into
// a grid cell; a question bubble lands as the first message in a chat. The eye
// never loses its anchor, so the seam disappears (Murch's eye-trace; 2001's bone
// -> spaceship match-cut, drawn instead of cut).
//
// The one rule this file exists to enforce:
//
//   THE LAST FRAME OF THE TRANSITION MUST EQUAL THE FIRST FRAME OF THE NEXT SCENE.
//
// If the morph lands its element on a HAND-BUILT copy of the next scene, any drift
// (a few px, a wrong line-height) shows as a snap at the cut. The reliable way to
// guarantee end == start is to DISSOLVE INTO THE REAL NEXT SCENE at the tail of
// the morph: render the actual next-scene component (frozen at its first frame)
// under the morphing element and fade it up while the element fades out. Then the
// transition's final frame is literally the next scene's first frame — matched by
// construction, not by measurement. `MorphInto` does exactly this.

// ---- Rect: an element's box + text metrics at a moment in the morph ----
// Position is the on-screen top-left anchor + explicit width/height so the box
// hugs its content at BOTH ends (no dead space when the text differs A vs B).
export type MorphRect = {
  /** Centre x of the box (px, composition space). */
  cx: number;
  /** Top edge of the box (px). Explicit top (not centre) so stacks are predictable. */
  top: number;
  /** Box width / height (px). Explicit — never driven by text flow. */
  w: number;
  h: number;
  /** Optional text metrics, lerped so type scales smoothly headline -> UI. */
  font?: number;
  padV?: number;
  padH?: number;
  radius?: number;
};

const lerp = (a: number, b: number, p: number) => a + (b - a) * p;

/** Interpolate every field of a rect from A to B at progress p (0..1). */
export const lerpRect = (a: MorphRect, b: MorphRect, p: number): MorphRect => ({
  cx: lerp(a.cx, b.cx, p),
  top: lerp(a.top, b.top, p),
  w: lerp(a.w, b.w, p),
  h: lerp(a.h, b.h, p),
  font: a.font !== undefined && b.font !== undefined ? lerp(a.font, b.font, p) : b.font ?? a.font,
  padV: a.padV !== undefined && b.padV !== undefined ? lerp(a.padV, b.padV, p) : b.padV ?? a.padV,
  padH: a.padH !== undefined && b.padH !== undefined ? lerp(a.padH, b.padH, p) : b.padH ?? a.padH,
  radius: a.radius !== undefined && b.radius !== undefined ? lerp(a.radius, b.radius, p) : b.radius ?? a.radius,
});

// ---- MorphInto: the continuity cut, done right ----
// Renders `next` (the real next scene, frozen at frame 0) underneath, and
// `render(rect, morph)` (your morphing element) on top. Over [start, start+dur]
// the morph progress goes 0 -> 1 and the element travels `from` -> `to`; over the
// LAST `settle` frames of that window the real next scene fades in and the element
// fades out, so the final frame is the next scene's first frame exactly.
//
// Usage (inside a Sequence that owns the transition span):
//   <MorphInto
//     from={headlineRect} to={cardRect}
//     start={HOOK_LEN} dur={34} settle={8}
//     next={<Scene2 frozen />}
//     render={(rect, morph) => <Card rect={rect} textMix={...} />}
//   />
// `next` MUST be the same component the following Sequence renders, positioned
// identically, frozen at its first frame (e.g. pass a delay so its clock reads 0).
export const MorphInto: React.FC<{
  from: MorphRect;
  to: MorphRect;
  /** Frame the morph begins (relative to this component's clock). */
  start: number;
  /** Morph duration in frames. */
  dur: number;
  /** How many frames at the END of the morph cross-dissolve into `next`. */
  settle?: number;
  /** Easing of the position/size interpolation. */
  ease?: EaseName;
  /** The REAL next scene, frozen at its first frame. Rendered underneath. */
  next: React.ReactNode;
  /** Anything to draw during the whole transition BEFORE the morph element (e.g.
   *  a glow, the scene-1 ground). Receives morph progress. */
  behind?: (morph: number) => React.ReactNode;
  /** The morphing element. Receives the current rect and morph progress (0..1). */
  render: (rect: MorphRect, morph: number) => React.ReactNode;
}> = ({ from, to, start, dur, settle = 8, ease = "easeInOutQuint", next, behind, render }) => {
  const f = useCurrentFrame();
  const morph = interpolate(f, [start, start + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE[ease],
  });
  // Dissolve into the real next scene over the last `settle` frames.
  const s = interpolate(f, [start + dur - settle, start + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const rect = lerpRect(from, to, morph);

  return (
    <AbsoluteFill>
      {behind && behind(morph)}
      {/* the REAL next scene, frozen — fades up so end == next's start by construction */}
      <AbsoluteFill style={{ opacity: s }}>{next}</AbsoluteFill>
      {/* the morphing element on top, fading out as the real scene settles in */}
      <AbsoluteFill style={{ opacity: 1 - s }}>{render(rect, morph)}</AbsoluteFill>
    </AbsoluteFill>
  );
};
