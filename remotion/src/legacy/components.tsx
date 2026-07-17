import React, { useState } from "react";
import { AbsoluteFill, continueRender, delayRender, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "./theme";

// ---------- fonts ----------
const FONTS = [
  ["Playfair Display", "fonts/playfair-500.woff2", "500"],
  ["Playfair Display", "fonts/playfair-600.woff2", "600"],
  ["Inter", "fonts/inter-400.woff2", "400"],
  ["Inter", "fonts/inter-600.woff2", "600"],
  ["Inter", "fonts/inter-700.woff2", "700"],
] as const;

let fontsLoaded = false;
export const useFonts = () => {
  const [handle] = useState(() => (fontsLoaded ? null : delayRender("fonts")));
  if (!fontsLoaded && handle !== null) {
    Promise.all(
      FONTS.map(([family, file, weight]) => {
        const f = new FontFace(family, `url(${staticFile(file)})`, { weight });
        return f.load().then((loaded) => document.fonts.add(loaded));
      })
    ).then(() => {
      fontsLoaded = true;
      continueRender(handle);
    });
  }
};

export const SERIF = "'Playfair Display', Georgia, serif";
export const SANS = "'Inter', Arial, sans-serif";

// ---------- helpers ----------
export const fadeUp = (frame: number, fps: number, delay = 0) => {
  const s = spring({ frame: frame - delay, fps, config: { damping: 13, stiffness: 175 } });
  return { opacity: s, transform: `translateY(${interpolate(s, [0, 1], [36, 0])}px)` };
};

export const Canvas: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useFonts();
  return (
    <AbsoluteFill style={{ background: theme.colors.canvas, fontFamily: SERIF }}>
      {children}
    </AbsoluteFill>
  );
};

// Slow cinematic camera: zoom + gentle drift across the scene's duration.
export const Camera: React.FC<{ children: React.ReactNode; zoomFrom?: number; zoomTo?: number; driftX?: number; driftY?: number }> = ({ children, zoomFrom = 1.0, zoomTo = 1.07, driftX = 0, driftY = 0 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const p = interpolate(frame, [0, durationInFrames], [0, 1], { extrapolateRight: "clamp" });
  const ease = p * p * (3 - 2 * p);
  const z = zoomFrom + (zoomTo - zoomFrom) * ease;
  return (
    <AbsoluteFill style={{ transform: `scale(${z}) translate(${driftX * ease}px, ${driftY * ease}px)` }}>
      {children}
    </AbsoluteFill>
  );
};

export const Badge: React.FC<{ text: string; delay?: number }> = ({ text, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ ...fadeUp(frame, fps, delay), display: "inline-flex", alignItems: "center", gap: 12, border: `2px solid ${theme.colors.ink}`, borderRadius: 12, padding: "12px 28px", fontFamily: SANS, fontSize: 24, letterSpacing: 4, color: theme.colors.ink, fontWeight: 600 }}>
      <span style={{ width: 12, height: 12, borderRadius: "50%", background: theme.colors.coral, display: "inline-block" }} />
      {text.toUpperCase()}
    </div>
  );
};

export const HeroText: React.FC<{ lines: string[]; delay?: number; size?: number }> = ({ lines, delay = 0, size = 84 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ textAlign: "center" }}>
      {lines.map((line, i) => (
        <div key={i} style={{ ...fadeUp(frame, fps, delay + i * 4), fontSize: size, lineHeight: 1.24, color: theme.colors.ink, fontWeight: 500, fontFamily: SERIF }}>
          {line}
        </div>
      ))}
    </div>
  );
};

// ---------- chat message model ----------
export type ChatMsg = {
  side: "user" | "agent";
  at: number;
  kind?: "text" | "voice" | "pdf" | "image";
  text?: string;
  label?: string;
};

const estHeight = (m: ChatMsg): number => {
  if (m.kind === "voice") return 92;
  if (m.kind === "pdf") return 104;
  if (m.kind === "image") return 150;
  const lines = Math.max(1, Math.ceil((m.text ?? "").length / 25));
  return lines * 30 + 34;
};

const VoiceNote: React.FC = () => (
  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
    <div style={{ width: 34, height: 34, borderRadius: "50%", background: "rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <svg width="14" height="14" viewBox="0 0 14 14"><path d="M3 2 L11 7 L3 12 Z" fill="#FFF" /></svg>
    </div>
    {[10, 18, 12, 22, 16, 26, 14, 20, 10, 16, 24, 12, 18, 8].map((h, i) => (
      <span key={i} style={{ width: 4, height: h, borderRadius: 2, background: "rgba(255,255,255,0.85)", display: "inline-block", marginLeft: i ? -6 : 0 }} />
    ))}
    <span style={{ fontFamily: SANS, fontSize: 17, color: "#FFF", marginLeft: 6 }}>0:07</span>
  </div>
);

const FileCard: React.FC<{ label: string }> = ({ label }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
    <div style={{ width: 46, height: 56, borderRadius: 8, background: "#FFF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <span style={{ fontFamily: SANS, fontSize: 13, fontWeight: 700, color: theme.colors.coral }}>PDF</span>
    </div>
    <div>
      <div style={{ fontFamily: SANS, fontSize: 19, fontWeight: 600, color: "#FFF" }}>{label}</div>
      <div style={{ fontFamily: SANS, fontSize: 15, color: "rgba(255,255,255,0.75)" }}>128 KB</div>
    </div>
  </div>
);

const ImageCard: React.FC<{ label: string }> = ({ label }) => (
  <div>
    <div style={{ width: 250, height: 86, borderRadius: 12, background: "linear-gradient(135deg, #2C4A32 0%, #4A7A54 60%, #C8A24B 100%)", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 14, top: 14, width: 60, height: 60, borderRadius: "50%", border: "3px solid rgba(255,255,255,0.7)" }} />
      <div style={{ position: "absolute", right: 16, bottom: 10, fontFamily: SANS, fontSize: 15, fontWeight: 700, color: "#FFF", letterSpacing: 1 }}>SABTU · 9 PAGI</div>
    </div>
    <div style={{ fontFamily: SANS, fontSize: 15, color: "rgba(255,255,255,0.8)", marginTop: 6 }}>{label}</div>
  </div>
);

// One message: wrapper height springs 0 -> estimated height so the stack pushes up smoothly.
const Message: React.FC<{ m: ChatMsg }> = ({ m }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < m.at - 5) return null;
  const s = spring({ frame: frame - m.at, fps, config: { damping: 14, stiffness: 150 } });
  const h = estHeight(m);
  const user = m.side === "user";
  return (
    <div style={{ height: h * Math.min(1, s * 1.02), overflow: "visible", display: "flex", alignItems: "flex-end", justifyContent: user ? "flex-end" : "flex-start" }}>
      <div style={{ opacity: s, transform: `translateY(${interpolate(s, [0, 1], [20, 0])}px) scale(${interpolate(s, [0, 1], [0.94, 1])})`, maxWidth: 350, background: user ? theme.colors.bubbleUser : theme.colors.bubbleAgent, color: user ? "#FFF" : theme.colors.ink, borderRadius: 22, padding: "15px 19px", fontFamily: SANS, fontSize: 21, lineHeight: 1.42, boxSizing: "border-box", marginBottom: 12 }}>
        {m.kind === "voice" ? <VoiceNote /> : m.kind === "pdf" ? <FileCard label={m.label ?? "dokumen.pdf"} /> : m.kind === "image" ? <ImageCard label={m.label ?? "imej.png"} /> : m.text}
      </div>
    </div>
  );
};

export const TypingDots: React.FC<{ atFrame: number; untilFrame: number }> = ({ atFrame, untilFrame }) => {
  const frame = useCurrentFrame();
  if (frame < atFrame || frame > untilFrame) return null;
  return (
    <div style={{ display: "flex", justifyContent: "flex-start" }}>
      <div style={{ background: theme.colors.bubbleAgent, borderRadius: 22, padding: "17px 21px", display: "flex", gap: 8, marginBottom: 12 }}>
        {[0, 1, 2].map((i) => (
          <span key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: theme.colors.coralSoft, opacity: 0.4 + 0.6 * Math.abs(Math.sin((frame - atFrame) / 5 + i)) }} />
        ))}
      </div>
    </div>
  );
};

// Persistent phone shell for continuous conversations.
export const Phone: React.FC<{ children: React.ReactNode; title: string; chip: string }> = ({ children, title, chip }) => (
  <div style={{ width: 500, height: 860, background: theme.colors.card, borderRadius: 56, padding: "34px 30px", display: "flex", flexDirection: "column", boxSizing: "border-box" }}>
    <div style={{ textAlign: "center", marginBottom: 6 }}>
      <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 26, color: theme.colors.ink }}>{title}</div>
      <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#F3E4DB", borderRadius: 10, padding: "3px 12px", marginTop: 6 }}>
        <span style={{ fontFamily: SANS, fontSize: 15, color: theme.colors.coral, fontWeight: 700 }}>{chip}</span>
      </div>
    </div>
    <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end", overflow: "hidden", paddingBottom: 8 }}>{children}</div>
    <div style={{ background: "#FDFAF3", borderRadius: 20, padding: "14px 20px", fontFamily: SANS, fontSize: 19, color: theme.colors.inkSoft, display: "flex", alignItems: "center", gap: 12 }}>
      <svg width="20" height="20" viewBox="0 0 20 20" style={{ flexShrink: 0 }}><path d="M8 4 L8 13 a3 3 0 0 0 6 0 L14 6 a2 2 0 0 0 -4 0 L10 12 a1 1 0 0 0 2 0 L12 6" fill="none" stroke={theme.colors.inkSoft} strokeWidth="1.6" strokeLinecap="round" /></svg>
      <span style={{ flex: 1 }}>Tanya MyBola apa sahaja</span>
      <svg width="20" height="20" viewBox="0 0 20 20" style={{ flexShrink: 0 }}><rect x="7" y="2" width="6" height="11" rx="3" fill="none" stroke={theme.colors.inkSoft} strokeWidth="1.6" /><path d="M4 10 a6 6 0 0 0 12 0 M10 16 L10 19" fill="none" stroke={theme.colors.inkSoft} strokeWidth="1.6" strokeLinecap="round" /></svg>
    </div>
  </div>
);

// Crossfading chapter header above the persistent phone.
export type Chapter = { num: string; title: string; from: number; to: number };
export const ChapterHeader: React.FC<{ chapters: Chapter[] }> = ({ chapters }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ height: 170, position: "relative", width: "100%" }}>
      {chapters.map((c, i) => {
        const inO = interpolate(frame, [c.from, c.from + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const outO = interpolate(frame, [c.to - 10, c.to], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const o = Math.min(inO, i === chapters.length - 1 ? 1 : outO);
        const y = interpolate(inO, [0, 1], [24, 0]);
        if (o <= 0) return null;
        return (
          <div key={i} style={{ position: "absolute", inset: 0, textAlign: "center", opacity: o, transform: `translateY(${y}px)` }}>
            <div style={{ fontFamily: SANS, fontSize: 26, letterSpacing: 6, color: theme.colors.coral, fontWeight: 700, marginBottom: 10 }}>{c.num}</div>
            <div style={{ fontFamily: SERIF, fontSize: 68, color: theme.colors.ink, fontWeight: 500 }}>{c.title}</div>
          </div>
        );
      })}
    </div>
  );
};

export const Conversation: React.FC<{ msgs: ChatMsg[]; title: string; chip: string; dots?: Array<[number, number]> }> = ({ msgs, title, chip, dots = [] }) => {
  const frame = useCurrentFrame();
  return (
    <Phone title={title} chip={chip}>
      {msgs.map((m, i) => (
        <Message key={i} m={m} />
      ))}
      {dots.map(([a, b], i) => (
        <TypingDots key={`d${i}`} atFrame={a} untilFrame={b} />
      ))}
    </Phone>
  );
};

export const ModalityChip: React.FC<{ label: string; atFrame: number; icon: React.ReactNode }> = ({ label, atFrame, icon }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - atFrame, fps, config: { damping: 12, stiffness: 170 } });
  return (
    <div style={{ opacity: s, transform: `translateY(${interpolate(s, [0, 1], [34, 0])}px)`, display: "flex", alignItems: "center", gap: 16, background: theme.colors.card, borderRadius: 20, padding: "20px 30px", width: 420, boxSizing: "border-box" }}>
      <div style={{ width: 52, height: 52, borderRadius: 14, background: "#F3E4DB", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{icon}</div>
      <span style={{ fontFamily: SANS, fontSize: 30, fontWeight: 600, color: theme.colors.ink }}>{label}</span>
    </div>
  );
};

export const PillarCard: React.FC<{ title: string; items: string[]; atFrame: number }> = ({ title, items, atFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - atFrame, fps, config: { damping: 13, stiffness: 160 } });
  return (
    <div style={{ opacity: s, transform: `translateY(${interpolate(s, [0, 1], [50, 0])}px)`, background: theme.colors.card, borderRadius: 28, padding: "34px 40px", width: 460, boxSizing: "border-box" }}>
      <div style={{ width: 56, height: 8, borderRadius: 4, background: theme.colors.coral, marginBottom: 16 }} />
      <div style={{ fontFamily: SERIF, fontSize: 40, color: theme.colors.ink, fontWeight: 500, marginBottom: 18 }}>{title}</div>
      {items.map((it, i) => {
        const o = interpolate(frame, [atFrame + 8 + i * 5, atFrame + 16 + i * 5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (
          <div key={i} style={{ opacity: o, display: "flex", alignItems: "center", gap: 12, fontFamily: SANS, fontSize: 23, color: theme.colors.inkSoft, marginBottom: 11 }}>
            <span style={{ width: 9, height: 9, borderRadius: "50%", background: theme.colors.coral, display: "inline-block", flexShrink: 0 }} />
            {it}
          </div>
        );
      })}
    </div>
  );
};

export const Wordmark: React.FC<{ size?: number; delay?: number }> = ({ size = 104, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 13, stiffness: 140 } });
  const rot = interpolate(s, [0, 1], [-90, 0]);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: size * 0.25, opacity: s }}>
      <svg width={size} height={size} viewBox="0 0 100 100" style={{ transform: `rotate(${rot}deg)` }}>
        <circle cx="50" cy="50" r="44" fill="none" stroke={theme.colors.coral} strokeWidth="9" />
        <path d="M50 22 L60 40 L80 42 L65 56 L70 76 L50 65 L30 76 L35 56 L20 42 L40 40 Z" fill={theme.colors.coral} />
      </svg>
      <span style={{ fontSize: size, color: theme.colors.ink, fontWeight: 500, fontFamily: SERIF }}>MyBola</span>
    </div>
  );
};
