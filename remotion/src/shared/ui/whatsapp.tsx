import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { usePjs } from "./theme";

// =============================================================================
// WhatsApp UI — exact recreation of WA dark theme (the parent's phone)
// =============================================================================
// Product-neutral: WhatsApp looks the same whoever the academy/brand is, so this
// lives in shared/. Only the contact name/avatar are passed in.
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
  contactName?: string; contactInitials?: string;
}> = ({ children, typedText = "", startFrame = 0, charsPerFrame = 0.8, sentAtFrame = null as unknown as number, contactName = "Akademi Tunas Muda", contactInitials = "AT" }) => {
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
          <span style={{ fontFamily: WAF, fontSize: 36, fontWeight: 600, color: wa.text }}>{contactInitials}</span>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: WAF, fontSize: 34, fontWeight: 600, color: wa.text }}>{contactName}</div>
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
