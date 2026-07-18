import React from "react";
import { MYBOLA } from "../design";
import { ct } from "./tokens";

// =============================================================================
// SessionCard — 1:1 with portal/user/akademi/card/session_card.dart
// =============================================================================
// Width 180, techCardShell (secondary fill, clipped corners, accent mesh + accent
// bar at bottom, padding 16). Content: [displayHero day number + weekday label in
// accent w900] with a time badge (CardStatusBadge, accent@20%, radius 25) top-
// right; then the session name (cardText.titleSm); then a left-border strip (3px
// accent, black@20% fill) of detail rows (location / age / attendance / price).
// A faint tilted month watermark sits behind.

const badge = (label: string, icon: React.ReactNode) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 8px", borderRadius: 25, background: "rgba(0,145,255,0.2)" }}>
    {icon}
    <span style={{ ...ct.label, color: MYBOLA.primary, letterSpacing: 1, fontSize: 11 }}>{label}</span>
  </div>
);

const Clock = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill={MYBOLA.primary}><circle cx="12" cy="12" r="10" opacity="0.25" /><circle cx="12" cy="12" r="10" fill="none" stroke={MYBOLA.primary} strokeWidth="2" /><path d="M12 7v5l3 2" stroke="#fff" strokeWidth="2" strokeLinecap="round" fill="none" /></svg>
);

const detailIcon = (kind: "loc" | "age" | "att" | "price") => {
  const c = MYBOLA.primary;
  const map = {
    loc: <path d="M12 2a7 7 0 00-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 00-7-7zm0 9.5A2.5 2.5 0 1112 6a2.5 2.5 0 010 5.5z" />,
    age: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0116 0" /></>,
    att: <><circle cx="9" cy="8" r="3.2" /><circle cx="16" cy="9" r="2.6" /><path d="M3 20a6 6 0 0112 0M14 20a5 5 0 018 0" /></>,
    price: <path d="M20 12l-8 8-9-9V3h8l9 9zM7.5 7.5h.01" />,
  };
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill={kind === "loc" || kind === "price" ? c : "none"} stroke={c} strokeWidth={kind === "loc" || kind === "price" ? 0 : 2} strokeLinecap="round" strokeLinejoin="round">
      {map[kind]}
    </svg>
  );
};

const DetailRow: React.FC<{ kind: "loc" | "age" | "att" | "price"; label: string }> = ({ kind, label }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "3px 0" }}>
    {detailIcon(kind)}
    <span style={{ ...ct.label, color: MYBOLA.white, letterSpacing: 0.2, textTransform: "none", fontSize: 12 }}>{label}</span>
  </div>
);

export const SessionCard: React.FC<{
  day: string; // "21"
  weekday: string; // "ISNIN"
  month: string; // "JUL" watermark
  time: string; // "8:00pm"
  name: string;
  location: string;
  ageGroup?: string;
  attendance?: string; // "12/15"
  price?: string; // "RM50.00"
  width?: number;
}> = ({ day, weekday, month, time, name, location, ageGroup, attendance, price, width = 240 }) => (
  <div style={{ width, position: "relative", background: MYBOLA.secondary, borderRadius: 4, overflow: "hidden", border: `1px solid rgba(0,145,255,0.35)` }}>
    {/* accent mesh tint. */}
    <div style={{ position: "absolute", inset: 0, background: "radial-gradient(120% 90% at 90% 0%, rgba(0,145,255,0.10), transparent 60%)" }} />
    {/* tilted month watermark. */}
    <div style={{ position: "absolute", top: 46, left: 0, right: 0, textAlign: "center", transform: "rotate(-5.7deg)", pointerEvents: "none" }}>
      <span style={{ fontFamily: ct.title.fontFamily, fontSize: 88, fontWeight: 800, color: "rgba(255,255,255,0.04)", letterSpacing: -2 }}>{month}</span>
    </div>

    <div style={{ position: "relative", padding: 16, display: "flex", flexDirection: "column", minHeight: 220 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={ct.displayHero}>{day}</div>
          <div style={{ ...ct.label, color: MYBOLA.primary, fontWeight: 900, letterSpacing: 2 }}>{weekday}</div>
        </div>
        {badge(time, <Clock />)}
      </div>

      <div style={{ flex: 1 }} />

      <div style={{ ...ct.titleSm, marginBottom: 8 }}>{name}</div>

      <div style={{ padding: "6px 8px", background: "rgba(0,0,0,0.2)", borderLeft: `3px solid ${MYBOLA.primary}` }}>
        <DetailRow kind="loc" label={location} />
        {ageGroup && <DetailRow kind="age" label={ageGroup} />}
        {attendance && <DetailRow kind="att" label={attendance} />}
        {price && <DetailRow kind="price" label={price} />}
      </div>
    </div>
    {/* accent bar at bottom. */}
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 2, height: 3, background: MYBOLA.primary }} />
  </div>
);
