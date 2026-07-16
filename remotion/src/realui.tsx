import React, { useState } from "react";
import { AbsoluteFill, continueRender, delayRender, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

// Real MyBola design tokens, extracted from flutter/lib/core/app_theme.dart.
export const ui = {
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

export const UIFONT = "'Plus Jakarta Sans', 'Inter', sans-serif";

// App text roles from app_theme.dart (body 16/400, meta 13/500 tertiary, title 17/500).
// True phone scale: 390pt logical width -> 1080px frame = 2.7x.
export const SC = 2.7;
export const uiText = {
  body: { fontFamily: UIFONT, fontSize: 16 * SC, fontWeight: 400, lineHeight: `${21 * SC}px`, letterSpacing: "-0.31px", color: ui.white } as React.CSSProperties,
  meta: { fontFamily: UIFONT, fontSize: 13 * SC, fontWeight: 500, color: ui.tertiary, letterSpacing: "-0.08px" } as React.CSSProperties,
  title: { fontFamily: UIFONT, fontSize: 17 * SC, fontWeight: 500, color: ui.white, letterSpacing: "-0.43px" } as React.CSSProperties,
  hint: { fontFamily: UIFONT, fontSize: 16 * SC, fontWeight: 400, color: ui.tertiary, letterSpacing: "-0.31px" } as React.CSSProperties,
  displayHero: { fontFamily: UIFONT, fontSize: 40 * SC, fontWeight: 300, letterSpacing: "-1px", color: ui.white, lineHeight: 1 } as React.CSSProperties,
  label: { fontFamily: UIFONT, fontSize: 8.5 * SC, fontWeight: 600, letterSpacing: "1.6px", color: ui.tertiary } as React.CSSProperties,
};

// =============================================================================
// AppScreen — full-bleed dark app canvas (the phone IS the frame)
// =============================================================================
export const AppScreen: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  usePjs();
  return (
    <AbsoluteFill style={{ background: ui.black }}>
      {children}
    </AbsoluteFill>
  );
};

// =============================================================================
// RealBubble — exact MessageBubble chrome from message_bubble.dart
// =============================================================================
// AI: primary 20% tint, corners 12/12/4(bl)/12. Mine: #1C1C1E, 12/12/12/4(br).
// Caption "Pengurus · 9:41 AM" beneath in meta.
export const RealBubble: React.FC<{
  mine?: boolean; atFrame: number; caption: string; children: React.ReactNode; maxWidth?: number;
}> = ({ mine = false, atFrame, caption, children, maxWidth = 810 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < atFrame - 3) return null;
  const s = spring({ frame: frame - atFrame, fps, config: { damping: 17, stiffness: 135 } });
  const r = 12 * 2.7, rs = 4 * 2.7;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: mine ? "flex-end" : "flex-start", opacity: s, transform: `translateY(${interpolate(s, [0, 1], [26, 0])}px)`, marginBottom: 27 }}>
      <div style={{
        maxWidth,
        background: mine ? ui.secondary : ui.bubbleAi,
        borderRadius: mine ? `${r}px ${r}px ${rs}px ${r}px` : `${r}px ${r}px ${r}px ${rs}px`,
        padding: 27,
      }}>{children}</div>
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
// FileChip / VoiceTile — media bodies in real bubble tint language
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

// =============================================================================
// WhatsApp UI — exact recreation of WA dark theme (parent's phone)
// =============================================================================
export const wa = {
  bg: "#0B141A", bar: "#202C33", out: "#005C4B", inn: "#202C33",
  text: "#E9EDEF", sub: "#8696A0", green: "#00A884", tick: "#53BDEB",
};
const WAF = "'Plus Jakarta Sans', 'Helvetica Neue', sans-serif";

const Ticks: React.FC<{ read?: boolean }> = ({ read = true }) => (
  <svg width="34" height="22" viewBox="0 0 16 11" style={{ marginLeft: 6 }}>
    <path d="M11.07 0.65 6.4 5.32 4.55 3.47 3.5 4.52 6.4 7.42 12.12 1.7Z" fill={read ? wa.tick : wa.sub} />
    <path d="M15.07 0.65 10.4 5.32 9.5 4.42 8.45 5.47 10.4 7.42 16.12 1.7Z" fill={read ? wa.tick : wa.sub} transform="translate(-1.5,0)" />
  </svg>
);

export const WABubble: React.FC<{ mine?: boolean; atFrame: number; time: string; children: React.ReactNode; maxWidth?: number }> = ({ mine = false, atFrame, time, children, maxWidth = 800 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < atFrame - 3) return null;
  const s = spring({ frame: frame - atFrame, fps, config: { damping: 17, stiffness: 135 } });
  return (
    <div style={{ display: "flex", justifyContent: mine ? "flex-end" : "flex-start", opacity: s, transform: `translateY(${interpolate(s, [0, 1], [24, 0])}px)`, marginBottom: 10 }}>
      <div style={{ maxWidth, background: mine ? wa.out : wa.inn, borderRadius: 20, borderTopRightRadius: mine ? 6 : 20, borderTopLeftRadius: mine ? 20 : 6, padding: "16px 22px 12px", position: "relative" }}>
        {children}
        <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", marginTop: 4 }}>
          <span style={{ fontFamily: WAF, fontSize: 26, color: mine ? "rgba(233,237,239,0.6)" : wa.sub }}>{time}</span>
          {mine ? <Ticks /> : null}
        </div>
      </div>
    </div>
  );
};

export const WADoc: React.FC<{ name: string; caption: string }> = ({ name, caption }) => (
  <div>
    <div style={{ display: "flex", alignItems: "center", gap: 18, background: "rgba(0,0,0,0.22)", borderRadius: 14, padding: "18px 20px", marginBottom: 10 }}>
      <svg width="56" height="56" viewBox="0 0 24 24"><path d="M6 2 H15 L20 7 V22 H6 Z" fill="#F40F02" rx="2" /><text x="8" y="17" fontSize="6.5" fontWeight="700" fill="#FFF" fontFamily="sans-serif">PDF</text></svg>
      <div>
        <div style={{ fontFamily: WAF, fontSize: 30, color: wa.text }}>{name}</div>
        <div style={{ fontFamily: WAF, fontSize: 24, color: wa.sub }}>1 page · PDF · 128 kB</div>
      </div>
    </div>
    <span style={{ fontFamily: WAF, fontSize: 32, color: wa.text }}>{caption}</span>
  </div>
);

export const WAScreen: React.FC<{
  children: React.ReactNode; typedText?: string; startFrame?: number; charsPerFrame?: number; sentAtFrame?: number;
}> = ({ children, typedText = "", startFrame = 0, charsPerFrame = 0.8, sentAtFrame = null as unknown as number }) => {
  usePjs();
  const frame = useCurrentFrame();
  const sent = sentAtFrame !== null && frame >= sentAtFrame;
  const n = sent ? 0 : Math.max(0, Math.min(typedText.length, Math.floor((frame - startFrame) * charsPerFrame)));
  const shown = typedText.slice(0, n);
  const hasText = shown.length > 0;
  const cursorOn = !sent && frame >= startFrame && Math.floor(frame / 9) % 2 === 0;
  return (
    <AbsoluteFill style={{ background: wa.bg }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 240, background: wa.bar, display: "flex", alignItems: "flex-end", padding: "0 24px 18px", gap: 20 }}>
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke={wa.sub} strokeWidth="2.4" strokeLinecap="round"><path d="M15 5 L8 12 L15 19" /></svg>
        <div style={{ width: 84, height: 84, borderRadius: "50%", background: "#324a56", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontFamily: WAF, fontSize: 36, fontWeight: 600, color: wa.text }}>AT</span>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: WAF, fontSize: 34, fontWeight: 600, color: wa.text }}>Akademi Tunas Muda</div>
          <div style={{ fontFamily: WAF, fontSize: 26, color: wa.sub }}>online</div>
        </div>
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={wa.sub} strokeWidth="2"><rect x="3" y="6" width="13" height="12" rx="3" /><path d="M16 10 L21 7 V17 L16 14 Z" fill={wa.sub} /></svg>
        <svg width="38" height="38" viewBox="0 0 24 24" fill={wa.sub}><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.8 21 3 13.2 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.6.1.3 0 .7-.2 1l-2.3 2.2z" /></svg>
      </div>
      <AbsoluteFill style={{ padding: "270px 30px 160px", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
        {children}
      </AbsoluteFill>
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 18px 30px", display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ flex: 1, background: wa.bar, borderRadius: 50, padding: "20px 26px", display: "flex", alignItems: "center", gap: 18 }}>
          <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke={wa.sub} strokeWidth="2"><circle cx="12" cy="12" r="9" /><path d="M8.5 14.5 a4.5 4.5 0 0 0 7 0 M9 10 h.01 M15 10 h.01" strokeLinecap="round" /></svg>
          <div style={{ flex: 1, overflow: "hidden", display: "flex", justifyContent: hasText ? "flex-end" : "flex-start" }}>
            {hasText
              ? <span style={{ fontFamily: WAF, fontSize: 32, color: wa.text, whiteSpace: "nowrap", flexShrink: 0 }}>{shown}{cursorOn ? <span style={{ color: wa.green }}>|</span> : null}</span>
              : <span style={{ fontFamily: WAF, fontSize: 32, color: wa.sub }}>Message</span>}
          </div>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={wa.sub} strokeWidth="2" strokeLinecap="round"><path d="M21.4 11.05 12.25 20.2a6 6 0 0 1-8.49-8.49l8.6-8.6a4 4 0 0 1 5.66 5.66l-8.6 8.6a2 2 0 0 1-2.83-2.83l8.49-8.49" /></svg>
          {!hasText ? <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={wa.sub} strokeWidth="2"><rect x="4" y="7" width="14" height="12" rx="3" /><circle cx="11" cy="13" r="3.4" /><path d="M9 7 L10.2 4.5 H11.8 L13 7" /></svg> : null}
        </div>
        <div style={{ width: 92, height: 92, borderRadius: "50%", background: wa.green, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          {hasText
            ? <svg width="40" height="40" viewBox="0 0 24 24" fill="#FFF"><path d="M3 21 L22 12 L3 3 V10 L16 12 L3 14 Z" /></svg>
            : <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#FFF" strokeWidth="2" strokeLinecap="round"><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5 11 a7 7 0 0 0 14 0 M12 18 v3" /></svg>}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// =============================================================================
// StatusBar — phone status bar inside the screen (9:41, signal/wifi/battery)
// =============================================================================
export const StatusBar: React.FC<{ time?: string; light?: boolean }> = ({ time = "9:41", light = false }) => {
  const c = light ? "#E9EDEF" : ui.white;
  return (
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 90, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 56px 0", zIndex: 5 }}>
      <span style={{ fontFamily: UIFONT, fontSize: 34, fontWeight: 600, color: c }}>{time}</span>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <svg width="36" height="26" viewBox="0 0 18 13">{[2, 5, 8, 11].map((h, i) => (<rect key={i} x={i * 4.4} y={12 - h} width="3" height={h} rx="1" fill={c} />))}</svg>
        <svg width="34" height="26" viewBox="0 0 17 13"><path d="M8.5 12.5 L1 5 a10.6 10.6 0 0 1 15 0 Z" fill="none" stroke={c} strokeWidth="1.8" /><path d="M8.5 12 L4.2 7.7 a6 6 0 0 1 8.6 0 Z" fill={c} /></svg>
        <svg width="50" height="26" viewBox="0 0 25 13"><rect x="0.8" y="1" width="20" height="11" rx="3" fill="none" stroke={c} strokeWidth="1.4" /><rect x="2.6" y="2.8" width="13" height="7.4" rx="1.6" fill={c} /><path d="M22.6 4.5 v4 a2 2 0 0 0 0-4z" fill={c} /></svg>
      </div>
    </div>
  );
};

// =============================================================================
// PhoneFrame — device mockup floating on the cream brand canvas
// =============================================================================
// Cream shell = narration layer; dark screen = product layer. Slow settle
// rotation, gentle push-in, and a haptic dip on each send frame.
export const CREAM = "#E8E0D3";
export const INK = "#1F1B16";
export const CORAL = "#C15F3C";

export const PhoneFrame: React.FC<{ children: React.ReactNode; dipFrames?: number[] }> = ({ children }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  // Camera only: slow push-in across the scene; the phone itself never moves.
  const p = interpolate(frame, [0, durationInFrames], [0, 1]);
  const zoom = 1.0 + 0.045 * (p * p * (3 - 2 * p));
  return (
    <AbsoluteFill style={{ background: CREAM, transform: `scale(${zoom})` }}>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ position: "absolute", width: 1300, height: 1300, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 65%)" }} />
        <div style={{ position: "absolute", bottom: 46, width: 620, height: 60, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(31,27,22,0.30) 0%, rgba(31,27,22,0) 70%)", filter: "blur(6px)" }} />
        <div style={{ width: 902, height: 1836, borderRadius: 96, background: "#0A0A0B", padding: 15, boxSizing: "border-box", border: "1px solid rgba(31,27,22,0.35)" }}>
          <div style={{ width: 872, height: 1806, borderRadius: 82, overflow: "hidden", position: "relative", background: ui.black }}>
            <div style={{ width: 1080, height: 2237, transform: "scale(0.8074)", transformOrigin: "top left", position: "absolute", top: 0, left: 0 }}>
              {children}
            </div>
            <div style={{ position: "absolute", top: 14, left: "50%", transform: "translateX(-50%)", width: 220, height: 56, borderRadius: 30, background: "#0A0A0B" }} />
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
