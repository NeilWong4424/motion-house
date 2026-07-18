import type { DesignLanguage } from "../../shared/design/types";

// =============================================================================
// worldcup2026hype — matched to the OFFICIAL FIFA World Cup 26 brand identity.
// =============================================================================
// Researched, not invented (see brand-researcher findings recorded in NOTES.md).
// The master FWC26 brand is deliberately restrained and monochromatic: BLACK +
// WHITE + a METALLIC GOLD anchored by the trophy render — luxury-institutional,
// heavy ultra-condensed type. (The vivid multicolour people associate with the
// tournament lives in the 16 host-CITY spokes, not the master mark.) This film
// answers the master brand.
//
// Two honest substitutions, flagged not hidden (NOTES.md, gap list):
//   • Display face: the real "FWC 2026" typeface is proprietary FIFA IP with no
//     legal woff2. We substitute ANTON — a free ultra-condensed heavy geometric
//     sans that evokes the letterform character. It is NOT the licensed face.
//   • Gold: no flat brand hex is published (the gold is a metallic render). We
//     treat it as a gradient (GOLD_GRAD) and use GOLD as its representative flat
//     value for role-based lookups.

export const BLACK = "#000000";
export const OFFWHITE = "#F4F4F2"; // white, a hair warm so it reads as ink not glare
export const GOLD = "#C6A15B"; // representative flat gold (accent role)
// The metallic gold the trophy render implies: deep amber -> champagne highlight.
export const GOLD_GRAD = "linear-gradient(180deg, #E8CE8A 0%, #C6A15B 46%, #8A6A2E 100%)";

export const worldcupHype: DesignLanguage = {
  id: "worldcup26-official",
  feel: "Official FWC26 master brand — black, white, metallic gold. Heavy ultra-condensed type, luxury-institutional restraint carried at broadcast tempo.",
  palette: {
    bg: BLACK,
    fg: OFFWHITE,
    // Supporting copy / non-hero shapes.
    muted: "rgba(244,244,242,0.46)",
    // The hero colour. Reserve it — gold is the trophy, the singular.
    accent: GOLD,
    // Panels/rules above black.
    surface: "#141414",
  },
  type: {
    // Display: Anton (substitute for the proprietary FWC 2026 face) — one weight,
    // and that weight is already black/condensed by design. All-caps in use.
    display: {
      family: "Anton",
      fallback: "'Arial Narrow', system-ui, sans-serif",
      weights: { 400: "anton-400.woff2" },
    },
    // Body/UI: Inter (the official secondary is Noto Sans; Inter is the closest
    // neutral grotesque already installed — a supporting role, not the voice).
    body: {
      family: "Inter",
      fallback: "system-ui, sans-serif",
      weights: { 400: "inter-400.woff2", 600: "inter-600.woff2", 700: "inter-700.woff2" },
    },
  },
  motion: {
    // Broadcast tempo, but the master brand's restraint holds: snap in, hold hard.
    enter: "crisp",
    ease: "easeOutExpo",
    stagger: 2,
    hold: 10,
  },
  grain: {
    // Depth from a soft vignette on black + the metallic gradient on the gold,
    // never a flat fill.
    texture: 0.02,
    vignette: 0.4,
    shadow: 0.45,
  },
};
