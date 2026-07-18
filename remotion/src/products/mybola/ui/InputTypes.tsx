import React from "react";
import { interpolate } from "remotion";
import { MYBOLA } from "../design";
import { t } from "./tokens";
import { useEnter } from "../../../shared/motion/reveal";

// =============================================================================
// InputTypes — the 5 accepted input kinds (= ALLOWED_MIME + text)
// =============================================================================
// text · audio · video · gambar · PDF. These map 1:1 to what the chat actually
// accepts (mybola_backend/app/conversation/media.py). Each is a labeled glyph in
// a rounded surface tile; they arrive on a stagger (the caller passes a frame).

const stroke = MYBOLA.white;
const glyph: Record<string, React.ReactNode> = {
  Teks: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round"><path d="M4 6h16M4 12h16M4 18h10" /></svg>
  ),
  Audio: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5 11a7 7 0 0014 0M12 18v3" /></svg>
  ),
  Video: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinejoin="round"><rect x="2" y="6" width="13" height="12" rx="2" /><path d="M15 10l6-3v10l-6-3" /></svg>
  ),
  Gambar: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinejoin="round"><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="8.5" cy="9.5" r="1.8" fill={stroke} stroke="none" /><path d="M4 18l5-5 4 4 3-3 4 4" /></svg>
  ),
  PDF: (
    <svg width="26" height="30" viewBox="0 0 26 30" fill="none"><path d="M3 1h13l7 7v20a1 1 0 01-1 1H3a1 1 0 01-1-1V2a1 1 0 011-1z" stroke={stroke} strokeWidth="1.8" strokeLinejoin="round" /><path d="M16 1v7h7" stroke={stroke} strokeWidth="1.8" strokeLinejoin="round" /><text x="13" y="24" textAnchor="middle" fontFamily="sans-serif" fontSize="7" fontWeight={700} fill={stroke}>PDF</text></svg>
  ),
};

const KINDS = ["Teks", "Audio", "Video", "Gambar", "PDF"] as const;

const Tile: React.FC<{ kind: string; delay: number }> = ({ kind, delay }) => {
  const p = useEnter(delay, "settle");
  const y = interpolate(p, [0, 1], [24, 0]);
  return (
    <div style={{ opacity: p, transform: `translateY(${y}px)`, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
      <div style={{ width: 92, height: 92, borderRadius: 22, background: MYBOLA.secondary, border: `1px solid ${MYBOLA.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {glyph[kind]}
      </div>
      <span style={{ ...t.label, color: MYBOLA.tertiary }}>{kind}</span>
    </div>
  );
};

export const InputTypes: React.FC<{ startDelay?: number; stagger?: number }> = ({ startDelay = 0, stagger = 4 }) => (
  <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", maxWidth: 360 }}>
    {KINDS.map((k, i) => (
      <Tile key={k} kind={k} delay={startDelay + i * stagger} />
    ))}
  </div>
);
