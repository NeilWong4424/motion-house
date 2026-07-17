import React, { useState } from "react";
import { continueRender, delayRender, staticFile } from "remotion";

// =============================================================================
// UiTheme — the app-UI token set the shared chat/phone primitives render with.
// =============================================================================
// The shared primitives are "dark chat app" chrome: they need a token set, but
// must not be owned by any one product. `ui` below is the DEFAULT set (matching
// MyBola's app_theme.dart, the first product built on these). A second product
// with different app colours should pass overrides via the `theme` prop that the
// primitives accept, or fork its own ui module under products/<name>/.
//
// Products re-export these from their own appTheme.ts so scene code reads
// product-local tokens and never reaches into shared/.
export type UiTheme = {
  primary: string;
  success: string;
  warning: string;
  error: string;
  secondary: string;
  tertiary: string;
  border: string;
  black: string;
  white: string;
  bubbleAi: string;
};

export const ui: UiTheme = {
  primary: "#0091FF",
  success: "#30D158",
  warning: "#FF9230",
  error: "#FF4245",
  secondary: "#1C1C1E",
  tertiary: "rgba(255,255,255,0.33)",
  border: "#1A1A1A",
  black: "#000000",
  white: "#FFFFFF",
  bubbleAi: "rgba(0,145,255,0.20)",
};

// =============================================================================
// Type scale
// =============================================================================
// App text roles from app_theme.dart (body 16/400, meta 13/500 tertiary, title 17/500).
// True phone scale: 390pt logical width -> 1080px frame = 2.7x.
export const SC = 2.7;
export const UIFONT = "'Plus Jakarta Sans', 'Inter', sans-serif";

export const uiText = {
  body: { fontFamily: UIFONT, fontSize: 16 * SC, fontWeight: 400, lineHeight: `${21 * SC}px`, letterSpacing: "-0.31px", color: ui.white } as React.CSSProperties,
  meta: { fontFamily: UIFONT, fontSize: 13 * SC, fontWeight: 500, color: ui.tertiary, letterSpacing: "-0.08px" } as React.CSSProperties,
  title: { fontFamily: UIFONT, fontSize: 17 * SC, fontWeight: 500, color: ui.white, letterSpacing: "-0.43px" } as React.CSSProperties,
  hint: { fontFamily: UIFONT, fontSize: 16 * SC, fontWeight: 400, color: ui.tertiary, letterSpacing: "-0.31px" } as React.CSSProperties,
  displayHero: { fontFamily: UIFONT, fontSize: 40 * SC, fontWeight: 300, letterSpacing: "-1px", color: ui.white, lineHeight: 1 } as React.CSSProperties,
  label: { fontFamily: UIFONT, fontSize: 8.5 * SC, fontWeight: 600, letterSpacing: "1.6px", color: ui.tertiary } as React.CSSProperties,
};

// =============================================================================
// Fonts — Plus Jakarta Sans (UI stand-in for Axiforma)
// =============================================================================
const PJS_FONTS = [
  ["Plus Jakarta Sans", "fonts/pjs-300.woff2", "300"],
  ["Plus Jakarta Sans", "fonts/pjs-400.woff2", "400"],
  ["Plus Jakarta Sans", "fonts/pjs-500.woff2", "500"],
  ["Plus Jakarta Sans", "fonts/pjs-600.woff2", "600"],
] as const;

let pjsLoaded = false;
export const usePjs = () => {
  const [handle] = useState(() => (pjsLoaded ? null : delayRender("pjs")));
  if (!pjsLoaded && handle !== null) {
    Promise.all(
      PJS_FONTS.map(([family, file, weight]) => {
        const f = new FontFace(family, `url(${staticFile(file)})`, { weight });
        return f.load().then((l) => document.fonts.add(l));
      })
    ).then(() => {
      pjsLoaded = true;
      continueRender(handle);
    });
  }
};
