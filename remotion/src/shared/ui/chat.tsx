import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { SC, UIFONT, ui, uiText } from "./theme";

// =============================================================================
// Chat primitives — the dark AI-chat chrome shared by any product's app UI.
// =============================================================================
// Geometry/behaviour here mirrors the MyBola Flutter source (message_bubble.dart,
// chat_omnibar.dart, chat_action_card.dart) — it is the reference implementation
// for this house style. Colours come from shared/ui/theme.

// =============================================================================
// RealBubble — exact MessageBubble chrome from message_bubble.dart
// =============================================================================
// AI: primary 20% tint, corners 12/12/4(bl)/12. Mine: #1C1C1E, 12/12/12/4(br).
// Caption "Pengurus · 9:41 AM" beneath in meta.
//
// `media` is the evidence-bubble move: an app screen sent as part of the message,
// rendered as its own rounded block between the bubble and the caption. Geometry
// measured from the Dispatch reference (ref_22): left-aligned with the bubble,
// ~54% of the phone's interior width (585px of 1080), landscape ~1.35, corner
// radius ~13px on their 500px phone → 28px at our scale, small gap above. It gets
// its own atFrame so the screenshot can land as its own beat after the text.
export const RealBubble: React.FC<{
  mine?: boolean; atFrame: number; caption: string; children: React.ReactNode; maxWidth?: number;
  media?: React.ReactNode; mediaAtFrame?: number; mediaWidth?: number; mediaAspect?: number;
}> = ({ mine = false, atFrame, caption, children, maxWidth = 810, media, mediaAtFrame, mediaWidth = 585, mediaAspect = 1.347 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < atFrame - 3) return null;
  const s = spring({ frame: frame - atFrame, fps, config: { damping: 17, stiffness: 135 } });
  const r = 12 * 2.7, rs = 4 * 2.7;
  const mAt = mediaAtFrame ?? atFrame;
  const showMedia = media != null && frame >= mAt - 3;
  const ms = showMedia ? spring({ frame: frame - mAt, fps, config: { damping: 17, stiffness: 135 } }) : 0;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: mine ? "flex-end" : "flex-start", opacity: s, transform: `translateY(${interpolate(s, [0, 1], [26, 0])}px)`, marginBottom: 27 }}>
      <div style={{
        maxWidth,
        background: mine ? ui.secondary : ui.bubbleAi,
        borderRadius: mine ? `${r}px ${r}px ${rs}px ${r}px` : `${r}px ${r}px ${r}px ${rs}px`,
        padding: 27,
      }}>{children}</div>
      {showMedia ? (
        <div style={{
          width: mediaWidth, height: mediaWidth / mediaAspect, marginTop: 13,
          // Bubble chrome, not app UI: the app-token border (#1A1A1A) vanishes
          // against the black chat bg, so the frame uses a visible hairline.
          borderRadius: 28, overflow: "hidden", border: "1px solid rgba(255,255,255,0.14)",
          position: "relative", background: ui.black,
          opacity: ms, transform: `translateY(${interpolate(ms, [0, 1], [26, 0])}px)`,
        }}>{media}</div>
      ) : null}
      <div style={{ ...uiText.meta, marginTop: 8, paddingLeft: 6, paddingRight: 6 }}>{caption}</div>
    </div>
  );
};

// =============================================================================
// ProcessingDots — the omnibar "Sedang memproses…" state
// =============================================================================
export const ProcessingDots: React.FC<{ atFrame: number; untilFrame: number }> = ({ atFrame, untilFrame }) => {
  const frame = useCurrentFrame();
  if (frame < atFrame || frame > untilFrame) return null;
  const dots = ".".repeat(1 + (Math.floor((frame - atFrame) / 8) % 3));
  return <span style={{ ...uiText.hint }}>Pengurus sedang memproses permintaan anda{dots}</span>;
};

// =============================================================================
// Omnibar — 1:1 rebuild of chat_omnibar.dart (mobile mode)
// =============================================================================
// GlassShell: margin 10, radius 16, blur 16, secondary @20% fill, 1px border.
// Row: attach(32) 10 mic(32) 10 slash-chip(15) 10 field(h32, flex) 10 send(32).
// Send: radius-24 circle, arrow_right 18px, primary when text present.
const AB: React.FC<{ children: React.ReactNode; bg?: string }> = ({ children, bg }) => (
  <div style={{ width: 32 * SC, height: 32 * SC, borderRadius: 24 * SC, background: bg ?? "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{children}</div>
);
const IC = 18 * SC;

export const Omnibar: React.FC<{
  typedText?: string; startFrame?: number; charsPerFrame?: number;
  processing?: [number, number] | null; sentAtFrame?: number;
}> = ({ typedText = "", startFrame = 0, charsPerFrame = 0.8, processing = null, sentAtFrame = null as unknown as number }) => {
  const frame = useCurrentFrame();
  const sent = sentAtFrame !== null && frame >= sentAtFrame;
  const n = sent ? 0 : Math.max(0, Math.min(typedText.length, Math.floor((frame - startFrame) * charsPerFrame)));
  const shown = typedText.slice(0, n);
  const hasText = shown.length > 0;
  const cursorOn = !sent && frame >= startFrame && n < typedText.length + 30 && Math.floor(frame / 9) % 2 === 0;
  const isProcessing = processing && frame >= processing[0] && frame <= processing[1];
  const t = ui.tertiary;
  return (
    <div style={{
      margin: 10 * SC / 2, background: "rgba(28,28,30,0.55)", backdropFilter: "blur(16px)",
      border: `1px solid ${ui.border}`, borderRadius: 16 * SC / 1.35, padding: 10 * SC / 1.35,
      display: "flex", alignItems: "center", gap: 10 * SC / 1.35,
    }}>
      <AB>
        <svg width={IC} height={IC} viewBox="0 0 24 24" fill="none" stroke={t} strokeWidth="2" strokeLinecap="round"><path d="M21.4 11.05 12.25 20.2a6 6 0 0 1-8.49-8.49l8.6-8.6a4 4 0 0 1 5.66 5.66l-8.6 8.6a2 2 0 0 1-2.83-2.83l8.49-8.49" /></svg>
      </AB>
      <AB>
        <svg width={IC} height={IC} viewBox="0 0 24 24" fill="none" stroke={t} strokeWidth="2" strokeLinecap="round"><rect x="9" y="2" width="6" height="12" rx="3" /><path d="M5 10a7 7 0 0 0 14 0 M12 17v5" /></svg>
      </AB>
      <div style={{ width: 15 * SC, height: 15 * SC, borderRadius: 3 * SC, border: `${1.8 * SC}px solid ${t}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxSizing: "border-box" }}>
        <span style={{ fontFamily: "monospace", fontSize: 8 * SC, fontWeight: 900, color: t }}>/</span>
      </div>
      <div style={{ flex: 1, minHeight: 32 * SC / 1.35, display: "flex", alignItems: "center", justifyContent: "flex-start", overflow: "hidden" }}>
        {isProcessing ? (
          <ProcessingDots atFrame={processing![0]} untilFrame={processing![1]} />
        ) : hasText ? (
          <div style={{ width: "100%", overflow: "hidden", display: "flex", justifyContent: "flex-end" }}><span style={{ ...uiText.body, whiteSpace: "nowrap", flexShrink: 0 }}>{shown}{cursorOn ? <span style={{ color: ui.primary }}>|</span> : null}</span></div>
        ) : (
          <span style={{ ...uiText.hint, whiteSpace: "nowrap" }}>Semua urusan bermula di sini...{cursorOn ? <span style={{ color: ui.primary }}>|</span> : null}</span>
        )}
      </div>
      <AB bg={hasText || isProcessing ? ui.primary : ui.secondary}>
        <svg width={IC} height={IC} viewBox="0 0 24 24" fill="none" stroke={hasText || isProcessing ? ui.white : t} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12h15M13 6l6 6-6 6" /></svg>
      </AB>
    </div>
  );
};

// =============================================================================
// StatCard — glass result card in the app's cardText language
// =============================================================================
// displayHero number (52/300), tracked label above, meta line below, faint
// oversized watermark behind — matching the app's dense glass-card aesthetic.
export const StatCard: React.FC<{
  atFrame: number; label: string; hero: string; sub: string; watermark: string; accent?: string;
}> = ({ atFrame, label, hero, sub, watermark, accent = ui.primary }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < atFrame - 3) return null;
  const s = spring({ frame: frame - atFrame, fps, config: { damping: 14, stiffness: 130 } });
  return (
    <div style={{
      opacity: s, transform: `translateY(${interpolate(s, [0, 1], [40, 0])}px) scale(${interpolate(s, [0, 1], [0.96, 1])})`,
      position: "relative", overflow: "hidden",
      background: ui.secondary, border: `1px solid ${ui.border}`, borderRadius: 28, padding: "44px 48px",
      width: 860, boxSizing: "border-box",
    }}>
      <div style={{ position: "absolute", right: -10, bottom: -30, fontFamily: UIFONT, fontSize: 150, fontWeight: 800, letterSpacing: "-4px", color: "rgba(255,255,255,0.04)", whiteSpace: "nowrap" }}>{watermark}</div>
      <div style={{ ...uiText.label, color: accent, marginBottom: 18 }}>{label}</div>
      <div style={uiText.displayHero}>{hero}</div>
      <div style={{ ...uiText.meta, marginTop: 16 }}>{sub}</div>
    </div>
  );
};

// =============================================================================
// FileChip — media body in real bubble tint language
// =============================================================================
export const FileChip: React.FC<{ name: string }> = ({ name }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
    <div style={{ width: 76, height: 92, borderRadius: 12, background: "rgba(255,255,255,0.09)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <span style={{ fontFamily: UIFONT, fontSize: 20, fontWeight: 600, color: ui.primary }}>PDF</span>
    </div>
    <div>
      <div style={{ ...uiText.body, fontWeight: 500 }}>{name}</div>
      <div style={uiText.meta}>128 KB · PDF</div>
    </div>
  </div>
);

// =============================================================================
// ActionSheet — 1:1 AnimatedActionSheet + ActionSummaryCard (chat_action_card.dart)
// =============================================================================
// Summary: title (text.title), subtitle (text.label), label—value field rows,
// then numbered DesktopButtons (h28, radius 6, text.label, left pad 10) and
// "0. Batal dan kembali" in secondary. Slides up from the omnibar.
type Field = { label: string; value: string };
export const ActionSheet: React.FC<{
  atFrame: number; title: string; subtitle?: string; fields: Field[];
  options: Array<{ label: string; color?: string }>;
}> = ({ atFrame, title, subtitle, fields, options }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < atFrame - 3) return null;
  const s = spring({ frame: frame - atFrame, fps, config: { damping: 15, stiffness: 120 } });
  const btn = (label: string, bg: string, i: number): React.ReactNode => (
    <div key={i} style={{ height: 28 * SC / 1.15, borderRadius: 6 * SC, background: bg, display: "flex", alignItems: "center", paddingLeft: 10 * SC, marginTop: i === 0 ? 0 : 8 * SC / 1.15 }}>
      <span style={{ fontFamily: UIFONT, fontSize: 15 * SC, fontWeight: 500, color: ui.white, letterSpacing: "-0.23px" }}>{label}</span>
    </div>
  );
  return (
    <div style={{ opacity: s, transform: `translateY(${interpolate(s, [0, 1], [90, 0])}px)`, margin: `0 ${10 * SC / 2}px ${8 * SC / 2}px`, background: "rgba(28,28,30,0.88)", backdropFilter: "blur(16px)", border: `1px solid ${ui.border}`, borderRadius: 16 * SC / 1.35, padding: 14 * SC / 1.15 }}>
      <div style={uiText.title}>{title}</div>
      {subtitle ? <div style={{ ...uiText.meta, marginTop: 4 * SC / 1.35, fontWeight: 500 }}>{subtitle}</div> : null}
      <div style={{ height: 8 * SC / 1.15 }} />
      {fields.map((f, i) => (
        <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 * SC / 1.15 }}>
          <span style={uiText.meta}>{f.label}</span>
          <span style={{ ...uiText.meta, color: ui.white }}>{f.value}</span>
        </div>
      ))}
      <div style={{ height: 6 * SC / 1.15 }} />
      {options.map((o, i) => btn(`${i + 1}. ${o.label}`, o.color ?? ui.primary, i))}
      {btn("0. Batal dan kembali", ui.secondary, options.length)}
    </div>
  );
};
