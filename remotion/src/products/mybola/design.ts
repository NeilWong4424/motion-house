import type { DesignLanguage } from "../../shared/design/types";

// =============================================================================
// MyBola design language
// =============================================================================
// The look is taken 1:1 from the real MyBola Flutter app (core/app_theme.dart),
// not the marketing website — this is a launch film for the product, so the
// product's own tokens are the source of truth. Palette by role below maps every
// engine role onto a real app colour; scenes ask for `accent`, never "#0091FF".
//
// Brand: pure-black canvas, one electric-blue accent, flat (no shadow — the app's
// house rule). iOS-style status accents (success/warning/error/info) are exposed
// via the extra `brand` table for the few places the real UI uses them (green
// attendance checks, green sales, etc.); the core Palette stays role-based.
//
// Type: the app ships Axiforma (licensed, no woff2 in this engine). We substitute
// the closest available licensed faces — Inter for UI/body, Anton for the big
// display headline — and state that substitution in the director's statement.

/** Real MyBola app colours (core/app_theme.dart), for the app-UI recreations. */
export const MYBOLA = {
  primary: "#0091FF",
  success: "#30D158",
  warning: "#FF9230",
  error: "#FF4245",
  info: "#3CD3FE",
  secondary: "#1C1C1E", // card fill
  border: "#1A1A1A", // hairlines
  black: "#000000", // app bg
  white: "#FFFFFF",
  tertiary: "rgba(255,255,255,0.333)", // 0x55FFFFFF — dim text/icons
  hover: "rgba(255,255,255,0.125)", // 0x20FFFFFF
  // Real WhatsApp app colours (scene 5 customer view — replicated 1:1).
  waHeader: "#1F2C34", // WA dark chat top bar
  waBg: "#0B141A", // WA dark chat background
  waIncoming: "#1F2C34", // WA incoming bubble (left)
  waOutgoing: "#005C4B", // WA outgoing bubble (right)
  waGreen: "#25D366", // WhatsApp brand green (glyph/label)
  waTick: "#53BDEB", // WA read-receipt blue tick
} as const;

// =============================================================================
// mybola
// =============================================================================

/** MyBola's visual identity for the launch film. */
export const mybola: DesignLanguage = {
  id: "mybola",
  feel: "Warm, confident product-launch minimalism on pure black — one electric-blue accent, real app screens doing real work.",
  palette: {
    bg: MYBOLA.black,
    fg: MYBOLA.white,
    muted: MYBOLA.tertiary,
    accent: MYBOLA.primary,
    accent2: MYBOLA.info,
    surface: MYBOLA.secondary,
  },
  type: {
    // Big display headline — Anton stands in for Axiforma's heaviest weight.
    display: {
      family: "Anton",
      fallback: "Impact, sans-serif",
      weights: { 400: "anton-400.woff2" },
    },
    // UI/body — Inter stands in for Axiforma across every recreated app screen.
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
    // The calm Claude-launch register: everything settles, nothing bounces.
    enter: "settle",
    ease: "easeOutQuart",
    stagger: 3,
    hold: 16,
  },
  grain: {
    // Depth comes from a barely-there vignette, not from #000 alone.
    vignette: 0.28,
  },
};
