import React from "react";
import { AbsoluteFill } from "remotion";
import { familyOf } from "../../../shared/design/types";
import { BONE, LIME, PITCH, PURE_BLACK, worldcupDesign as D } from "../design";

// =============================================================================
// World Cup staging — this product's set, not a shared primitive.
// =============================================================================
// Everything here reads colour/type from ../design. No scene hardcodes a hex.

const FAMILY = familyOf(D.type.display);

/**
 * The pitch: green-black with a centre wash and a vignette. Depth comes from the
 * radial gradient sitting a few percent off the base, never from a flat fill —
 * a dark palette with flat lighting reads cheaper than a light one with depth.
 */
export const Pitch: React.FC<{ children?: React.ReactNode; black?: boolean }> = ({
  children,
  black = false,
}) => (
  <AbsoluteFill style={{ background: black ? PURE_BLACK : PITCH }}>
    {!black && (
      <AbsoluteFill
        style={{
          background: `radial-gradient(120% 90% at 50% 42%, rgba(36,74,52,0.55) 0%, rgba(10,20,16,0) 62%)`,
        }}
      />
    )}
    <AbsoluteFill
      style={{
        background: `radial-gradient(105% 82% at 50% 50%, rgba(0,0,0,0) 42%, rgba(0,0,0,${D.grain?.vignette ?? 0.34}) 100%)`,
      }}
    />
    {children}
  </AbsoluteFill>
);

/** Display type. Set big — under ~60px this is a caption, not a headline. */
export const Display: React.FC<{
  children: React.ReactNode;
  size?: number;
  weight?: number;
  colour?: string;
  style?: React.CSSProperties;
}> = ({ children, size = 92, weight = 700, colour = BONE, style }) => (
  <div
    style={{
      fontFamily: FAMILY,
      fontSize: size,
      fontWeight: weight,
      color: colour,
      letterSpacing: size > 140 ? "-0.045em" : "-0.03em",
      lineHeight: 1.02,
      ...style,
    }}
  >
    {children}
  </div>
);

/** Supporting copy. The muted role — contrast is hierarchy. */
export const Body: React.FC<{
  children: React.ReactNode;
  size?: number;
  colour?: string;
  style?: React.CSSProperties;
}> = ({ children, size = 30, colour = D.palette.muted, style }) => (
  <div
    style={{
      fontFamily: FAMILY,
      fontSize: size,
      fontWeight: 400,
      color: colour,
      letterSpacing: "0.01em",
      lineHeight: 1.4,
      ...style,
    }}
  >
    {children}
  </div>
);

export type ChipState = "neutral" | "dim" | "lime" | "empty";

/**
 * A team chip. `state` is the entire information channel of this film:
 *   neutral — a team, undecided
 *   dim     — did not qualify
 *   lime    — one of the eight best third-placed teams (THE accent, see design.ts)
 *   empty   — an unfilled bracket slot
 */
export const Chip: React.FC<{
  label?: string;
  state?: ChipState;
  w?: number;
  h?: number;
  style?: React.CSSProperties;
}> = ({ label, state = "neutral", w = 116, h = 40, style }) => {
  const lime = state === "lime";
  const dim = state === "dim";
  const empty = state === "empty";
  return (
    <div
      style={{
        width: w,
        height: h,
        borderRadius: 6,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: lime ? LIME : empty ? "transparent" : D.palette.surface,
        border: empty
          ? `2px dashed rgba(242,245,239,0.22)`
          : lime
            ? "none"
            : `1px solid rgba(242,245,239,${dim ? 0.06 : 0.14})`,
        color: lime ? PITCH : dim ? D.palette.muted : BONE,
        fontFamily: FAMILY,
        fontSize: 15,
        fontWeight: 600,
        letterSpacing: "0.02em",
        opacity: dim ? 0.5 : 1,
        // Keep the glow tight. At 44px/0.28 a stacked column of lime chips bloomed
        // into one smear and the individual chips stopped reading.
        boxShadow: lime ? `0 0 18px rgba(196,248,42,0.16)` : "none",
        ...style,
      }}
    >
      {label}
    </div>
  );
};

/** Small letterspaced kicker — scene labels. Never lime. */
export const Kicker: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({
  children,
  style,
}) => (
  <div
    style={{
      fontFamily: FAMILY,
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
