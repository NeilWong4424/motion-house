import React from "react";
import { AbsoluteFill } from "remotion";
import { familyOf } from "../../../shared/design/types";
import { BLACK, worldcupHype as D } from "../design";

// =============================================================================
// Hype staging — the FWC26 master-brand set: black, a whisper of warm centre
// light, a vignette. No colour wash (the master brand is monochrome; the gold
// is the only colour, and it belongs to the trophy/hero, not the ground).
// =============================================================================

const FAMILY = familyOf(D.type.display);

/**
 * The ground: near-black with a faint warm centre glow (as if lit by the gold)
 * and a vignette pulling the eye in. Depth comes from the gradient sitting a few
 * percent off black, never a flat fill. `black` drops the glow for the coldest
 * beats (cold open, hero, logo) so the gold reads as the only light in frame.
 */
export const Pitch: React.FC<{ children?: React.ReactNode; black?: boolean }> = ({
  children,
  black = false,
}) => (
  <AbsoluteFill style={{ background: BLACK }}>
    {!black && (
      <AbsoluteFill
        style={{
          // A warm, almost-imperceptible pool of gold light, high and centred.
          background: `radial-gradient(120% 90% at 50% 40%, rgba(198,161,91,0.10) 0%, rgba(0,0,0,0) 58%)`,
        }}
      />
    )}
    <AbsoluteFill
      style={{
        background: `radial-gradient(110% 85% at 50% 50%, rgba(0,0,0,0) 40%, rgba(0,0,0,${D.grain?.vignette ?? 0.4}) 100%)`,
      }}
    />
    {children}
  </AbsoluteFill>
);

/** Small letterspaced kicker — scene labels. Body face (Inter), muted. Never gold. */
export const Kicker: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({
  children,
  style,
}) => (
  <div
    style={{
      fontFamily: `'${D.type.body.family}', ${D.type.body.fallback}`,
      fontSize: 19,
      fontWeight: 600,
      color: D.palette.muted,
      letterSpacing: "0.34em",
      textTransform: "uppercase",
      ...style,
    }}
  >
    {children}
  </div>
);
