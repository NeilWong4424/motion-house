import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { EASE } from "../../../shared/motion/easing";
import { MB } from "../design";

// =============================================================================
// Staged compositions — phone anchor + one device per beat (reference model)
// =============================================================================
// Rebuilt to match the reference film's structure: NOT a camera flown across a
// canvas, but a sequence of deliberately COMPOSED beats. Each beat frames at most
// two devices (a phone anchor + one desktop) with depth — foreground larger, soft
// shadow, bleeding off the frame edges — and beats HARD-CUT between "conversation"
// (phone full-frame) and "watch the work" (phone small + desktop). Inside each
// device, content changes with the app's own transitions (see surfaces.tsx).
//
// A device keeps a stable key across beats; its screen content is driven by the
// global film frame, so history is continuous even when a device leaves/re-enters
// the frame across a cut.

// -----------------------------------------------------------------------------
// Stage — the near-black depth wash so floating devices' shadows read.
// -----------------------------------------------------------------------------
export const Stage: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ background: `radial-gradient(125% 90% at 50% 42%, ${MB.stageHi} 0%, ${MB.black} 52%, ${MB.stageLo} 100%)` }}>
    {children}
  </AbsoluteFill>
);

// -----------------------------------------------------------------------------
// Beats — pick the current composition by frame (hard cut between them).
// -----------------------------------------------------------------------------
export type Beat = { at: number };

export const useBeat = <T extends Beat>(beats: T[]): { beat: T; index: number; local: number } => {
  const f = useCurrentFrame();
  let i = 0;
  for (let k = 0; k < beats.length; k++) if (f >= beats[k].at) i = k;
  return { beat: beats[i], index: i, local: f - beats[i].at };
};

// -----------------------------------------------------------------------------
// DeviceLayer — place one device in the frame with depth + a slow life-push.
// -----------------------------------------------------------------------------
// `x,y` top-left in composition px; `scale` scales the device's intrinsic size.
// `shadow` adds the soft ambient shadow that makes it float on the stage (these
// are devices in a scene, not MyBola's own flat UI — a device body shadow is
// legit and is what gives the reference its polish). `bornAt` starts a 3-frame
// cut-in + a very slow push so a held frame breathes.
export const DeviceLayer: React.FC<{
  x: number;
  y: number;
  scale: number;
  z?: number;
  shadow?: boolean;
  bornAt: number;
  holdFor: number;
  children: React.ReactNode;
}> = ({ x, y, scale, z = 0, shadow = false, bornAt, holdFor, children }) => {
  const f = useCurrentFrame();
  // 3-frame cut-in (avoids a one-frame flash without softening the cut).
  const cut = interpolate(f, [bornAt, bornAt + 3], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // Very slow push across the held beat — life without moving the eye.
  const push = interpolate(f, [bornAt, bornAt + holdFor], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.easeInOutQuint });
  const s = scale * (1 + 0.018 * push);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `scale(${s})`,
        transformOrigin: "top left",
        zIndex: z,
        opacity: cut,
        filter: shadow ? "drop-shadow(0 44px 90px rgba(0,0,0,0.6))" : undefined,
      }}
    >
      {children}
    </div>
  );
};
