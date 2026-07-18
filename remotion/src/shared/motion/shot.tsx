import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { EASE, type EaseName } from "./easing";

// =============================================================================
// Shot — 分镜 (shot breakdown) and 运镜 (camera movement)
// =============================================================================
// A scene is not one static wide take. Real product films cut WITHIN a scene:
// wide to establish the device, punch in on the thing being typed, hold close on
// the result, pull back to end. That rhythm is what makes a demo feel directed
// instead of recorded.
//
// The rules this encodes:
//   1. The SUBJECT never moves. The camera moves. If your phone mockup is
//      scaling, that's a prop animating itself — it reads as cheap and it pumps
//      on every cut.
//   2. Frame in subject space. You say "look at the omnibar at (540,1700) at
//      1.8x"; the maths puts that point in the middle of the frame.
//   3. Cut OR move, rarely both. A cut is free; a move costs time. Most beats
//      want a cut to a new framing, not a slow drift toward it.

/** One framing: where to look, and how close. */
export type Frame = {
  /** Point in composition space to centre. Defaults to frame centre. */
  x?: number;
  y?: number;
  /**
   * 1 = full frame. 1.15 = punched in slightly.
   *
   * MIND THE SUBJECT'S EDGES. When the subject is a framed object (a device, a
   * window), zooming past the point where its body leaves frame stops reading as
   * "an app on a phone" and becomes a bare UI — you lose the staging premise. The
   * punch-in ceiling is `frame_size / subject_size`: a subject filling most of
   * the frame leaves almost no room, so gentle punches are the useful range. If
   * you need to punch harder than the subject allows, stage the subject smaller
   * first — don't crop it away.
   */
  scale?: number;
};

/** A shot in a breakdown: hold this framing until `until`. */
export type ShotSpec = Frame & {
  /** Frame (relative to the scene) this shot runs until. */
  until: number;
  /**
   * How to get here from the previous shot:
   *  - "cut"  (default) instant. Free. Use for most beats.
   *  - "move" eased camera move over `moveFrames`.
   */
  via?: "cut" | "move";
  moveFrames?: number;
  ease?: EaseName;
};

const FULL: Required<Frame> = { x: -1, y: -1, scale: 1 };

/**
 * Camera — frames the composition on a point at a scale. The children are the
 * SUBJECT and never move; this moves the lens.
 *
 * Scaling about an arbitrary point: translate the point to frame centre, then
 * scale about that origin.
 */
export const Camera: React.FC<{ children: React.ReactNode; x: number; y: number; scale: number }> = ({
  children,
  x,
  y,
  scale,
}) => {
  const { width, height } = useVideoConfig();
  const cx = x < 0 ? width / 2 : x;
  const cy = y < 0 ? height / 2 : y;
  const left = width / 2 - cx * scale;
  const top = height / 2 - cy * scale;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          width,
          height,
          left,
          top,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      >
        {children}
      </div>
    </AbsoluteFill>
  );
};

const resolve = (s: Frame, w: number, h: number): Required<Frame> => ({
  x: s.x ?? w / 2,
  y: s.y ?? h / 2,
  scale: s.scale ?? 1,
});

/**
 * Shot — plays a breakdown over one scene. Give it the shot list; it cuts or
 * moves between framings and holds each until its `until` frame.
 *
 *   <Shot shots={[
 *     { until: 40 },                                  // wide establish
 *     { until: 150, x: 540, y: 1500, scale: 1.7 },    // cut: punch in on omnibar
 *     { until: 260, x: 540, y: 900,  scale: 1.4, via: "move", moveFrames: 24 },
 *     { until: 330 },                                 // pull back to wide
 *   ]}>
 *     <PhoneFrame>…</PhoneFrame>
 *   </Shot>
 */
export const Shot: React.FC<{ children: React.ReactNode; shots: ShotSpec[] }> = ({ children, shots }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // Which shot are we in?
  let i = shots.findIndex((s) => frame < s.until);
  if (i === -1) i = shots.length - 1;

  const cur = resolve(shots[i], width, height);
  const prev = i > 0 ? resolve(shots[i - 1], width, height) : resolve(shots[0] ?? FULL, width, height);
  const startedAt = i > 0 ? shots[i - 1].until : 0;

  const spec = shots[i];
  let f = cur;

  if (spec.via === "move" && i > 0) {
    const d = spec.moveFrames ?? 24;
    const t = interpolate(frame, [startedAt, startedAt + d], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EASE[spec.ease ?? "easeInOutQuint"],
    });
    f = {
      x: prev.x + (cur.x - prev.x) * t,
      y: prev.y + (cur.y - prev.y) * t,
      scale: prev.scale + (cur.scale - prev.scale) * t,
    };
  }

  return (
    <Camera x={f.x} y={f.y} scale={f.scale}>
      {children}
    </Camera>
  );
};
