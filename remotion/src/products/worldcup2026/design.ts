import type { DesignLanguage } from "../../shared/design/types";

// =============================================================================
// Brand constants — "pitch at night".
// =============================================================================
// Green-black is a felt colour, not a seen one: at #0A1410 the viewer reads the
// frame as black and only registers the green next to true black (the scene 1/10
// cards use PURE_BLACK, which is what makes the pitch scenes feel lit).
export const PITCH = "#0A1410";
export const PURE_BLACK = "#050807";
export const BONE = "#F2F5EF";
export const LIME = "#C4F82A";

// =============================================================================
// The one rule: LIME ONLY EVER MARKS A THIRD-PLACED TEAM.
// =============================================================================
// Not a heading, not an underline, not a flourish, not the final's rule line.
// Every appearance of lime in this film means "this is one of the eight that
// qualified from third place". The film's whole message is a sorting — 24 teams
// qualify one way, 8 qualify another — so the accent is doing the explaining by
// itself. If lime ever decorates something, the payoff shot stops teaching and
// starts being a colour scheme.
//
// This is this language's equivalent of MyBola's "coral never enters the phone".
export const worldcupDesign: DesignLanguage = {
  id: "worldcup-pitch-at-night",
  feel: "Pitch at night — green-black, bone type, one electric lime. Broadcast graphics with the confidence to hold still.",
  palette: {
    bg: PITCH,
    fg: BONE,
    // Eliminated / non-qualifying teams. The contrast drop IS the information.
    muted: "rgba(242,245,239,0.34)",
    accent: LIME,
    // Chips, bracket slots, any surface above the pitch.
    surface: "#14201A",
  },
  type: {
    // Inter only. A format explainer is a data object: one family, one weight
    // jump (700 display / 400 body). 600 exists for the mid-weight chip labels.
    display: {
      family: "Inter",
      fallback: "system-ui, sans-serif",
      weights: { 400: "inter-400.woff2", 600: "inter-600.woff2", 700: "inter-700.woff2" },
    },
    body: {
      family: "Inter",
      fallback: "system-ui, sans-serif",
      weights: { 400: "inter-400.woff2", 600: "inter-600.woff2", 700: "inter-700.woff2" },
    },
  },
  motion: {
    // Broadcast motion is crisp, not weighty: things snap into place and stop.
    enter: "crisp",
    ease: "easeOutQuart",
    stagger: 3,
    hold: 14,
  },
  grain: {
    // Depth comes from the vignette and the gradient wash in Pitch (ui/stage.tsx),
    // never from a flat #000 — see docs/03-motion-craft.md, "Dark != premium".
    texture: 0.03,
    vignette: 0.34,
    shadow: 0.4,
  },
};
