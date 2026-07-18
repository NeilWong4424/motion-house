import React from "react";
import { MYBOLA } from "../design";
import { t } from "./tokens";
import { ChatBubble } from "./ChatBubble";
import { GlassShell } from "./ChatOmnibar";

// =============================================================================
// InboxThread — MyBola's own Inbox thread, 1:1 with inbox_thread_pane.dart
// =============================================================================
// The admin-side view of a WhatsApp conversation. Header: contact name (text.title)
// over the channel row (green WhatsApp glyph 11px + "WhatsApp" text.meta), a reset
// button, "Auto-balas" (text.meta) + a CupertinoSwitch (0.8 scale, active track =
// color.primary). Body = shared ChatThread bubbles. Bottom = glass reply omnibar
// with the "Taip balasan…" placeholder. This is the "flip Auto-balas / reply as
// Anda" screen.

// The iOS CupertinoSwitch: on -> primary track + knob right; off -> grey + left.
// `p` (0..1) drives the animation so the film can tween it mid-scene.
const AutoBalasSwitch: React.FC<{ p: number }> = ({ p }) => {
  const trackOff = "#39393D";
  // Blend primary -> grey as p goes 1 -> 0. Simple channel lerp.
  const lerp = (a: number, b: number) => Math.round(a + (b - a) * (1 - p));
  const track = `rgb(${lerp(0x00, 0x39)},${lerp(0x91, 0x39)},${lerp(0xff, 0x3d)})`;
  void trackOff;
  return (
    <div style={{ width: 41, height: 25, borderRadius: 13, background: track, position: "relative", transition: "none", transform: "scale(0.8)" }}>
      <div style={{ position: "absolute", top: 2, left: 2 + p * 16, width: 21, height: 21, borderRadius: 11, background: "#fff" }} />
    </div>
  );
};

const WaGlyph = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill={MYBOLA.waGreen}>
    <path d="M12 2a10 10 0 00-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1012 2zm0 2a8 8 0 11-4.2 14.8l-.3-.2-2.8.8.8-2.7-.2-.3A8 8 0 0112 4zm4.4 9.9c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.5.1l-.7.9c-.1.2-.3.2-.5.1a6.5 6.5 0 01-3.2-2.8c-.1-.2 0-.4.1-.5l.4-.5c.1-.1.1-.3 0-.4l-.7-1.7c-.2-.4-.4-.4-.5-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 1.9s.8 2.2.9 2.4c.1.2 1.6 2.5 4 3.4 1.5.6 2 .6 2.7.5.4 0 1.4-.6 1.6-1.1.2-.5.2-1 .1-1.1l-.2-.2z" />
  </svg>
);

const ResetGlyph = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={MYBOLA.tertiary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 3v5h5M3.5 12a8.5 8.5 0 105-7.7L3 8" />
  </svg>
);

export type InboxMsg = { isMine: boolean; text: string; sender: string; time: string };

export const InboxThread: React.FC<{
  contact: string;
  messages: InboxMsg[];
  /** Auto-balas switch position 0..1 (1 = ON/primary). */
  autoBalas: number;
  reply?: string;
}> = ({ contact, messages, autoBalas, reply = "" }) => (
  <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", background: MYBOLA.black }}>
    {/* Header. */}
    <div style={{ paddingTop: 44 }}>
      <div style={{ display: "flex", alignItems: "center", padding: 10, borderBottom: `1px solid ${MYBOLA.border}` }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ ...t.title, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{contact}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
            <WaGlyph />
            <span style={t.meta}>WhatsApp</span>
          </div>
        </div>
        <div style={{ width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center" }}><ResetGlyph /></div>
        <span style={{ ...t.meta, marginRight: 4 }}>Auto-balas</span>
        <AutoBalasSwitch p={autoBalas} />
      </div>
    </div>

    {/* Thread. */}
    <div style={{ flex: 1, padding: 10, display: "flex", flexDirection: "column", justifyContent: "flex-end", gap: 10, overflow: "hidden" }}>
      {messages.map((m, i) => (
        <ChatBubble key={i} isMine={m.isMine} text={m.text} sender={m.sender} time={m.time} maxWidth={280} />
      ))}
    </div>

    {/* Reply omnibar. */}
    <div style={{ padding: 10, paddingBottom: 16 }}>
      <GlassShell>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ ...(reply ? t.body : t.hint), flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {reply || "Taip balasan…"}
          </span>
          <div style={{ width: 32, height: 32, borderRadius: 24, background: reply ? MYBOLA.primary : MYBOLA.secondary, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={reply ? MYBOLA.white : MYBOLA.tertiary} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </div>
        </div>
      </GlassShell>
    </div>
  </div>
);
