import React from "react";
import { interpolate } from "remotion";
import { EASE } from "../../../shared/motion/easing";
import { CD } from "../design";
import { serif, ui, uiFamily } from "../tokens";

// =============================================================================
// Surfaces — devices + app screens for the Claude "Dispatch" film
// =============================================================================
// All UI recreated to match the reference recording as-is (see NOTES.md). No
// emoji (headless Chrome renders blank boxes; QC gate enforces). Glyphs are SVG.
// In-screen motion uses small eased reveals; the between-device handoff is driven
// by the world's DeviceLayer, not here.

type CSS = React.CSSProperties;

// -----------------------------------------------------------------------------
// Small reveal helper (fade + rise), for messages / dialogs appearing in-app.
// -----------------------------------------------------------------------------
export const rise = (f: number, at: number, dy = 16, dur = 7): CSS => {
  const p = interpolate(f, [at, at + dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.easeOutQuart });
  return { opacity: p, transform: `translateY(${(1 - p) * dy}px)` };
};
const pop = (f: number, at: number, dur = 7): CSS => {
  const p = interpolate(f, [at, at + dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.easeOutQuart });
  return { opacity: p, transform: `scale(${interpolate(p, [0, 1], [0.92, 1])})` };
};

// =============================================================================
// Devices
// =============================================================================

/** Portrait phone — light body, notch, Dispatch content fills the screen. */
export const PHONE_W = 560;
export const PHONE_H = 1180;
export const PhoneDevice: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ width: PHONE_W + 36, height: PHONE_H + 36, borderRadius: 76, background: CD.paper, border: `1px solid ${CD.line}`, padding: 18, boxSizing: "border-box", boxShadow: "inset 0 0 0 2px rgba(255,255,255,0.7)" }}>
    <div style={{ position: "relative", width: PHONE_W, height: PHONE_H, borderRadius: 60, overflow: "hidden", background: CD.paper }}>
      {children}
      <div style={{ position: "absolute", top: 14, left: "50%", transform: "translateX(-50%)", width: 128, height: 30, borderRadius: 16, background: "rgba(28,26,23,0.10)", zIndex: 60 }} />
    </div>
  </div>
);

/** Landscape macOS window (laptop lid). Content = one app surface. */
export const MAC_W = 1360;
export const MAC_H = 850;
export const MacWindow: React.FC<{ children: React.ReactNode; menuApp?: string; menu?: React.ReactNode }> = ({ children, menuApp = "Dispatch", menu }) => (
  <div style={{ width: MAC_W, height: MAC_H, borderRadius: 18, overflow: "hidden", background: CD.windowChrome, border: `1px solid ${CD.line}` }}>
    {/* menu bar */}
    <div style={{ height: 30, background: "rgba(250,248,244,0.92)", display: "flex", alignItems: "center", gap: 20, padding: "0 16px", borderBottom: `1px solid ${CD.lineSoft}`, position: "relative" }}>
      <AppleMark />
      <span style={ui.menuBold}>{menuApp}</span>
      {["File", "Edit", "View", "Go", "Tools", "Window", "Help"].map((m) => (
        <span key={m} style={ui.menu}>{m}</span>
      ))}
      {menu}
    </div>
    <div style={{ position: "relative", width: MAC_W, height: MAC_H - 30, overflow: "hidden" }}>{children}</div>
  </div>
);

/** iMac — a big screen on a pale stand. */
export const IMAC_W = 1420;
export const IMAC_SH = 850;
export const ImacDevice: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ width: IMAC_W, display: "flex", flexDirection: "column", alignItems: "center" }}>
    <div style={{ width: IMAC_W, height: IMAC_SH + 24, borderRadius: 20, background: "#e9e6df", border: `1px solid ${CD.line}`, padding: 12, boxSizing: "border-box" }}>
      <div style={{ width: "100%", height: "100%", borderRadius: 10, overflow: "hidden", background: CD.bgWave }}>{children}</div>
    </div>
    {/* chin + stand */}
    <div style={{ width: IMAC_W, height: 60, background: "#eeece6", borderRadius: "0 0 20px 20px" }} />
    <div style={{ width: 200, height: 70, background: "#e6e3dc", clipPath: "polygon(30% 0, 70% 0, 100% 100%, 0 100%)" }} />
    <div style={{ width: 320, height: 12, background: "#e2ded6", borderRadius: 6 }} />
  </div>
);

// =============================================================================
// Glyphs (SVG only — QC-safe)
// =============================================================================
const AppleMark = () => (
  <svg width="13" height="15" viewBox="0 0 24 28" fill={CD.ink}><path d="M17 0c.2 1.6-.5 3.2-1.5 4.3-1 1.2-2.7 2.1-4.3 2 -.2-1.6.6-3.2 1.5-4.2C13.7 1 15.5.1 17 0zM21.5 20.5c-.6 1.4-.9 2-1.7 3.2-1.1 1.7-2.6 3.8-4.5 3.8 -1.7 0-2.1-1.1-4.4-1.1 -2.3 0-2.8 1.1-4.4 1.1 -1.9 0-3.4-1.9-4.5-3.6C-.6 20.3-1 15-2 15" transform="translate(6 0)"/></svg>
);
const Hamburger = ({ c = CD.ink }: { c?: string }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" stroke={c} strokeWidth="2" strokeLinecap="round"><path d="M4 7h16M4 12h11M4 17h16" /></svg>
);
const Plus = ({ c = CD.inkSoft }: { c?: string }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" stroke={c} strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
);
const SendUp = ({ c = CD.white }: { c?: string }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" stroke={c} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" fill="none"><path d="M12 19V6M6 12l6-6 6 6" /></svg>
);
const Traffic = () => (
  <div style={{ display: "flex", gap: 7 }}>
    {["#ec6a5e", "#f4bf4f", "#61c554"].map((c) => (<div key={c} style={{ width: 11, height: 11, borderRadius: 6, background: c }} />))}
  </div>
);

// =============================================================================
// Dispatch phone chat
// =============================================================================
export type ChatMsg = {
  out: boolean; // true = user (rust bubble, right); false = assistant (white, left)
  text: string;
  time?: string;
  at: number; // frame the bubble arrives
};

const Bubble: React.FC<{ m: ChatMsg; f: number }> = ({ m, f }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: m.out ? "flex-end" : "flex-start", ...rise(f, m.at, 14) }}>
    {m.time && <span style={{ ...ui.time, alignSelf: "center", margin: "6px 0 10px" }}>{m.time}</span>}
    <div
      style={{
        maxWidth: 420,
        padding: "16px 20px",
        borderRadius: 26,
        background: m.out ? CD.accent : CD.chatIn,
        color: m.out ? CD.bubbleText : CD.chatInInk,
        boxShadow: m.out ? "none" : "0 2px 10px rgba(60,45,30,0.06)",
      }}
    >
      <span style={m.out ? ui.bubble : ui.bubbleIn}>{m.text}</span>
    </div>
  </div>
);

/** Full Dispatch chat screen. `msgs` reveal by their `at` frame; scrolls to keep the newest visible. */
export const DispatchChat: React.FC<{ f: number; msgs: ChatMsg[]; scrollAt?: number; scrollBy?: number }> = ({ f, msgs, scrollAt = 0, scrollBy = 0 }) => {
  const scroll = interpolate(f, [scrollAt, scrollAt + 12], [0, scrollBy], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.easeOutQuart });
  return (
    <div style={{ position: "absolute", inset: 0, background: CD.paper, display: "flex", flexDirection: "column" }}>
      {/* header */}
      <div style={{ paddingTop: 58, paddingBottom: 16, display: "flex", flexDirection: "column", alignItems: "center", gap: 3, position: "relative", borderBottom: `1px solid ${CD.lineSoft}` }}>
        <div style={{ position: "absolute", left: 26, top: 60 }}><Hamburger /></div>
        <span style={ui.appName}>Dispatch</span>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 7, height: 7, borderRadius: 4, background: CD.onlineDot }} />
          <span style={ui.status}>Online</span>
        </div>
      </div>
      {/* transcript */}
      <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
        <div style={{ position: "absolute", left: 24, right: 24, bottom: 20, display: "flex", flexDirection: "column", gap: 12, transform: `translateY(${-scroll}px)` }}>
          {msgs.map((m, i) => (<Bubble key={i} m={m} f={f} />))}
        </div>
      </div>
      {/* input */}
      <div style={{ padding: "14px 22px 30px", borderTop: `1px solid ${CD.lineSoft}`, display: "flex", alignItems: "center", gap: 14 }}>
        <Plus />
        <span style={{ ...ui.input, flex: 1 }}>Ask Claude anything</span>
        <div style={{ width: 40, height: 40, borderRadius: 22, background: CD.accent, opacity: 0.5, display: "flex", alignItems: "center", justifyContent: "center" }}><SendUp /></div>
      </div>
    </div>
  );
};

// =============================================================================
// Full-frame hero bubble + copy-line + title cards
// =============================================================================
export const HeroBubble: React.FC<{ text: string; f: number; at?: number }> = ({ text, f, at = 0 }) => (
  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
    <div style={{ maxWidth: 820, padding: "34px 44px", borderRadius: 40, background: CD.accent, ...pop(f, at, 6) }}>
      <span style={{ ...ui.bubble, fontSize: 40, lineHeight: 1.32, color: CD.bubbleText }}>{text}</span>
    </div>
  </div>
);

export const CopyLine: React.FC<{ line1: string; line2: string; f: number; at: number }> = ({ line1, line2, f, at }) => (
  <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", gap: 2 }}>
    <span style={{ ...serif.line, ...rise(f, at, 12, 8) }}>{line1}</span>
    <span style={{ ...serif.lineDim, ...rise(f, at + 2, 12, 8) }}>{line2}</span>
  </div>
);

export const TitleCard: React.FC<{ f: number }> = ({ f }) => (
  <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
    <div style={{ ...rise(f, 8, 10, 8), padding: "6px 16px", borderRadius: 20, border: `1px solid ${CD.line}`, marginBottom: 26 }}>
      <span style={{ fontFamily: uiFamily, fontWeight: 600, fontSize: 12, letterSpacing: 1.4, color: CD.inkSoft }}>RESEARCH PREVIEW</span>
    </div>
    <span style={{ ...serif.title, ...rise(f, 8, 12, 8) }}>Reach your desktop</span>
    <span style={{ ...serif.title, color: CD.inkSoft, ...rise(f, 12, 12, 8) }}>from your pocket</span>
  </div>
);

// =============================================================================
// Desktop app surfaces
// =============================================================================

/** Northgate deck (macOS PowerPoint) — dark navy title slide + thumbnail rail. */
export const DeckApp: React.FC<{ f: number; menuOpenAt?: number; dialogAt?: number }> = ({ f, menuOpenAt, dialogAt }) => (
  <div style={{ position: "absolute", inset: 0, background: CD.windowChrome, display: "flex" }}>
    {/* thumbnail rail */}
    <div style={{ width: 150, background: "#eceae6", borderRight: `1px solid ${CD.lineSoft}`, padding: 12, display: "flex", flexDirection: "column", gap: 10 }}>
      {[0, 1, 2, 3].map((i) => (
        <div key={i} style={{ height: 74, borderRadius: 6, background: CD.deckBg, opacity: 0.9, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: "70%", height: 8, borderRadius: 3, background: CD.deckBar, opacity: 0.7 }} />
        </div>
      ))}
    </div>
    {/* slide */}
    <div style={{ flex: 1, padding: 26 }}>
      <div style={{ width: "100%", height: "100%", borderRadius: 8, background: CD.deckBg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 5, background: CD.deckBar }} />
        <span style={ui.deckTitle}>Northgate Digital Strategy</span>
        <span style={ui.deckSub}>Driving Traffic Growth &amp; Maximizing Revenue Conversion</span>
      </div>
    </div>
    {/* File menu dropdown */}
    {menuOpenAt !== undefined && f >= menuOpenAt && (
      <div style={{ position: "absolute", top: 0, left: 60, width: 260, background: CD.windowChrome, border: `1px solid ${CD.line}`, borderRadius: "0 0 8px 8px", padding: 6, boxShadow: "0 20px 50px rgba(0,0,0,0.22)", ...rise(f, menuOpenAt, 8, 5) }}>
        {["New Presentation", "New from Template", "Open", "Open Recent", "Close", "Save", "Save as Template…", "Export…", "Browse Version History", "Share", "Print…"].map((it) => (
          <div key={it} style={{ padding: "5px 12px", borderRadius: 5, background: it === "Export…" ? CD.macBlue : "transparent" }}>
            <span style={{ ...ui.menu, color: it === "Export…" ? CD.white : CD.ink }}>{it}</span>
          </div>
        ))}
      </div>
    )}
    {/* Export dialog */}
    {dialogAt !== undefined && f >= dialogAt && (
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", ...pop(f, dialogAt, 6) }}>
        <div style={{ width: 560, background: CD.windowChrome, borderRadius: 12, padding: 22, boxShadow: "0 30px 70px rgba(0,0,0,0.3)" }}>
          <Field label="Export As:" value="Northgate_Pitch_v3" input />
          <div style={{ height: 12 }} />
          <Field label="Where:" value="Desktop" />
          <Field label="File Format:" value="PDF" />
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 18 }}>
            <Btn label="Cancel" />
            <Btn label="Export" primary />
          </div>
        </div>
      </div>
    )}
  </div>
);

const Field: React.FC<{ label: string; value: string; input?: boolean }> = ({ label, value, input }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
    <span style={{ ...ui.fileRow, width: 96, textAlign: "right", color: CD.inkSoft }}>{label}</span>
    <div style={{ flex: 1, padding: "7px 12px", borderRadius: 7, background: input ? CD.white : "#e9e6e1", border: `1px solid ${CD.line}` }}>
      <span style={ui.fileRow}>{value}</span>
    </div>
  </div>
);
const Btn: React.FC<{ label: string; primary?: boolean }> = ({ label, primary }) => (
  <div style={{ padding: "8px 20px", borderRadius: 8, background: primary ? CD.macBlue : "#e6e3de", border: primary ? "none" : `1px solid ${CD.line}` }}>
    <span style={{ ...ui.fileRow, color: primary ? CD.white : CD.ink, fontWeight: 600 }}>{label}</span>
  </div>
);

/** macOS Finder — teal desktop + a save/browse window with the real file list. */
const FILES = [
  { name: "Northgate_Pitch_v3.pdf", date: "Today, 12:10 PM", kind: "PDF", sel: true },
  { name: "Northgate_Pitch_v3.pptx", date: "Today, 9:47 AM", kind: "Presentation" },
  { name: "Northgate_Pitch_v2.pptx", date: "Mar 12, 2026", kind: "Presentation" },
  { name: "brand-assets-final.zip", date: "Mar 16, 2026", kind: "ZIP Archive" },
  { name: "Screenshot 2026-03-18 at 4.31 PM", date: "Yesterday, 4:31 PM", kind: "PNG Image" },
  { name: "Q1-numbers.xlsx", date: "Mar 10, 2026", kind: "Spreadsheet" },
];
export const FinderApp: React.FC<{ f: number; at?: number; folder?: boolean }> = ({ f, at = 0, folder = false }) => (
  <div style={{ position: "absolute", inset: 0, background: CD.finderDesk }}>
    <div style={{ position: "absolute", top: 40, left: 180, right: 0, bottom: 0, background: CD.windowChrome, borderRadius: "12px 0 0 0", overflow: "hidden", ...rise(f, at, 20, 6) }}>
      {/* toolbar */}
      <div style={{ height: 44, background: CD.windowBar, display: "flex", alignItems: "center", gap: 14, padding: "0 16px", borderBottom: `1px solid ${CD.lineSoft}` }}>
        <Traffic />
        <span style={{ ...ui.fileRow, marginLeft: 8, fontWeight: 600 }}>Desktop</span>
      </div>
      <div style={{ display: "flex", height: "100%" }}>
        {/* sidebar */}
        <div style={{ width: 190, background: "#f6f4f1", padding: "14px 12px", display: "flex", flexDirection: "column", gap: 4 }}>
          {["Recents", "Desktop", "Documents", "Downloads", "iCloud Drive", "Macintosh HD"].map((s) => (
            <div key={s} style={{ padding: "5px 10px", borderRadius: 6, background: s === "Desktop" ? "rgba(47,116,230,0.14)" : "transparent" }}>
              <span style={{ ...ui.fileRow, color: s === "Desktop" ? CD.macBlue : "#3a3a3a" }}>{s}</span>
            </div>
          ))}
        </div>
        {/* list */}
        <div style={{ flex: 1, background: CD.white }}>
          <div style={{ display: "flex", padding: "8px 16px", borderBottom: `1px solid ${CD.lineSoft}` }}>
            <span style={{ ...ui.fileRow, flex: 2, color: CD.inkSoft }}>Name</span>
            <span style={{ ...ui.fileRow, flex: 1, color: CD.inkSoft }}>Date Modified</span>
            <span style={{ ...ui.fileRow, width: 110, color: CD.inkSoft }}>Kind</span>
          </div>
          {FILES.map((file, i) => {
            const showSel = file.sel && !folder;
            return (
              <div key={i} style={{ display: "flex", padding: "8px 16px", background: showSel ? CD.macBlue : "transparent" }}>
                <span style={{ ...ui.fileRow, flex: 2, color: showSel ? CD.white : "#2b2b2b" }}>{file.name}</span>
                <span style={{ ...ui.fileRow, flex: 1, color: showSel ? "rgba(255,255,255,0.85)" : CD.inkSoft }}>{file.date}</span>
                <span style={{ ...ui.fileRow, width: 110, color: showSel ? "rgba(255,255,255,0.85)" : CD.inkSoft }}>{file.kind}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  </div>
);

/** Calendar / agenda — week grid with event blocks and the 2PM invite. */
export const CalendarApp: React.FC<{ f: number; at?: number }> = ({ f, at = 0 }) => (
  <div style={{ position: "absolute", inset: 0, background: CD.white, ...rise(f, at, 12, 6) }}>
    <div style={{ height: 48, background: CD.windowBar, display: "flex", alignItems: "center", padding: "0 18px", gap: 14, borderBottom: `1px solid ${CD.lineSoft}` }}>
      <Traffic /><span style={{ ...ui.fileRow, fontWeight: 700, fontSize: 15, marginLeft: 8 }}>July 2026</span>
    </div>
    <div style={{ display: "flex", height: "calc(100% - 48px)" }}>
      {["Mon", "Tue", "Wed", "Thu", "Fri"].map((d, col) => (
        <div key={d} style={{ flex: 1, borderRight: `1px solid ${CD.lineSoft}`, position: "relative" }}>
          <div style={{ textAlign: "center", padding: "8px 0", borderBottom: `1px solid ${CD.lineSoft}` }}><span style={{ ...ui.fileRow, color: CD.inkSoft }}>{d}</span></div>
          {col === 2 && (
            <div style={{ position: "absolute", top: 180, left: 8, right: 8, height: 96, borderRadius: 8, background: "rgba(193,91,69,0.16)", border: `1px solid ${CD.accent}`, padding: 10 }}>
              <span style={{ ...ui.fileRow, color: CD.accentDeep, fontWeight: 700 }}>2:00 PM</span><br />
              <span style={{ ...ui.fileRow, color: CD.accentDeep }}>Client review · Northgate</span>
            </div>
          )}
          {col === 1 && <div style={{ position: "absolute", top: 90, left: 8, right: 8, height: 60, borderRadius: 8, background: "rgba(63,174,90,0.16)" }} />}
          {col === 3 && <div style={{ position: "absolute", top: 300, left: 8, right: 8, height: 70, borderRadius: 8, background: "rgba(63,174,90,0.12)" }} />}
        </div>
      ))}
    </div>
  </div>
);

/** Terminal / code task panel (inside the Claude browser). */
const LOG = [
  "$ npm run dev",
  "> cueform@1.0.0 dev",
  "> next dev --port 62026",
  "  > Next.js 14.2.0",
  "  - Local:  http://127.0.0.1:62026",
  "  [ok] Ready in 1.4s",
  "  [ok] Compiled /library in 380ms",
];
export const TerminalApp: React.FC<{ f: number; at?: number }> = ({ f, at = 0 }) => (
  <div style={{ position: "absolute", inset: 0, background: "#eef3ff" }}>
    <div style={{ position: "absolute", top: 34, left: 40, right: 40, bottom: 40, background: CD.termBg, borderRadius: 12, overflow: "hidden", ...rise(f, at, 16, 6) }}>
      <div style={{ height: 30, background: "#17171b", display: "flex", alignItems: "center", padding: "0 14px", gap: 10 }}>
        <Traffic /><span style={{ ...ui.mono, color: CD.termGreen, marginLeft: 8 }}>Claude Code</span>
      </div>
      <div style={{ padding: 18 }}>
        {LOG.map((l, i) => (
          <div key={i} style={{ ...ui.mono, color: l.includes("[ok]") ? CD.termGreen : "rgba(255,255,255,0.8)", ...rise(f, at + 4 + i * 2, 6, 4) }}>{l}</div>
        ))}
      </div>
    </div>
  </div>
);

/** Cueform "Library" — dark music-library page in a browser. */
export const LibraryApp: React.FC<{ f: number; at?: number }> = ({ f, at = 0 }) => (
  <div style={{ position: "absolute", inset: 0, background: CD.libBg, ...rise(f, at, 10, 6) }}>
    {/* browser bar */}
    <div style={{ height: 40, background: "#2b6fd6", display: "flex", alignItems: "center", padding: "0 14px", gap: 12 }}>
      <Traffic />
      <div style={{ flex: 1, maxWidth: 420, height: 24, borderRadius: 12, background: "rgba(255,255,255,0.9)", display: "flex", alignItems: "center", padding: "0 12px" }}>
        <span style={{ ...ui.mono, color: "#444" }}>http://127.0.0.1:62026/library</span>
      </div>
    </div>
    {/* page */}
    <div style={{ padding: 30 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 20 }}>
        <span style={ui.libTitle}>Library</span>
        <span style={ui.libMeta}>12 collections · 247 total tracks</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 22 }}>
        {["Thriller S2", "Brand Launch", "Cinematic", "Underscore"].map((c, i) => (
          <div key={c} style={{ borderRadius: 10, overflow: "hidden", background: CD.libCard }}>
            <div style={{ height: 90, background: ["#3a5a8a", "#8a5a6a", "#4a6a5a", "#6a5a8a"][i] }} />
            <div style={{ padding: 10 }}><span style={{ fontFamily: uiFamily, fontSize: 12, fontWeight: 600, color: CD.white }}>{c}</span></div>
          </div>
        ))}
      </div>
      {["Fractured Horizon — Full Mix", "Descent Into Chaos — Full Mix", "Silent Observatory — Underscore", "Vapor Lock — Alt Mix", "Iron Cathedral — Stems"].map((tr, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "9px 6px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ width: 8, height: 8, borderRadius: 2, background: CD.termGreen }} />
          <span style={{ fontFamily: uiFamily, fontSize: 13, color: "rgba(255,255,255,0.86)" }}>{tr}</span>
        </div>
      ))}
    </div>
  </div>
);

/** PixelForge — photo editor with the pottery photo, Layers, Batch Export. */
export const PixelForgeApp: React.FC<{ f: number; at?: number; gridAt?: number }> = ({ f, at = 0 }) => (
  <div style={{ position: "absolute", inset: 0, background: CD.pixelBg }}>
    <div style={{ height: 28, background: "#231f2b", display: "flex", alignItems: "center", padding: "0 14px", gap: 10 }}>
      <span style={{ ...ui.mono, color: CD.pixelGreen, fontWeight: 700 }}>PixelForge</span>
    </div>
    <div style={{ display: "flex", height: "calc(100% - 28px)" }}>
      {/* tools */}
      <div style={{ width: 44, background: "#1e1a26", display: "flex", flexDirection: "column", alignItems: "center", gap: 14, paddingTop: 14 }}>
        {[0, 1, 2, 3, 4, 5].map((i) => (<div key={i} style={{ width: 18, height: 18, borderRadius: 4, background: i === 1 ? CD.pixelGreen : "rgba(255,255,255,0.12)" }} />))}
      </div>
      {/* canvas */}
      <div style={{ flex: 1, background: "#141019", display: "flex", alignItems: "center", justifyContent: "center", ...rise(f, at, 10, 6) }}>
        <div style={{ width: 340, height: 300, borderRadius: 4, background: "linear-gradient(135deg,#6b5340,#c9a878 55%,#8a7250)", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", bottom: 60, left: "50%", transform: "translateX(-50%)", width: 150, height: 90, borderRadius: "50% 50% 46% 46%", background: "#d8c5a8", boxShadow: "inset 0 -14px 20px rgba(0,0,0,0.25)" }} />
        </div>
      </div>
      {/* layers panel */}
      <div style={{ width: 210, background: "#1e1a26", padding: 12, display: "flex", flexDirection: "column" }}>
        <span style={{ fontFamily: uiFamily, fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.5)", letterSpacing: 1, marginBottom: 8 }}>LAYERS</span>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6, overflow: "hidden" }}>
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 26, height: 20, borderRadius: 3, background: "#4a3f30" }} />
              <span style={{ fontFamily: uiFamily, fontSize: 11, color: "rgba(255,255,255,0.7)" }}>{String(i + 1).padStart(3, "0")}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 10, padding: "9px 0", borderRadius: 7, background: CD.pixelGreen, textAlign: "center" }}>
          <span style={{ fontFamily: uiFamily, fontSize: 12, fontWeight: 700, color: CD.white }}>Batch Export</span>
        </div>
      </div>
    </div>
  </div>
);

// =============================================================================
// The squiggle — hand-drawn rust connector, stroke-dashoffset draw
// =============================================================================
export const Squiggle: React.FC<{ f: number; at: number; dur?: number }> = ({ f, at, dur = 14 }) => {
  const p = interpolate(f, [at, at + dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.easeOutQuart });
  const LEN = 260;
  // left-curl → dip → right double-loop
  const d = "M6 40 C 30 10, 58 12, 60 34 C 62 52, 40 56, 44 38 C 48 22, 78 24, 96 40 C 112 54, 138 52, 150 34 C 158 22, 176 24, 178 40 C 180 54, 162 58, 164 42";
  return (
    <svg width="200" height="70" viewBox="0 0 200 70" fill="none" style={{ overflow: "visible" }}>
      <path d={d} stroke={CD.accent} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={LEN} strokeDashoffset={LEN * (1 - p)} />
    </svg>
  );
};

// =============================================================================
// Claude end-card logo — sunburst bloom + wordmark write-on
// =============================================================================
export const ClaudeLogo: React.FC<{ f: number; at: number }> = ({ f, at }) => {
  const bloom = interpolate(f, [at, at + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.easeOutQuart });
  const spin = interpolate(f, [at, at + 10], [-30, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.easeOutExpo });
  const word = interpolate(f, [at + 7, at + 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.easeOutQuart });
  const rays = Array.from({ length: 12 });
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
      <svg width="150" height="150" viewBox="0 0 100 100" style={{ transform: `scale(${bloom}) rotate(${spin}deg)`, overflow: "visible" }}>
        {rays.map((_, i) => {
          const a = (i / 12) * Math.PI * 2;
          return <rect key={i} x={48} y={20} width={4} height={26} rx={2} fill={CD.logoMark} transform={`rotate(${(i / 12) * 360} 50 50)`} />;
        })}
      </svg>
      <span style={{ ...ui.logo, opacity: word, clipPath: `inset(0 ${(1 - word) * 100}% 0 0)` }}>Claude</span>
    </div>
  );
};

/** Pairing panel shown under the title (phone + laptop illustration + buttons). */
export const PairPanel: React.FC<{ f: number; at: number }> = ({ f, at }) => (
  <div style={{ position: "absolute", left: "50%", bottom: 90, transform: "translateX(-50%)", width: 420, background: CD.paper, borderRadius: 28, border: `1px solid ${CD.line}`, padding: 26, boxShadow: "0 30px 60px rgba(60,45,30,0.14)", ...rise(f, at, 40, 9) }}>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14, marginBottom: 22 }}>
      <div style={{ width: 40, height: 60, borderRadius: 8, border: `2px solid ${CD.inkSoft}` }} />
      <Squiggle f={f} at={at + 4} dur={8} />
      <div style={{ width: 70, height: 48, borderRadius: 6, border: `2px solid ${CD.inkSoft}` }} />
    </div>
    <div style={{ padding: "12px 0", borderRadius: 12, background: "#eceae4", textAlign: "center", marginBottom: 10 }}>
      <span style={{ fontFamily: uiFamily, fontSize: 15, fontWeight: 600, color: CD.ink }}>Get desktop app link</span>
    </div>
    <div style={{ padding: "12px 0", borderRadius: 12, background: CD.ink, textAlign: "center" }}>
      <span style={{ fontFamily: uiFamily, fontSize: 15, fontWeight: 600, color: CD.paper }}>Pair with your desktop</span>
    </div>
  </div>
);
