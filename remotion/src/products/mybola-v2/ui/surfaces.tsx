import React from "react";
import { interpolate } from "remotion";
import { EASE } from "../../../shared/motion/easing";
import { MB } from "../design";
import { t, ct, rm } from "../tokens";

// =============================================================================
// Surfaces — real MyBola screens as devices, with the app's OWN transitions
// =============================================================================
// Code-exact to the real Flutter source (tokens + copy). Crucially, the in-screen
// transitions replicate how the real app animates — same curves and durations,
// read from the source, so the screens move the way the product actually moves:
//
//   AnimatedSwitcher content swap  — 300ms, switchIn Curves.easeOutQuart, Slide+Fade
//                                    (portal/shell/home_screen.dart:373)
//   AnimatedOpacity screen fades   — 600ms, easeIn   (portal/chat/chat_content.dart:169)
//   House curve                    — 600ms, Curves.fastEaseInToSlowEaseOut
//                                    (sidebar / business_rail / page_dismiss_bar / button)
//   Chart animation                — 400ms, easeOut  (portal/charts/line_chart.dart:124)
//
// The camera moves BETWEEN devices (continuous); inside a device, content changes
// using these exact app transitions — not arbitrary reveals.

type CSS = React.CSSProperties;

// -----------------------------------------------------------------------------
// App transition primitives (durations in frames @30fps)
// -----------------------------------------------------------------------------
export const A_FAST = 9; //  300ms — AnimatedSwitcher content swap
export const A_SLOW = 18; // 600ms — house curve (fastEaseInToSlowEaseOut) / AnimatedOpacity
export const A_CHART = 12; // 400ms — line/bar chart

/** AnimatedSwitcher switchIn: fade + small slide, Curves.easeOutQuart, 300ms. */
export const swIn = (f: number, at: number, slide = 20, axis: "y" | "x" = "y", dur = A_FAST): CSS => {
  const p = interpolate(f, [at, at + dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.easeOutQuart });
  const off = (1 - p) * slide;
  return { opacity: p, transform: axis === "y" ? `translateY(${off}px)` : `translateX(${off}px)` };
};

/** AnimatedOpacity fade-in, easeIn (un-dim), default 600ms. */
export const fadeIn = (f: number, at: number, dur = A_SLOW): number =>
  interpolate(f, [at, at + dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.easeOutQuart });

/** Chart grow/count, easeOut, 400ms by default. */
export const chartP = (f: number, at: number, dur = A_CHART): number =>
  interpolate(f, [at, at + dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.easeOutExpo });

// -----------------------------------------------------------------------------
// Devices
// -----------------------------------------------------------------------------

/** Portrait phone. Screen is a fixed logical size; content fills it. */
export const PHONE_W = 600;
export const PHONE_H = 1300;
export const PhoneDevice: React.FC<{ children: React.ReactNode; time?: string }> = ({ children, time = "9:41" }) => (
  <div style={{ width: PHONE_W + 44, height: PHONE_H + 44, borderRadius: 84, background: "#0A0A0A", border: `1px solid ${MB.border}`, padding: 22, boxSizing: "border-box" }}>
    <div style={{ position: "relative", width: PHONE_W, height: PHONE_H, borderRadius: 62, overflow: "hidden", background: MB.black }}>
      {children}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 46, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 28px", zIndex: 50, pointerEvents: "none" }}>
        <span style={{ ...t.meta, color: MB.white, fontWeight: 600 }}>{time}</span>
        <span style={{ ...t.meta, color: MB.white, fontWeight: 600, letterSpacing: 1 }}>MyBola</span>
      </div>
      <div style={{ position: "absolute", top: 12, left: "50%", transform: "translateX(-50%)", width: 98, height: 28, borderRadius: 14, background: "#000", zIndex: 51 }} />
    </div>
  </div>
);

/** Landscape laptop: screen + a thin base to read as a laptop. */
export const LAP_SW = 1280; // screen
export const LAP_SH = 800;
export const LaptopDevice: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ width: LAP_SW + 120, display: "flex", flexDirection: "column", alignItems: "center" }}>
    {/* lid: screen inside a dark bezel */}
    <div style={{ width: LAP_SW + 28, height: LAP_SH + 28, borderRadius: 22, background: "#0A0A0A", border: `1px solid ${MB.border}`, padding: 14, boxSizing: "border-box" }}>
      <div style={{ position: "relative", width: LAP_SW, height: LAP_SH, borderRadius: 10, overflow: "hidden", background: MB.black }}>{children}</div>
    </div>
    {/* hinge + base */}
    <div style={{ width: LAP_SW + 120, height: 22, borderRadius: "0 0 16px 16px", background: "#0E0E0F", border: `1px solid ${MB.border}`, borderTop: "none", position: "relative" }}>
      <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 160, height: 8, borderRadius: "0 0 8px 8px", background: "#000" }} />
    </div>
  </div>
);

// -----------------------------------------------------------------------------
// Glyphs (SVG — QC-safe)
// -----------------------------------------------------------------------------
const g = MB.tertiary;
const Attach = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={g} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5l-8.5 8.5a5 5 0 01-7-7l8.5-8.5a3.3 3.3 0 014.7 4.7l-8.5 8.5a1.7 1.7 0 01-2.4-2.4l7.8-7.8" /></svg>);
const Mic = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={g} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5 11a7 7 0 0014 0M12 18v3" /></svg>);
const Slash = () => (<div style={{ width: 15, height: 15, borderRadius: 3, border: `1.8px solid ${MB.tertiary}`, display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ fontFamily: "monospace", fontWeight: 900, fontSize: 8, color: MB.tertiary, lineHeight: 1 }}>/</span></div>);
const ArrowRight = ({ c }: { c: string }) => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>);
const Check = ({ c = MB.success }: { c?: string }) => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7" /></svg>);

// -----------------------------------------------------------------------------
// Omnibar (chat_omnibar) + ChatBubble (message_bubble)
// -----------------------------------------------------------------------------
const Act: React.FC<{ children: React.ReactNode; fill?: string }> = ({ children, fill }) => (
  <div style={{ width: 34, height: 34, borderRadius: 24, background: fill ?? "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{children}</div>
);

export const Omnibar: React.FC<{ value?: string; processing?: boolean; dots?: string }> = ({ value = "", processing = false, dots = "" }) => {
  const hasText = value.length > 0;
  const fieldText = processing ? `Pengurus sedang memproses permintaan anda${dots}` : hasText ? value : "Semua urusan bermula di sini...";
  const fieldStyle: CSS = processing || !hasText ? t.hint : t.body;
  return (
    <div style={{ background: "rgba(28,28,30,0.55)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", border: `1px solid ${MB.border}`, borderRadius: 16, padding: 10 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <Act><Attach /></Act><Act><Mic /></Act><Act><Slash /></Act>
        <div style={{ flex: 1, minWidth: 0 }}>
          <span style={{ ...fieldStyle, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", display: "block" }}>{fieldText}</span>
        </div>
        <Act fill={hasText && !processing ? MB.primary : MB.secondary}><ArrowRight c={hasText && !processing ? MB.white : MB.tertiary} /></Act>
      </div>
    </div>
  );
};

export const ChatBubble: React.FC<{ isMine: boolean; sender: string; time: string; text: string; maxWidth?: number }> = ({ isMine, sender, time, text, maxWidth = 440 }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: isMine ? "flex-end" : "flex-start" }}>
    <div style={{ maxWidth, padding: 12, background: isMine ? MB.secondary : "rgba(0,145,255,0.2)", borderRadius: `12px 12px ${isMine ? 4 : 12}px ${isMine ? 12 : 4}px` }}>
      <span style={{ ...t.body, whiteSpace: "pre-wrap" }}>{text}</span>
    </div>
    <div style={{ height: 4 }} />
    <span style={t.meta}>{`${sender} · ${time}`}</span>
  </div>
);

// -----------------------------------------------------------------------------
// AdminChatScreen — the Pengurus Akademi phone. Messages arrive with the app's
// AnimatedSwitcher transition (slide+fade, easeOutQuart, 300ms).
// -----------------------------------------------------------------------------
export type ChatMsg = { isMine: boolean; sender: string; time: string; text: string; at: number };
export const AdminChatScreen: React.FC<{ f: number; msgs: ChatMsg[]; omni: { value: string; processing: boolean; dots: string } }> = ({ f, msgs, omni }) => (
  <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", background: MB.black, paddingTop: 46 }}>
    <div style={{ flex: 1, padding: 16, display: "flex", flexDirection: "column", justifyContent: "flex-end", gap: 12, overflow: "hidden" }}>
      {msgs.filter((m) => f >= m.at).map((m, i) => (
        <div key={i} style={swIn(f, m.at)}>
          <ChatBubble isMine={m.isMine} sender={m.sender} time={m.time} text={m.text} />
        </div>
      ))}
    </div>
    <div style={{ padding: 16, paddingBottom: 22 }}>
      <Omnibar value={omni.value} processing={omni.processing} dots={omni.dots} />
    </div>
  </div>
);

// -----------------------------------------------------------------------------
// WhatsAppScreen — the customer phone (real WhatsApp colours). Messages arrive
// with the same AnimatedSwitcher slide+fade; Auto-balas is an AnimatedContainer.
// -----------------------------------------------------------------------------
export type WaMsg = { out: boolean; text: string; time: string; at: number };
export const WhatsAppScreen: React.FC<{ f: number; msgs: WaMsg[]; autoBalas: number; ownerReplyAt: number }> = ({ f, msgs, autoBalas, ownerReplyAt }) => (
  <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", background: MB.waBg, paddingTop: 46 }}>
    {/* header */}
    <div style={{ background: MB.waHeader, padding: "12px 18px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 40, height: 40, borderRadius: 20, background: MB.waGreen, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Inter", fontWeight: 700, color: "#04310f" }}>A</div>
        <div>
          <div style={{ ...t.label, color: MB.white }}>Akademi Bola Juara</div>
          <div style={{ ...t.meta, color: "rgba(255,255,255,0.5)" }}>dalam talian</div>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ ...t.meta, color: "rgba(255,255,255,0.6)" }}>Auto-balas</span>
        {/* AnimatedContainer house curve on the thumb position */}
        <div style={{ width: 44, height: 26, borderRadius: 13, background: `rgba(48,209,88,${0.9 * autoBalas + 0.12})`, position: "relative" }}>
          <div style={{ position: "absolute", top: 3, left: 3 + 18 * autoBalas, width: 20, height: 20, borderRadius: 10, background: MB.white }} />
        </div>
      </div>
    </div>
    {/* messages */}
    <div style={{ flex: 1, padding: 16, display: "flex", flexDirection: "column", gap: 10, justifyContent: "flex-end" }}>
      {msgs.filter((m) => f >= m.at).map((m, i) => (
        <div key={i} style={{ display: "flex", justifyContent: m.out ? "flex-start" : "flex-end", ...swIn(f, m.at) }}>
          <div style={{ maxWidth: 420, padding: "9px 12px", borderRadius: 10, background: m.out ? MB.waIncoming : MB.waOutgoing }}>
            <span style={{ ...t.body, fontSize: 16 }}>{m.text}</span>
            <span style={{ ...t.meta, color: "rgba(255,255,255,0.5)", marginLeft: 8 }}>{m.time}</span>
          </div>
        </div>
      ))}
      {f >= ownerReplyAt && (
        <div style={{ display: "flex", justifyContent: "flex-end", ...swIn(f, ownerReplyAt) }}>
          <div style={{ maxWidth: 420, padding: "9px 12px", borderRadius: 10, background: MB.waOutgoing, border: `1px solid ${MB.waGreen}` }}>
            <span style={{ ...t.body, fontSize: 16 }}>Sama-sama! Datang 10 minit awal untuk daftar. Kami tunggu Danish.</span>
            <span style={{ ...t.meta, color: "rgba(255,255,255,0.5)", marginLeft: 8 }}>Anda · 2:07 PM</span>
          </div>
        </div>
      )}
    </div>
  </div>
);

// -----------------------------------------------------------------------------
// DashboardDesktop — the landscape admin portal (rail | sidebar | charts).
// Content loads with the app's AnimatedSwitcher slide+fade; values count (400ms
// easeOut), ranked bars grow (house curve).
// -----------------------------------------------------------------------------
const PAGES = ["Ringkasan", "Ahli", "Bil", "Sesi", "Inbox"];
type RankRow = { label: string; value: string; frac: number };

const MetricCard: React.FC<{ label: string; value: string; good?: boolean }> = ({ label, value, good }) => (
  <div style={{ flex: 1, background: MB.secondary, borderRadius: 12, padding: 18 }}>
    <div style={t.meta}>{label}</div>
    <div style={{ ...ct.display, marginTop: 8, color: good ? MB.success : MB.white, fontVariantNumeric: "tabular-nums" }}>{value}</div>
  </div>
);

export const DashboardDesktop: React.FC<{ f: number; loadAt: number; owed: number; sales: number; bars: RankRow[]; barGrow: number }> = ({ f, loadAt, owed, sales, bars, barGrow }) => {
  const enter = swIn(f, loadAt, 24);
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", background: MB.black }}>
      {/* academy rail */}
      <div style={{ width: 62, background: MB.black, borderRight: `1px solid ${MB.border}`, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 18, gap: 14 }}>
        <div style={{ width: 38, height: 38, borderRadius: 12, background: MB.primary, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Inter", fontWeight: 800, color: "#fff" }}>A</div>
        {[0, 1].map((i) => (<div key={i} style={{ width: 38, height: 38, borderRadius: 12, background: MB.secondary }} />))}
      </div>
      {/* sidebar */}
      <div style={{ width: 236, background: MB.black, borderRight: `1px solid ${MB.border}`, padding: 14 }}>
        <div style={{ ...t.label, color: MB.white, padding: "6px 8px 14px" }}>Akademi Bola Juara</div>
        {PAGES.map((p, i) => (
          <div key={p} style={{ padding: "10px 12px", borderRadius: 10, marginBottom: 4, background: i === 0 ? "rgba(0,145,255,0.16)" : "transparent" }}>
            <span style={{ ...t.label, color: i === 0 ? MB.primary : MB.tertiary }}>{p}</span>
          </div>
        ))}
      </div>
      {/* content */}
      <div style={{ flex: 1, padding: 24, ...enter }}>
        <div style={{ ...t.heading, fontSize: 22 }}>Ringkasan</div>
        <div style={{ ...t.meta, marginBottom: 16 }}>Isnin, 21 Julai 2025</div>
        <div style={{ display: "flex", gap: 14, marginBottom: 16 }}>
          <MetricCard label="Jumlah Tertunggak" value={rm(owed)} />
          <MetricCard label="Ahli Aktif" value="48 ahli" />
          <MetricCard label="Sales Minggu Ini" value={rm(sales)} good />
        </div>
        <div style={{ display: "flex", gap: 14 }}>
          {/* ranked bars */}
          <div style={{ flex: 1.3, background: MB.secondary, borderRadius: 12, padding: 18 }}>
            <div style={t.meta}>Top 10 Ahli Tertunggak</div>
            <div style={{ ...t.heading, marginTop: 2, marginBottom: 14 }}>{rm(owed)}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {bars.map((r) => (
                <div key={r.label} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ ...t.title, width: 130, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.label}</span>
                  <div style={{ flex: 1, height: 8, borderRadius: 4, background: MB.black, overflow: "hidden" }}>
                    <div style={{ width: `${Math.round(Math.max(0, Math.min(1, r.frac)) * 100 * barGrow)}%`, height: "100%", borderRadius: 4, background: MB.warning }} />
                  </div>
                  <span style={{ ...t.title, fontVariantNumeric: "tabular-nums", minWidth: 88, textAlign: "right" }}>{r.value}</span>
                </div>
              ))}
            </div>
          </div>
          {/* upcoming session card */}
          <div style={{ flex: 1, background: MB.secondary, borderRadius: 12, padding: 18, position: "relative", overflow: "hidden" }}>
            <div style={t.meta}>Sesi Akan Datang</div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 10, marginTop: 10 }}>
              <span style={{ ...ct.displayHero, fontWeight: 300 }}>21</span>
              <div style={{ ...ct.label, color: MB.primary, fontWeight: 900, letterSpacing: 2, paddingBottom: 8 }}>ISNIN</div>
            </div>
            <div style={{ ...ct.titleSm, marginTop: 8 }}>Latihan Skuad Bawah-12</div>
            <div style={{ borderLeft: `3px solid ${MB.primary}`, background: "rgba(0,0,0,0.25)", borderRadius: 6, padding: "8px 12px", marginTop: 12 }}>
              <div style={{ ...t.meta, color: "rgba(255,255,255,0.6)" }}>Padang Melawati · 8:00pm</div>
              <div style={{ ...t.meta, color: "rgba(255,255,255,0.6)", marginTop: 4 }}>12/15 hadir · {rm(50)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/** Small clamp helper reused by the film. */
export const ramp = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
