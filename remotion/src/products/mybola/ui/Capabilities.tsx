import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { MYBOLA } from "../design";
import { displayFamily, t } from "./tokens";
import { useEnter } from "../../../shared/motion/reveal";
import { EASE } from "../../../shared/motion/easing";

// =============================================================================
// Capabilities — scene 3 "everything Pengurus Akademi can do"
// =============================================================================
// The AI's full capability surface, drawn from the real toolset in
// mybola_chat_agent/agent.py. Built in FOUR interchangeable form variants so the
// client can pick: grid, montage, orbit, list. Same copy + same capability set
// across all four — only the presentation differs.

const HEADLINE = "Satu pembantu.\nSeluruh akademi.";

// Every capability group + a real slash command from the agent's command list.
type Cap = { label: string; cmd: string; icon: React.FC };

const I = (d: React.ReactNode, fill = false): React.FC => () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill={fill ? MYBOLA.primary : "none"} stroke={MYBOLA.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{d}</svg>
);

export const CAPS: Cap[] = [
  { label: "Ahli", cmd: "/addmember", icon: I(<><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0116 0" /></>) },
  { label: "Bil", cmd: "/addbill", icon: I(<><path d="M6 2h9l3 3v17l-3-2-3 2-3-2-3 2z" /><path d="M9 8h6M9 12h6" /></>) },
  { label: "Sesi", cmd: "/addsession", icon: I(<><rect x="3" y="4" width="18" height="17" rx="2" /><path d="M3 9h18M8 2v4M16 2v4" /></>) },
  { label: "Kehadiran", cmd: "/attendance", icon: I(<><path d="M20 6L9 17l-5-5" /></>) },
  { label: "Kedai", cmd: "/addproduct", icon: I(<><path d="M3 3h2l2 13h11l2-8H6" /><circle cx="9" cy="20" r="1.4" fill={MYBOLA.primary} stroke="none" /><circle cx="17" cy="20" r="1.4" fill={MYBOLA.primary} stroke="none" /></>) },
  { label: "Notis", cmd: "/addnotice", icon: I(<><path d="M4 11a8 8 0 0116 0v5l2 3H2l2-3z" /><path d="M10 22a2 2 0 004 0" /></>) },
  { label: "Peringatan", cmd: "/notify", icon: I(<><path d="M2 12l20-9-9 20-2-9z" /></>) },
  { label: "Undo", cmd: "/undo", icon: I(<><path d="M3 7v6h6" /><path d="M3.5 13a9 9 0 105-8L3 7" /></>) },
  { label: "Pentadbir", cmd: "/inviteadmin", icon: I(<><circle cx="9" cy="8" r="3.4" /><path d="M3 20a6 6 0 0112 0" /><path d="M18 8v6M15 11h6" /></>) },
];

// Shared headline block.
const Headline: React.FC<{ delay?: number; size?: number }> = ({ delay = 0, size = 52 }) => {
  const p = useEnter(delay, "weighty");
  return (
    <div style={{ opacity: p, transform: `translateY(${interpolate(p, [0, 1], [22, 0])}px)`, textAlign: "center" }}>
      {HEADLINE.split("\n").map((line, i) => (
        <div key={i} style={{ fontFamily: displayFamily, fontSize: size, color: i === 1 ? MYBOLA.primary : MYBOLA.white, lineHeight: 1.02, letterSpacing: 0.5 }}>{line}</div>
      ))}
    </div>
  );
};

const CapTile: React.FC<{ cap: Cap; delay: number }> = ({ cap, delay }) => {
  const p = useEnter(delay, "settle");
  const Icon = cap.icon;
  return (
    <div style={{ opacity: p, transform: `translateY(${interpolate(p, [0, 1], [20, 0])}px)`, background: MYBOLA.secondary, border: `1px solid ${MYBOLA.border}`, borderRadius: 18, padding: "18px 12px", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
      <Icon />
      <span style={{ ...t.label, color: MYBOLA.white }}>{cap.label}</span>
      <span style={{ fontFamily: "monospace", fontSize: 12, color: MYBOLA.tertiary }}>{cap.cmd}</span>
    </div>
  );
};

// -----------------------------------------------------------------------------
// v-grid — command-palette grid, 3 columns, staggered in
// -----------------------------------------------------------------------------
export const CapsGrid: React.FC = () => (
  <AbsoluteFill style={{ background: MYBOLA.black, alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 46, padding: "0 60px" }}>
    <Headline delay={0} />
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, width: "100%", maxWidth: 620 }}>
      {CAPS.map((c, i) => (
        <CapTile key={c.label} cap={c} delay={12 + i * 4} />
      ))}
    </div>
  </AbsoluteFill>
);

// -----------------------------------------------------------------------------
// v-montage — rapid slash commands firing one after another
// -----------------------------------------------------------------------------
export const CapsMontage: React.FC = () => {
  const f = useCurrentFrame();
  const per = 12;
  const shown = Math.min(CAPS.length, Math.floor(f / per) + 1);
  return (
    <AbsoluteFill style={{ background: MYBOLA.black, alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 40, padding: "0 60px" }}>
      <Headline delay={0} size={46} />
      <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%", maxWidth: 560 }}>
        {CAPS.slice(0, shown).map((c, i) => {
          const local = f - i * per;
          const op = interpolate(local, [0, 5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const isLast = i === shown - 1;
          return (
            <div key={c.label} style={{ opacity: isLast ? op : 1, display: "flex", alignItems: "center", gap: 14, background: isLast ? "rgba(0,145,255,0.12)" : MYBOLA.secondary, border: `1px solid ${isLast ? MYBOLA.primary : MYBOLA.border}`, borderRadius: 12, padding: "12px 16px" }}>
              <span style={{ fontFamily: "monospace", fontSize: 17, color: MYBOLA.primary, minWidth: 130 }}>{c.cmd}</span>
              <span style={{ ...t.label, color: MYBOLA.white }}>{c.label}</span>
              <span style={{ marginLeft: "auto", ...t.meta, color: MYBOLA.success }}>siap</span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// -----------------------------------------------------------------------------
// v-orbit — MyBola mark centre, capability nodes orbiting
// -----------------------------------------------------------------------------
export const CapsOrbit: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: f, fps, config: { damping: 16, stiffness: 90 } });
  const R = 250;
  const rot = f * 0.15; // slow rotation in degrees
  return (
    <AbsoluteFill style={{ background: MYBOLA.black, alignItems: "center", justifyContent: "center" }}>
      <div style={{ position: "absolute", top: 150, left: 0, right: 0, textAlign: "center" }}>
        <Headline delay={0} size={44} />
      </div>
      <div style={{ position: "relative", width: R * 2 + 120, height: R * 2 + 120, display: "flex", alignItems: "center", justifyContent: "center", opacity: enter }}>
        {/* orbit ring */}
        <div style={{ position: "absolute", width: R * 2, height: R * 2, borderRadius: "50%", border: `1px solid ${MYBOLA.border}` }} />
        {/* centre mark */}
        <div style={{ width: 128, height: 128, borderRadius: 30, background: MYBOLA.secondary, border: `1px solid ${MYBOLA.primary}`, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2 }}>
          <span style={{ fontFamily: displayFamily, fontSize: 26, color: MYBOLA.white }}>MyBola</span>
        </div>
        {/* nodes */}
        {CAPS.map((c, i) => {
          const ang = ((i / CAPS.length) * 360 + rot) * (Math.PI / 180);
          const x = Math.cos(ang) * R * enter;
          const y = Math.sin(ang) * R * enter;
          const Icon = c.icon;
          return (
            <div key={c.label} style={{ position: "absolute", transform: `translate(${x}px, ${y}px)`, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <div style={{ width: 62, height: 62, borderRadius: 16, background: MYBOLA.secondary, border: `1px solid ${MYBOLA.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon />
              </div>
              <span style={{ ...t.meta, color: MYBOLA.white }}>{c.label}</span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// -----------------------------------------------------------------------------
// v-list — calm typographic spec-sheet list
// -----------------------------------------------------------------------------
// Each row is its own component so its entrance hook stays top-level (no hooks
// inside a .map callback).
const CapRow: React.FC<{ cap: Cap; delay: number }> = ({ cap, delay }) => {
  const p = useEnter(delay, "settle");
  return (
    <div style={{ opacity: p, transform: `translateX(${interpolate(p, [0, 1], [-16, 0])}px)`, display: "flex", alignItems: "baseline", gap: 20, padding: "14px 0", borderBottom: `1px solid ${MYBOLA.border}` }}>
      <span style={{ ...t.title, color: MYBOLA.white, width: 190 }}>{cap.label}</span>
      <span style={{ fontFamily: "monospace", fontSize: 17, color: MYBOLA.primary }}>{cap.cmd}</span>
    </div>
  );
};

export const CapsList: React.FC = () => (
  <AbsoluteFill style={{ background: MYBOLA.black, justifyContent: "center", padding: "0 90px", gap: 40 }}>
    <Headline delay={0} size={50} />
    <div style={{ display: "flex", flexDirection: "column" }}>
      {CAPS.map((c, i) => (
        <CapRow key={c.label} cap={c} delay={10 + i * 4} />
      ))}
    </div>
  </AbsoluteFill>
);

void EASE;
