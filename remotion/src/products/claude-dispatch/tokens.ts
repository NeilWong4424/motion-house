import React from "react";
import { familyOf } from "../../shared/design/types";
import { claudeDispatch, CD } from "./design";

// =============================================================================
// Claude Dispatch — text tokens
// =============================================================================
// The film's two type roles: the editorial DISPLAY serif (title + copy-lines) and
// the UI SANS (all chat + app chrome). Sizes read from the reference frames.
// Standalone: this product never imports another product's tokens.

const UI = familyOf(claudeDispatch.type.body);
const DISPLAY = familyOf(claudeDispatch.type.display);

type CSS = React.CSSProperties;

/** Editorial serif — the film's copy voice (title cards + copy-lines). */
export const serif = {
  title: { fontFamily: DISPLAY, fontWeight: 500, fontSize: 68, lineHeight: 1.12, letterSpacing: 0, color: CD.ink } as CSS,
  line: { fontFamily: DISPLAY, fontWeight: 500, fontSize: 52, lineHeight: 1.2, letterSpacing: 0, color: CD.ink } as CSS,
  lineDim: { fontFamily: DISPLAY, fontWeight: 400, fontSize: 52, lineHeight: 1.2, letterSpacing: 0, color: CD.inkSoft } as CSS,
} as const;

/** UI sans — chat + app chrome. */
export const ui = {
  appName: { fontFamily: UI, fontWeight: 700, fontSize: 20, letterSpacing: -0.2, color: CD.ink } as CSS,
  status: { fontFamily: UI, fontWeight: 600, fontSize: 12, letterSpacing: 0, color: CD.onlineDot } as CSS,
  bubble: { fontFamily: UI, fontWeight: 500, fontSize: 21, lineHeight: 1.34, letterSpacing: -0.1, color: CD.white } as CSS,
  bubbleIn: { fontFamily: UI, fontWeight: 500, fontSize: 19, lineHeight: 1.34, letterSpacing: -0.1, color: CD.chatInInk } as CSS,
  time: { fontFamily: UI, fontWeight: 500, fontSize: 13, letterSpacing: 0, color: CD.inkSoft } as CSS,
  input: { fontFamily: UI, fontWeight: 400, fontSize: 18, letterSpacing: -0.1, color: CD.inkSoft } as CSS,
  // Desktop app chrome
  menu: { fontFamily: UI, fontWeight: 500, fontSize: 13, letterSpacing: 0, color: CD.ink } as CSS,
  menuBold: { fontFamily: UI, fontWeight: 700, fontSize: 13, letterSpacing: 0, color: CD.ink } as CSS,
  fileRow: { fontFamily: UI, fontWeight: 400, fontSize: 13, letterSpacing: -0.1, color: "#2b2b2b" } as CSS,
  deckTitle: { fontFamily: UI, fontWeight: 700, fontSize: 40, letterSpacing: -0.5, color: CD.white } as CSS,
  deckSub: { fontFamily: UI, fontWeight: 400, fontSize: 16, letterSpacing: 0, color: "rgba(255,255,255,0.72)" } as CSS,
  libTitle: { fontFamily: UI, fontWeight: 700, fontSize: 34, letterSpacing: -0.5, color: CD.white } as CSS,
  libMeta: { fontFamily: UI, fontWeight: 400, fontSize: 12, letterSpacing: 0, color: "rgba(255,255,255,0.5)" } as CSS,
  mono: { fontFamily: "monospace", fontWeight: 400, fontSize: 12, lineHeight: 1.5, letterSpacing: 0 } as CSS,
  logo: { fontFamily: DISPLAY, fontWeight: 500, fontSize: 82, letterSpacing: -1, color: CD.ink } as CSS,
} as const;

export const displayFamily = DISPLAY;
export const uiFamily = UI;
