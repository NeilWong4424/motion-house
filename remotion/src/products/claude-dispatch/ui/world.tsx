import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { EASE } from "../../../shared/motion/easing";
import { CD } from "../design";

// =============================================================================
// Staged world — bone stage, beat picker, and a HANDOFF-aware device layer
// =============================================================================
// The reference film is a sequence of composed beats on a warm bone ground. Two
// beat kinds: "conversation" (phone full-frame) and "watch the work" (phone
// anchor + one desktop). Between them the signature move is NOT a cut — the phone
// scales down + slides to its anchor while the desktop slides in from the right,
// joined by the rust squiggle (see Squiggle in surfaces.tsx). Copy-line and
// hero-bubble beats HARD-CUT.
//
// DeviceLayer supports an eased entrance from an off-position (slide+scale) so a
// device can fly from full-frame to anchor, or in from the frame edge.

// -----------------------------------------------------------------------------
// Stage — the flat warm bone ground (barely-there vignette for depth).
// -----------------------------------------------------------------------------
export const Stage: React.FC<{ children: React.ReactNode; bg?: string }> = ({ children, bg = CD.bg }) => (
  <AbsoluteFill style={{ background: bg }}>
    {children}
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        background: `radial-gradient(120% 120% at 50% 45%, transparent 62%, rgba(28,26,23,0.12) 100%)`,
      }}
    />
  </AbsoluteFill>
);

// -----------------------------------------------------------------------------
// Beats — pick the current composition by frame (hard cut between them).
// -----------------------------------------------------------------------------
export type Beat = { at: number };

export const useBeat = <T extends Beat>(beats: T[]): { beat: T; index: number; local: number; nextAt: number } => {
  const f = useCurrentFrame();
  let i = 0;
  for (let k = 0; k < beats.length; k++) if (f >= beats[k].at) i = k;
  return { beat: beats[i], index: i, local: f - beats[i].at, nextAt: beats[i + 1]?.at ?? Infinity };
};

// -----------------------------------------------------------------------------
// DeviceLayer — place one device with depth, optional eased entrance.
// -----------------------------------------------------------------------------
// `x,y` = anchor top-left (composition px); `scale` = resting scale. If `from` is
// given, the device eases FROM {x,y,scale}+offset INTO the anchor over `dur`
// frames starting at `bornAt` — this is how the handoff slides devices in. Omit
// `from` for a plain 3-frame cut-in (hard-cut beats).
type FromSpec = { dx?: number; dy?: number; scale?: number };

export const DeviceLayer: React.FC<{
  x: number;
  y: number;
  scale: number;
  z?: number;
  shadow?: boolean;
  bornAt: number;
  holdFor: number;
  from?: FromSpec;
  dur?: number;
  children: React.ReactNode;
}> = ({ x, y, scale, z = 0, shadow = true, bornAt, holdFor, from, dur = 9, children }) => {
  const f = useCurrentFrame();
  const cut = interpolate(f, [bornAt, bornAt + 3], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // Very slow life-push across the held beat.
  const push = interpolate(f, [bornAt, bornAt + holdFor], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.easeInOutQuint });

  let tx = x;
  let ty = y;
  let s = scale * (1 + 0.014 * push);
  let op = cut;
  if (from) {
    const p = interpolate(f, [bornAt, bornAt + dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.easeInOutQuint });
    tx = x + (from.dx ?? 0) * (1 - p);
    ty = y + (from.dy ?? 0) * (1 - p);
    const s0 = (from.scale ?? scale) * scale === 0 ? scale : from.scale ?? scale;
    s = interpolate(p, [0, 1], [s0, scale]) * (1 + 0.014 * push);
    op = interpolate(f, [bornAt, bornAt + 2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  }

  return (
    <div
      style={{
        position: "absolute",
        left: tx,
        top: ty,
        transform: `scale(${s})`,
        transformOrigin: "top left",
        zIndex: z,
        opacity: op,
        filter: shadow ? "drop-shadow(0 40px 80px rgba(60,45,30,0.28))" : undefined,
      }}
    >
      {children}
    </div>
  );
};
