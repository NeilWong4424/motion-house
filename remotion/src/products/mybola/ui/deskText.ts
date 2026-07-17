import React from "react";
import { UIFONT, ui } from "../appTheme";

// =============================================================================
// Desktop text roles — app_theme.dart at 1:1
// =============================================================================
// The shared `uiText` bakes in SC=2.7, the PHONE scale (390pt logical width ->
// 1080px frame). The desktop portal is rendered at its native 1920x1080 and
// scaled to fit as a whole, so its logical px ARE px — applying SC here would
// inflate the chrome to ~1706px of a 1920px surface and crush the content.
//
// Same roles, same values as app_theme.dart, no multiplier.
export const deskText = {
  heading: { fontFamily: UIFONT, fontSize: 20, fontWeight: 600, lineHeight: "25px", letterSpacing: "0.38px", color: ui.white } as React.CSSProperties,
  title: { fontFamily: UIFONT, fontSize: 17, fontWeight: 500, lineHeight: "22px", letterSpacing: "-0.43px", color: ui.white } as React.CSSProperties,
  body: { fontFamily: UIFONT, fontSize: 16, fontWeight: 400, lineHeight: "21px", letterSpacing: "-0.31px", color: ui.white } as React.CSSProperties,
  label: { fontFamily: UIFONT, fontSize: 15, fontWeight: 500, lineHeight: "20px", letterSpacing: "-0.23px", color: ui.white } as React.CSSProperties,
  hint: { fontFamily: UIFONT, fontSize: 16, fontWeight: 400, lineHeight: "21px", letterSpacing: "-0.31px", color: ui.tertiary } as React.CSSProperties,
  meta: { fontFamily: UIFONT, fontSize: 13, fontWeight: 500, lineHeight: "18px", letterSpacing: "-0.08px", color: ui.tertiary } as React.CSSProperties,
};
