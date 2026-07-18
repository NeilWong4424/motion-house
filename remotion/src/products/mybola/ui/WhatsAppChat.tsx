import React from "react";
import { MYBOLA } from "../design";
import { familyOf } from "../../../shared/design/types";
import { mybola } from "../design";

// =============================================================================
// WhatsAppChat — the REAL WhatsApp app UI, replicated 1:1 (customer's view)
// =============================================================================
// This is what the academy's customer sees in their own WhatsApp when they message
// the academy. WhatsApp dark theme: header #1F2C34 with avatar+name+call/video/menu,
// doodle wallpaper over #0B141A, incoming grey bubbles (left) #1F2C34, outgoing
// green (right) #005C4B with blue read ticks + time. A document bubble carries the
// PDF receipt. All copy Bahasa Melayu (real concierge phrasing / verbatim strings).

const FONT = familyOf(mybola.type.body);

// One WhatsApp message. `out` = sent by the customer (right/green); otherwise the
// academy's reply (left/grey). `doc` renders a PDF-document tile.
export type WaMsg = {
  out: boolean;
  text?: string;
  time: string;
  doc?: { name: string; caption: string };
};

const Tick = () => (
  <svg width="16" height="11" viewBox="0 0 18 12" fill="none" style={{ marginLeft: 3 }}>
    <path d="M1 6.5L4 9.5L10 2.5" stroke={MYBOLA.waTick} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6 6.5L9 9.5L15 2.5" stroke={MYBOLA.waTick} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const DocTile: React.FC<{ name: string }> = ({ name }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(0,0,0,0.25)", borderRadius: 8, padding: "10px 12px", marginBottom: 6 }}>
    {/* PDF page glyph. */}
    <svg width="26" height="30" viewBox="0 0 26 30" fill="none">
      <path d="M3 1h13l7 7v20a1 1 0 01-1 1H3a1 1 0 01-1-1V2a1 1 0 011-1z" fill="#EA4335" />
      <path d="M16 1l7 7h-7V1z" fill="#B31412" />
      <text x="13" y="22" textAnchor="middle" fontFamily={FONT} fontSize="7" fontWeight={700} fill="#fff">PDF</text>
    </svg>
    <div style={{ minWidth: 0 }}>
      <div style={{ fontFamily: FONT, fontSize: 13.5, color: "#E9EDEF", fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{name}</div>
      <div style={{ fontFamily: FONT, fontSize: 11, color: "rgba(233,237,239,0.6)", marginTop: 2 }}>1 halaman · PDF</div>
    </div>
  </div>
);

const Bubble: React.FC<{ m: WaMsg }> = ({ m }) => (
  <div style={{ display: "flex", justifyContent: m.out ? "flex-end" : "flex-start", marginBottom: 8 }}>
    <div
      style={{
        maxWidth: 300,
        background: m.out ? MYBOLA.waOutgoing : MYBOLA.waIncoming,
        borderRadius: 10,
        borderTopRightRadius: m.out ? 2 : 10,
        borderTopLeftRadius: m.out ? 10 : 2,
        padding: "7px 9px 5px",
      }}
    >
      {m.doc && <DocTile name={m.doc.name} />}
      {(m.text ?? m.doc?.caption) && (
        <span style={{ fontFamily: FONT, fontSize: 15, lineHeight: "20px", color: "#E9EDEF", whiteSpace: "pre-wrap" }}>
          {m.text ?? m.doc?.caption}
        </span>
      )}
      <span style={{ display: "inline-flex", alignItems: "center", float: "right", marginLeft: 8, marginTop: 4, transform: "translateY(3px)" }}>
        <span style={{ fontFamily: FONT, fontSize: 11, color: "rgba(233,237,239,0.55)" }}>{m.time}</span>
        {m.out && <Tick />}
      </span>
      <div style={{ clear: "both" }} />
    </div>
  </div>
);

export const WhatsAppChat: React.FC<{
  /** Contact name in the header (the academy). */
  name: string;
  /** Messages shown; the caller controls how many are visible per frame. */
  messages: WaMsg[];
}> = ({ name, messages }) => {
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", background: MYBOLA.waBg }}>
      {/* Header. */}
      <div style={{ paddingTop: 44, background: MYBOLA.waHeader }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px 10px" }}>
          <svg width="10" height="18" viewBox="0 0 10 18" fill="none" stroke="#E9EDEF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 1L1 9l8 8" /></svg>
          {/* Avatar. */}
          <div style={{ width: 38, height: 38, borderRadius: 19, background: MYBOLA.waGreen, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 16, color: "#0B141A" }}>{name.slice(0, 1)}</span>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: FONT, fontSize: 16, fontWeight: 600, color: "#E9EDEF" }}>{name}</div>
            <div style={{ fontFamily: FONT, fontSize: 12, color: "rgba(233,237,239,0.6)" }}>dalam talian</div>
          </div>
          {/* video / call / menu glyphs. */}
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#E9EDEF" strokeWidth="1.8"><path d="M2 6.5A1.5 1.5 0 013.5 5h9A1.5 1.5 0 0114 6.5v11A1.5 1.5 0 0112.5 19h-9A1.5 1.5 0 012 17.5v-11zM17 9l5-3v12l-5-3" strokeLinejoin="round" /></svg>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E9EDEF" strokeWidth="1.8" style={{ marginLeft: 4 }}><path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3 19.5 19.5 0 01-6-6 19.8 19.8 0 01-3-8.6A2 2 0 014.1 2h3a2 2 0 012 1.7c.1.9.3 1.8.6 2.6a2 2 0 01-.5 2.1L8 11.5a16 16 0 006 6l1.1-1.1a2 2 0 012.1-.5c.8.3 1.7.5 2.6.6a2 2 0 011.7 2z" strokeLinejoin="round" /></svg>
        </div>
      </div>

      {/* Wallpaper (subtle doodle tint) + messages. */}
      <div
        style={{
          flex: 1,
          padding: "14px 12px",
          overflow: "hidden",
          backgroundColor: MYBOLA.waBg,
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), radial-gradient(rgba(255,255,255,0.015) 1px, transparent 1px)",
          backgroundSize: "22px 22px, 34px 34px",
          backgroundPosition: "0 0, 11px 17px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
        }}
      >
        {messages.map((m, i) => (
          <Bubble key={i} m={m} />
        ))}
      </div>

      {/* Input bar. */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px 16px", background: MYBOLA.waBg }}>
        <div style={{ flex: 1, height: 40, borderRadius: 20, background: MYBOLA.waHeader, display: "flex", alignItems: "center", padding: "0 14px" }}>
          <span style={{ fontFamily: FONT, fontSize: 14, color: "rgba(233,237,239,0.5)" }}>Taip mesej</span>
        </div>
        <div style={{ width: 40, height: 40, borderRadius: 20, background: MYBOLA.waGreen, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0B141A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5 11a7 7 0 0014 0M12 18v3" /></svg>
        </div>
      </div>
    </div>
  );
};
