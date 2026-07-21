import type { DesignLanguage } from "../../shared/design/types";

// =============================================================================
// Claude "Dispatch" — design language (staged-composition register)
// =============================================================================
// A 1:1 study replica of the reference film `Recording 2026-07-17 073006.mp4`
// ("Reach your desktop from your pocket"). Palette + typefaces are MEASURED from
// the reference frames (see NOTES.md). Standalone product package — imports
// nothing from other products; nothing here lives in shared/.
//
// Look: a warm bone/oat ground, one terracotta/rust accent (chat bubbles + the
// hand-drawn squiggle connector), near-black ink for the display serif. Editorial,
// calm, product-demo composure. Two-device staged beats (phone anchor + one
// desktop), hard-cut between beats; in-app content animates natively.
//
// Fonts: the real film uses Anthropic's brand serif (a Scotch/Tiempos-style face)
// and a Styrene/GT-America grotesque. Both are licensed — we SUBSTITUTE Playfair
// Display (display serif) and Inter (UI/chat sans) and state the swap in the
// director's statement. Metrics differ, so text near a wrap was checked by eye.

/** Measured palette (from full-res reference frames — see NOTES.md). */
export const CD = {
  // Ground — warm bone/oat, constant across the whole film.
  bg: "#e1d7cb",
  bgWave: "#c9c1e0", // lavender desktop-wallpaper tint (V3 confirm bg)
  // The one accent — terracotta/rust. Chat out-bubbles + the squiggle connector.
  accent: "#c15b45",
  accentDeep: "#b04d38",
  logoMark: "#cf6e5a", // Claude sunburst (slightly warmer rust)
  // Ink.
  ink: "#1c1a17", // display serif + "Claude" wordmark
  inkSoft: "#6b6459", // 2nd copy-line, dim labels
  // Chat / device chrome.
  paper: "#faf7f2", // phone + light surfaces
  chatIn: "#ffffff", // assistant/system bubbles (white)
  chatInInk: "#2a2620",
  bubbleText: "#fbeee8", // text inside rust out-bubbles (warm off-white)
  onlineDot: "#3fae5a",
  // macOS desktop surfaces.
  finderDesk: "#bcd2c8", // soft teal-green wallpaper (V1 Finder)
  windowChrome: "#f3f1ee",
  windowBar: "#e7e3dd",
  macBlue: "#2f74e6", // selection / primary button
  deckBg: "#0d1b34", // Northgate deck slide (dark navy)
  deckBar: "#2ea3a3", // deck accent bar
  termBg: "#0b0b0d", // terminal panel
  termGreen: "#4ec86a",
  libBg: "#12131a", // Cueform Library dark page
  libCard: "#1c1e28",
  pixelBg: "#1a1720", // PixelForge canvas chrome
  pixelGreen: "#2fae7a", // Batch Export button
  // Hairlines / shadow.
  line: "rgba(28,26,23,0.12)",
  lineSoft: "rgba(28,26,23,0.07)",
  white: "#ffffff",
} as const;

// =============================================================================
// claudeDispatch design language
// =============================================================================
export const claudeDispatch: DesignLanguage = {
  id: "claude-dispatch",
  feel: "Reach your desktop from your pocket — a warm bone stage where a phone conversation drives a desktop that does the work, joined by a hand-drawn rust squiggle. Editorial serif titles hard-cut between beats; inside each device, the app animates itself.",
  palette: {
    bg: CD.bg,
    fg: CD.ink,
    muted: CD.inkSoft,
    accent: CD.accent,
    accent2: CD.logoMark,
    surface: CD.paper,
  },
  type: {
    // Display serif — Playfair Display stands in for Anthropic's brand serif.
    display: {
      family: "Playfair Display",
      fallback: "Georgia, serif",
      weights: {
        400: "playfair-400.woff2",
        500: "playfair-500.woff2",
        600: "playfair-600.woff2",
      },
    },
    // UI / chat sans — Inter stands in for the Styrene/GT-America grotesque.
    body: {
      family: "Inter",
      fallback: "system-ui, sans-serif",
      weights: {
        400: "inter-400.woff2",
        600: "inter-600.woff2",
        700: "inter-700.woff2",
      },
    },
  },
  motion: {
    // Calm editorial: hard cuts between beats, eased settles inside.
    enter: "settle",
    ease: "easeInOutQuint",
    stagger: 3,
    hold: 18,
  },
  grain: {
    vignette: 0.12, // barely-there — the reference is flat and bright
  },
};
