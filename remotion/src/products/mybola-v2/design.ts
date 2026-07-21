import type { DesignLanguage } from "../../shared/design/types";

// =============================================================================
// MyBola v2 design language — standalone, continuous-world register
// =============================================================================
// Same real product, a SEPARATE product package from `products/mybola`. Nothing
// is shared or imported across the two. Colours and type are read 1:1 from the
// real MyBola Flutter source (core/app_theme.dart) — the product's own tokens are
// the source of truth for a launch film, exactly as in v1 — but this package owns
// its own copy so the two products can drift independently.
//
// The DIFFERENCE from v1 is not the palette, it is the FORM: v1 is a scene stack
// (held frames + cuts); v2 is one persistent world navigated by a single moving
// camera, objects transforming in place (see craft/continuous-world.md). The
// `feel` line and motion profile below say so.
//
// Brand: pure-black canvas, one electric-blue accent, flat (no shadow — the app's
// house rule). Type: the app ships Axiforma (licensed, no woff2 here); we
// substitute Inter for UI/body and Anton for the big display headline, and state
// that substitution in the director's statement.

/** Real MyBola app colours (core/app_theme.dart), for the app-UI recreations. */
export const MB = {
  primary: "#0091FF",
  success: "#30D158",
  warning: "#FF9230",
  error: "#FF4245",
  info: "#3CD3FE",
  secondary: "#1C1C1E", // card fill
  border: "#1A1A1A", // hairlines
  black: "#000000", // app bg
  white: "#FFFFFF",
  // Stage-depth wash (film only, not an app surface): a near-black radial so the
  // floating devices' soft shadows read on an otherwise pure-black brand canvas.
  stageHi: "#121216",
  stageLo: "#050506",
  tertiary: "rgba(255,255,255,0.333)", // 0x55FFFFFF — dim text/icons
  hover: "rgba(255,255,255,0.125)", // 0x20FFFFFF
  // Real WhatsApp app colours (customer-side panel — replicated 1:1).
  waHeader: "#1F2C34",
  waBg: "#0B141A",
  waIncoming: "#1F2C34",
  waOutgoing: "#005C4B",
  waGreen: "#25D366",
  waTick: "#53BDEB",
  // Paper (a physical receipt export — not a MyBola-branded surface).
  paper: "#F5F3EE",
  paperWarm: "#EDE7DA",
  paperInk: "#2A2A2A",
  paperRule: "#B8AF9C",
  paperDim: "#777777",
} as const;

// =============================================================================
// mybolaV2
// =============================================================================

/** MyBola's visual identity for the continuous-world launch film. */
export const mybolaV2: DesignLanguage = {
  id: "mybola-v2",
  feel: "One continuous workspace on pure black — a single camera flies through the real app while the owner's question becomes a dashboard, a schedule, a paid customer. Nothing cuts; everything transforms.",
  palette: {
    bg: MB.black,
    fg: MB.white,
    muted: MB.tertiary,
    accent: MB.primary,
    accent2: MB.info,
    surface: MB.secondary,
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
    // Continuous-world register: the camera moves, objects settle, nothing bounces.
    enter: "settle",
    ease: "easeInOutQuint", // symmetric — camera A-to-B travel is the main move
    stagger: 3,
    hold: 18,
  },
  grain: {
    // Depth from a barely-there vignette; the camera's parallax carries the rest.
    vignette: 0.3,
  },
};
