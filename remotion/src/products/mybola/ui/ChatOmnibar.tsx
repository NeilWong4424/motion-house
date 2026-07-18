import React from "react";
import { MYBOLA } from "../design";
import { t } from "./tokens";

// =============================================================================
// GlassShell (web) — 1:1 with widgets/primitives/glass_shell.dart
// =============================================================================
// blur 16, fill color.secondary @20%, border color.border, radius 16, pad 10.
export const GlassShell: React.FC<{
  children: React.ReactNode;
  radius?: number;
  pad?: number;
  style?: React.CSSProperties;
}> = ({ children, radius = 16, pad = 10, style }) => (
  <div
    style={{
      background: "rgba(28,28,30,0.2)",
      backdropFilter: "blur(16px)",
      WebkitBackdropFilter: "blur(16px)",
      border: `1px solid ${MYBOLA.border}`,
      borderRadius: radius,
      padding: pad,
      ...style,
    }}
  >
    {children}
  </div>
);

// =============================================================================
// ChatOmnibar — the admin chat input, 1:1 with chat_omnibar (full-page layout)
// =============================================================================
// Row: [attach] [voice] [/ slash] [expanded field] [send]. Field shows the typed
// text or the hint. Send is 32x32; fills color.primary when text is non-empty,
// icon = arrow_right. Action buttons are 32x32, radius 24, icon in tertiary.

const ActionBtn: React.FC<{ children: React.ReactNode; fill?: string }> = ({ children, fill }) => (
  <div
    style={{
      width: 32,
      height: 32,
      borderRadius: 24,
      background: fill ?? "transparent",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    }}
  >
    {children}
  </div>
);

// A minimal glyph set drawn as SVG (no icon font, no emoji — QC-safe).
const stroke = MYBOLA.tertiary;
const Attach = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11.5l-8.5 8.5a5 5 0 01-7-7l8.5-8.5a3.3 3.3 0 014.7 4.7l-8.5 8.5a1.7 1.7 0 01-2.4-2.4l7.8-7.8" />
  </svg>
);
const Mic = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="3" width="6" height="11" rx="3" />
    <path d="M5 11a7 7 0 0014 0M12 18v3" />
  </svg>
);
const Slash = () => (
  <div style={{ width: 15, height: 15, borderRadius: 3, border: `1.8px solid ${MYBOLA.tertiary}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
    <span style={{ fontFamily: "monospace", fontWeight: 900, fontSize: 8, color: MYBOLA.tertiary, lineHeight: 1 }}>/</span>
  </div>
);
const ArrowRight = ({ color }: { color: string }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export const ChatOmnibar: React.FC<{
  /** The text currently in the field, or "" to show the hint. */
  value?: string;
  hint?: string;
  /** Show the processing state ("Pengurus sedang memproses…" + dots). */
  processing?: boolean;
  dots?: string;
}> = ({ value = "", hint = "Semua urusan bermula di sini...", processing = false, dots = "" }) => {
  const hasText = value.length > 0;
  const fieldText = processing ? `Pengurus sedang memproses permintaan anda${dots}` : hasText ? value : hint;
  const fieldStyle: React.CSSProperties = processing || !hasText ? t.hint : t.body;

  return (
    <GlassShell>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <ActionBtn><Attach /></ActionBtn>
        <ActionBtn><Mic /></ActionBtn>
        <ActionBtn><Slash /></ActionBtn>
        <div style={{ flex: 1, minWidth: 0 }}>
          <span style={{ ...fieldStyle, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", display: "block" }}>
            {fieldText}
          </span>
        </div>
        <ActionBtn fill={hasText && !processing ? MYBOLA.primary : MYBOLA.secondary}>
          <ArrowRight color={hasText && !processing ? MYBOLA.white : MYBOLA.tertiary} />
        </ActionBtn>
      </div>
    </GlassShell>
  );
};
