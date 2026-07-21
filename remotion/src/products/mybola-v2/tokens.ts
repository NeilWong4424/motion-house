import React from "react";
import { familyOf } from "../../shared/design/types";
import { mybolaV2, MB } from "./design";

// =============================================================================
// MyBola v2 UI tokens — the app's text scale, 1:1 from core/app_theme.dart
// =============================================================================
// Reproduced as CSS so the recreated screens match the real source exactly —
// same px, weight, letter-spacing, line-height. Family is the design language's
// body face (Inter, the Axiforma substitute); the big film headline uses the
// display face. Standalone copy: this product never imports v1's tokens.

const UI = familyOf(mybolaV2.type.body);
const DISPLAY = familyOf(mybolaV2.type.display);

type CSS = React.CSSProperties;

/** `class text` — the 6-role app scale (core/app_theme.dart). */
export const t = {
  heading: { fontFamily: UI, fontSize: 20, fontWeight: 600, lineHeight: "25px", letterSpacing: 0.38, color: MB.white } as CSS,
  title: { fontFamily: UI, fontSize: 17, fontWeight: 500, lineHeight: "22px", letterSpacing: -0.43, color: MB.white } as CSS,
  body: { fontFamily: UI, fontSize: 16, fontWeight: 400, lineHeight: "21px", letterSpacing: -0.31, color: MB.white } as CSS,
  label: { fontFamily: UI, fontSize: 15, fontWeight: 500, lineHeight: "20px", letterSpacing: -0.23, color: MB.white } as CSS,
  hint: { fontFamily: UI, fontSize: 16, fontWeight: 400, lineHeight: "21px", letterSpacing: -0.31, color: MB.tertiary } as CSS,
  meta: { fontFamily: UI, fontSize: 13, fontWeight: 500, lineHeight: "18px", letterSpacing: -0.08, color: MB.tertiary } as CSS,
} as const;

/** `class cardText` — dense-card scale (subset actually used on screen). */
export const ct = {
  displayHero: { fontFamily: UI, fontSize: 52, fontWeight: 700, lineHeight: 1, letterSpacing: -1, color: MB.white } as CSS,
  display: { fontFamily: UI, fontSize: 28, fontWeight: 600, lineHeight: 1.1, letterSpacing: -0.5, color: MB.white } as CSS,
  title: { fontFamily: UI, fontSize: 20, fontWeight: 700, lineHeight: 1.2, letterSpacing: 0, color: MB.white } as CSS,
  titleSm: { fontFamily: UI, fontSize: 16, fontWeight: 600, lineHeight: 1.2, letterSpacing: 0.1, color: MB.white } as CSS,
  label: { fontFamily: UI, fontSize: 11, fontWeight: 600, letterSpacing: 1, color: MB.tertiary } as CSS,
} as const;

/** The big film headline face (Anton — Axiforma display substitute). */
export const displayFamily = DISPLAY;

/** RM currency, 1:1 with formatRmCurrency (RM prefix, no space, 2 decimals). */
export const rm = (ringgit: number): string =>
  `RM${ringgit.toLocaleString("en-MY", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
