import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { defineVideo, PORTRAIT } from "../../../shared/engine/types";
import { useDesignFonts } from "../../../shared/design/fonts";
import { EASE } from "../../../shared/motion/easing";
import { mybolaV2, MB } from "../design";
import { displayFamily, rm } from "../tokens";
import { Stage, DeviceLayer, useBeat, type Beat } from "../ui/world";
import {
  PhoneDevice, LaptopDevice, AdminChatScreen, WhatsAppScreen, DashboardDesktop,
  type ChatMsg, type WaMsg,
} from "../ui/surfaces";

// =============================================================================
// MyBola v2 — staged multi-device launch film (reference-composition model)
// =============================================================================
// Structure mirrors the reference film: a rhythm of COMPOSED beats that hard-cut
// between "conversation" (phone full-frame) and "watch the work" (phone anchor +
// one desktop, composed with depth and soft shadows, bleeding off-frame). No
// fly-across canvas, no zoom-out reveal. Ends on a composed two-device hero, then
// the logo. Inside each device, content moves with the app's own transitions.
//
//   Beat 1  phone full        admin chat — "siapa belum bayar?" → dues → reminders
//   Beat 2  phone + laptop    the answer on the dashboard (metrics count, bars grow)
//   Beat 3  phone full        WhatsApp — customer helped, Auto-balas → "Anda"
//   Beat 4  phone + laptop    composed hero (both devices, held)
//   End     logo card
// Portrait 9:16.

const TOTAL = 1540; // ~51s
const END_AT = 1360;

type MBeat = Beat & { kind: "chat" | "desk" | "wa" | "hero" };
const BEATS: MBeat[] = [
  { at: 0, kind: "chat" },
  { at: 440, kind: "desk" },
  { at: 820, kind: "wa" },
  { at: 1120, kind: "hero" },
];

const dots = (f: number) => ".".repeat(Math.floor(f / 8) % 4);
const QUESTION = "siapa belum bayar?";

// Admin chat transcript (frames when each message arrives; all within beat 1).
const CHAT: ChatMsg[] = [
  { isMine: true, sender: "Anda", time: "9:12 AM", text: QUESTION, at: 84 },
  { isMine: false, sender: "Pengurus Akademi", time: "9:12 AM", text: `3 ahli belum bayar, jumlah ${rm(320)}:\n• Ahmad Faizal — ${rm(150)}\n• Nur Aisyah — ${rm(120)}\n• Danish Haiqal — ${rm(50)}\nMahu saya hantar peringatan?`, at: 150 },
  { isMine: true, sender: "Anda", time: "9:13 AM", text: "ya, hantar peringatan kepada mereka", at: 300 },
  { isMine: false, sender: "Pengurus Akademi", time: "9:13 AM", text: "Peringatan dihantar kepada 3 ahli melalui notifikasi. Direkodkan dalam dashboard.", at: 372 },
];

// WhatsApp transcript (within beat 3).
const WA: WaMsg[] = [
  { out: true, text: "Assalamualaikum, ada kelas bola untuk umur 11?", time: "2:01 PM", at: 848 },
  { out: false, text: "Waalaikumsalam! Ada — sesi seterusnya Sabtu, 9:00 pagi di Padang Melawati. Mahu saya daftarkan anak?", time: "2:01 PM", at: 900 },
  { out: true, text: "Boleh, nama Danish, 11 tahun.", time: "2:02 PM", at: 956 },
  { out: false, text: `Sudah didaftarkan. Yuran bulanan ${rm(150)}. Boleh bayar melalui pautan ini.`, time: "2:02 PM", at: 1008 },
];

const BARS = [
  { label: "Nur Aisyah", value: rm(120), frac: 1.0 },
  { label: "Ahmad Faizal", value: rm(150), frac: 0.86 },
  { label: "Danish Haiqal", value: rm(50), frac: 0.42 },
];

// -----------------------------------------------------------------------------
// The staged composition — renders the current beat's devices.
// -----------------------------------------------------------------------------
const Composition: React.FC = () => {
  const f = useCurrentFrame();
  const { beat, index } = useBeat(BEATS);
  const nextAt = BEATS[index + 1]?.at ?? END_AT;
  const hold = nextAt - beat.at;

  // Admin-chat omnibar state (types Q1, then Q2).
  const q1typing = f >= 10 && f < 78;
  const q2typing = f >= 230 && f < 294;
  const typed = (full: string, a: number, b: number) => full.slice(0, Math.max(0, Math.round(interpolate(f, [a, b], [0, full.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }))));
  const omni = {
    value: q1typing ? typed(QUESTION, 10, 78) : q2typing ? typed("ya, hantar peringatan kepada mereka", 230, 294) : "",
    processing: (f >= 78 && f < 104) || (f >= 294 && f < 320),
    dots: dots(f),
  };

  // Dashboard (loads on the desk beat cut; counts + grows).
  const owed = 320;
  const sales = Math.round(interpolate(f, [470, 600], [0, 4820], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.easeOutExpo }));
  const barGrow = interpolate(f, [490, 610], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.easeOutExpo });

  // WhatsApp Auto-balas flip → owner takes over.
  const autoBalas = interpolate(f, [1060, 1090], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.easeOutQuart });

  const adminPhone = (
    <PhoneDevice time="9:12"><AdminChatScreen f={f} msgs={CHAT} omni={omni} /></PhoneDevice>
  );
  const dashboard = (
    <LaptopDevice><DashboardDesktop f={f} loadAt={452} owed={owed} sales={sales} bars={BARS} barGrow={barGrow} /></LaptopDevice>
  );

  if (beat.kind === "chat") {
    // Conversation — phone full-frame.
    return <DeviceLayer x={102} y={46} scale={1.36} z={1} shadow bornAt={beat.at} holdFor={hold}>{adminPhone}</DeviceLayer>;
  }
  if (beat.kind === "desk") {
    // Watch the work — laptop dashboard behind, phone inset foreground lower-left.
    return (
      <>
        <DeviceLayer x={-41} y={360} scale={0.83} z={1} shadow bornAt={beat.at} holdFor={hold}>{dashboard}</DeviceLayer>
        <DeviceLayer x={70} y={1006} scale={0.6} z={2} shadow bornAt={beat.at} holdFor={hold}>{adminPhone}</DeviceLayer>
      </>
    );
  }
  if (beat.kind === "wa") {
    // Conversation — the customer side, phone full-frame.
    return (
      <DeviceLayer x={102} y={46} scale={1.36} z={1} shadow bornAt={beat.at} holdFor={hold}>
        <PhoneDevice time="2:06"><WhatsAppScreen f={f} msgs={WA} autoBalas={autoBalas} ownerReplyAt={1096} /></PhoneDevice>
      </DeviceLayer>
    );
  }
  // hero — composed two-device beauty shot: phone left foreground, laptop right.
  return (
    <>
      <DeviceLayer x={560} y={420} scale={0.92} z={1} shadow bornAt={beat.at} holdFor={hold}>{dashboard}</DeviceLayer>
      <DeviceLayer x={40} y={380} scale={0.86} z={2} shadow bornAt={beat.at} holdFor={hold}>{adminPhone}</DeviceLayer>
    </>
  );
};

// -----------------------------------------------------------------------------
// End card — resolves after the hero beat.
// -----------------------------------------------------------------------------
const EndCard: React.FC = () => {
  const f = useCurrentFrame();
  if (f < END_AT) return null;
  const o = interpolate(f, [END_AT, END_AT + 76], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.easeOutQuart });
  const rise = interpolate(f, [END_AT, END_AT + 80], [18, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.easeOutExpo });
  const ctaO = interpolate(f, [END_AT + 62, END_AT + 122], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: `rgba(0,0,0,${o})`, alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 22 }}>
      <div style={{ opacity: o, transform: `translateY(${rise}px)`, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
        <span style={{ fontFamily: displayFamily, fontSize: 96, color: MB.white, letterSpacing: 1 }}>MyBola</span>
        <span style={{ fontFamily: "Inter, sans-serif", fontSize: 24, color: MB.tertiary, letterSpacing: 0.5 }}>Akademi Anda, Cara Anda.</span>
      </div>
      <div style={{ opacity: ctaO, display: "flex", flexDirection: "column", alignItems: "center", gap: 16, marginTop: 8 }}>
        <div style={{ padding: "14px 30px", borderRadius: 9999, background: MB.primary }}>
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: 24, fontWeight: 700, color: MB.white }}>Mohon Akses Awal</span>
        </div>
        <span style={{ fontFamily: "Inter, sans-serif", fontSize: 17, color: MB.tertiary }}>Kini dalam ujian tertutup · mybola-admin.com</span>
      </div>
    </AbsoluteFill>
  );
};

const LaunchFilm: React.FC = () => {
  useDesignFonts(mybolaV2);
  return (
    <AbsoluteFill style={{ background: MB.black }}>
      <Stage>
        <Composition />
      </Stage>
      <EndCard />
    </AbsoluteFill>
  );
};

// =============================================================================
// VideoDef
// =============================================================================
export const launch = defineVideo({
  id: "MyBolaV2Launch",
  component: LaunchFilm,
  durationInFrames: TOTAL,
  ...PORTRAIT,
  audio: {
    style: "Warm, confident product-launch bed — felt piano + soft analog synth pad, gentle and hopeful, instrumental. Unhurried, never busy.",
    instrumentation: "Felt/soft piano, warm analog pad, light sub-bass, sparse mallet accents. No drums until the payoff, then a soft kick + brushed pulse only.",
    tempoKey: "72 BPM, A major",
    hook: "A simple 4-note rising piano motif that returns on the customer resolution and settles on the end card.",
    beats: [
      { frame: 0, role: "intro", label: "Admin chat", sound: "A held piano note; a soft mallet on the first keystroke." },
      { frame: 150, role: "build", label: "Dues reply", sound: "Motif enters as the reply slides in; pad swells." },
      { frame: 440, role: "build", label: "Dashboard beat", sound: "A soft chord seats on the cut to the dashboard; a light run as values count." },
      { frame: 820, role: "riser", label: "WhatsApp", sound: "Warmth grows; a subtle switch-click when Auto-balas flips off." },
      { frame: 1096, role: "payoff", label: "Owner takes over", sound: "Motif returns full — soft kick + brushed pulse — as the owner replies and the customer is helped end-to-end." },
      { frame: END_AT, role: "outro", label: "End card", sound: "Resolve the motif on a warm major chord; let it ring out." },
    ],
    roleText: { build: "add one voice at a time, sparse and unhurried", riser: "swell warmth and register, no percussion yet" },
    dynamics: "A quiet bed with generous headroom — never near clipping. The payoff is a gentle lift.",
    stingerFrame: END_AT + 8,
    exclude: "vocals, lyrics, hard EDM drops, aggressive drums, lo-fi hiss, fade-out ending",
    sfxNotes: "Soft UI tap on each send; a switch-click when Auto-balas flips. Optional soft cut-swell on each beat change. All low, on-frame.",
  },
});
