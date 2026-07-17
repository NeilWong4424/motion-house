import type { DesignLanguage } from "../../shared/design/types";
import { CORAL, CREAM, INK } from "./brand";

// =============================================================================
// MyBola's design language — "warm editorial".
// =============================================================================
// This is ONE design language, not the house style. Other products/videos bring
// their own; nothing in shared/ assumes this look.
//
// Its defining rule (the two-layer rule) is a property of THIS language:
//   1. Narration layer — cream canvas, ink serif, coral accent. Lives outside
//      the phone: greeting, punctuation cards, the launch close.
//   2. Product layer — the real dark app UI inside the phone.
// Coral NEVER appears inside the phone: the accent belongs to the storyteller,
// not the product. That contrast is what makes the app feel like real software
// dropped into an editorial page rather than a mockup painted to match.
export const mybolaDesign: DesignLanguage = {
  id: "mybola-editorial",
  feel: "Warm editorial — cream paper, Playfair serif, one coral accent. Calm and premium; the app does the talking.",
  palette: {
    bg: CREAM,
    fg: INK,
    muted: "rgba(31,27,22,0.6)",
    accent: CORAL,
    surface: "#0A0A0B", // phone body
  },
  type: {
    display: {
      family: "Playfair Display",
      fallback: "Georgia, serif",
      weights: { 500: "playfair-500.woff2", 600: "playfair-600.woff2" },
    },
    body: {
      family: "Plus Jakarta Sans",
      fallback: "'Inter', sans-serif",
      weights: {
        300: "pjs-300.woff2",
        400: "pjs-400.woff2",
        500: "pjs-500.woff2",
        600: "pjs-600.woff2",
      },
    },
  },
  motion: {
    // Everything settles; nothing bounces. Springs match the v7 cut.
    enter: "settle",
    ease: "easeInOutQuint",
    stagger: 5,
    hold: 12,
  },
  grain: {
    // Currently flat — see docs/02-polish-roadmap.md step 1, which adds the
    // grid texture, gradient washes and a bigger diffuse shadow here.
    texture: 0,
    vignette: 0,
    shadow: 0.3,
  },
};
