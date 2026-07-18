import React from "react";
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame } from "remotion";
import { defineVideo, PORTRAIT } from "../../../shared/engine/types";
import { useDesignFonts } from "../../../shared/design/fonts";
import { EASE } from "../../../shared/motion/easing";
import { Rise, TextReveal, useEnter } from "../../../shared/motion/reveal";
import { DipTo } from "../../../shared/motion/transitions";
import { Resolve } from "../../../shared/motion/logo";
import { mybola, MYBOLA } from "../design";
import { displayFamily, t, ct, rm } from "../ui/tokens";
import { PhoneFrame } from "../ui/PhoneFrame";
import { ChatBubble } from "../ui/ChatBubble";
import { ChatOmnibar } from "../ui/ChatOmnibar";
import { WhatsAppChat, type WaMsg } from "../ui/WhatsAppChat";
import { InboxThread, type InboxMsg } from "../ui/InboxThread";
import { PdfRoster } from "../ui/PdfRoster";
import { InputTypes } from "../ui/InputTypes";
import { Languages } from "../ui/Languages";
import { SessionCard } from "../ui/SessionCard";
import { Attendance, type Trainee } from "../ui/Attendance";
import { Dashboard } from "../ui/Dashboard";

// =============================================================================
// MyBola launch film — scene table (frames @ 30fps)
// =============================================================================
// Portrait 9:16. Bahasa Melayu, on-screen text + music. Every app screen is a
// 1:1 recreation from the real Flutter source (see ../NOTES.md). One held framing
// per beat, calm easing, holds after landings. The phone is mounted once inside
// each phone-scene at a fixed size (never scales itself).

const S = {
  cold: { from: 0, dur: 120 }, //  0–4s   cold open
  chat: { from: 120, dur: 270 }, //  4–13s  owner ↔ Pengurus Akademi
  input: { from: 390, dur: 150 }, // 13–18s  the 5 input kinds
  roster: { from: 540, dur: 180 }, // 18–24s import PDF roster (bulk register)
  wa: { from: 720, dur: 450 }, // 24–39s  WhatsApp core + Auto-balas -> Anda
  lang: { from: 1170, dur: 150 }, // 39–44s balas dalam bahasa pelanggan
  sesi: { from: 1320, dur: 150 }, // 44–49s sessions & attendance
  dash: { from: 1470, dur: 120 }, // 49–53s dashboard payoff
  end: { from: 1590, dur: 150 }, // 53–58s end card + CTA
} as const;

const TOTAL = S.end.from + S.end.dur; // 1740 frames = 58s

// A tenth-of-a-second cadence of processing dots for the omnibar.
const dotsFor = (localFrame: number): string => ".".repeat((Math.floor(localFrame / 8) % 4));

// Centre a phone on the black stage, scaled to nearly fill the portrait frame
// (the reference films frame the phone large). The camera settles in slightly on
// entrance — the prop itself never animates its own scale.
const PHONE_FILL = 1.4; // 1248px phone -> ~1746px tall in a 1920 frame
const Stage: React.FC<{ children: React.ReactNode; enterAt?: number }> = ({ children, enterAt = 0 }) => {
  const s = useEnter(enterAt, "weighty");
  const scale = PHONE_FILL * interpolate(s, [0, 1], [0.985, 1]);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ transform: `scale(${scale})`, opacity: interpolate(s, [0, 1], [0, 1]) }}>{children}</div>
    </AbsoluteFill>
  );
};

// -----------------------------------------------------------------------------
// Scene 1 — cold open
// -----------------------------------------------------------------------------
const ColdOpen: React.FC = () => (
  <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: "0 90px" }}>
    <TextReveal
      text={"Uruskan akademi anda —\ndari poket anda."}
      by="line"
      delay={6}
      step={6}
      distance={30}
      preset="weighty"
      style={{ fontFamily: displayFamily, fontSize: 84, color: MYBOLA.white, lineHeight: 0.98, textAlign: "center", letterSpacing: 0.5 }}
    />
  </AbsoluteFill>
);

// -----------------------------------------------------------------------------
// Scene 2 — owner ↔ Pengurus Akademi (admin AI)
// -----------------------------------------------------------------------------
const ChatScene: React.FC = () => {
  const f = useCurrentFrame();
  // Timeline within the scene: type q1 -> processing -> reply -> q2 -> bill update.
  const typed1 = f < 40 ? "siapa belum bayar?" : "";
  const processing = f >= 40 && f < 78;
  const q1Sent = f >= 40;
  const reply1 = f >= 90;
  const q2 = f >= 165;
  const reply2 = f >= 205;

  const bubbles: React.ReactNode[] = [];
  if (q1Sent) bubbles.push(<Rise key="q1" delay={0} distance={16}><ChatBubble isMine text="siapa belum bayar?" sender="Anda" time="9:12 AM" /></Rise>);
  if (reply1)
    bubbles.push(
      <Rise key="r1" delay={0} distance={16}>
        <ChatBubble isMine={false} sender="Pengurus Akademi" time="9:12 AM" text={`3 ahli belum bayar, jumlah ${rm(320)}:\n• Ahmad Faizal — ${rm(150)}\n• Nur Aisyah — ${rm(120)}\n• Danish Haiqal — ${rm(50)}\nMahu saya hantar peringatan?`} />
      </Rise>,
    );
  if (q2) bubbles.push(<Rise key="q2" delay={0} distance={16}><ChatBubble isMine text="kemaskini bil Ahmad, tandakan dibayar" sender="Anda" time="9:13 AM" /></Rise>);
  if (reply2)
    bubbles.push(
      <Rise key="r2" delay={0} distance={16}>
        <ChatBubble isMine={false} sender="Pengurus Akademi" time="9:13 AM" text={`Siap. Bil Ahmad Faizal (${rm(150)}) kini "Dibayar". Mahu saya hantar resit kepada beliau?`} />
      </Rise>,
    );

  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", background: MYBOLA.black, paddingTop: 44 }}>
      {/* transcript */}
      <div style={{ flex: 1, padding: 12, display: "flex", flexDirection: "column", justifyContent: "flex-end", gap: 10, overflow: "hidden" }}>{bubbles}</div>
      {/* omnibar */}
      <div style={{ padding: 12, paddingBottom: 16 }}>
        <ChatOmnibar value={typed1} processing={processing} dots={dotsFor(f)} />
      </div>
    </div>
  );
};

// -----------------------------------------------------------------------------
// Scene 4 — import roster from a PDF (bulk register)
// -----------------------------------------------------------------------------
const RosterScene: React.FC = () => {
  const f = useCurrentFrame();
  const confirm = f >= 70;
  const done = f >= 120;
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", background: MYBOLA.black, paddingTop: 44 }}>
      <div style={{ flex: 1, padding: 12, display: "flex", flexDirection: "column", justifyContent: "flex-end", gap: 10, overflow: "hidden" }}>
        <Rise delay={0} distance={16}>
          <ChatBubble isMine sender="Anda" time="9:20 AM" text="" bare>
            <PdfRoster />
          </ChatBubble>
        </Rise>
        {confirm && (
          <Rise delay={0} distance={16}>
            <ChatBubble isMine={false} sender="Pengurus Akademi" time="9:20 AM" text={done ? "Selesai — 6 pelatih didaftarkan dari senarai. Mahu saya jadualkan sesi pertama mereka?" : "Saya baca 6 pelatih dari senarai ini. Daftar kesemuanya sekarang?"} />
          </Rise>
        )}
      </div>
      <div style={{ padding: 12, paddingBottom: 16 }}>
        <ChatOmnibar value={confirm && !done ? "ya, daftar semua" : ""} />
      </div>
    </div>
  );
};

// -----------------------------------------------------------------------------
// Scene 5 — WhatsApp core, then Auto-balas -> Anda
// -----------------------------------------------------------------------------
const WA_ALL: WaMsg[] = [
  { out: true, text: "Assalamualaikum, ada kelas bola untuk umur 11?", time: "2:01 PM" },
  { out: false, text: "Waalaikumsalam! Ada — sesi seterusnya Sabtu, 9:00 pagi di Padang Melawati. Mahu saya daftarkan anak?", time: "2:01 PM" },
  { out: true, text: "Boleh, nama Danish, 11 tahun.", time: "2:02 PM" },
  { out: false, text: `Sudah didaftarkan. Yuran bulanan ialah ${rm(150)}. Boleh bayar melalui pautan ini:\nmybola-admin.com/payment/8f2a1`, time: "2:02 PM" },
  { out: false, time: "2:05 PM", doc: { name: "resit-INV-1043.pdf", caption: "Terima kasih! Pembayaran RM150.00 anda telah diterima." } },
];

const WaScene: React.FC = () => {
  const f = useCurrentFrame();
  // Reveal WhatsApp messages one at a time (customer view).
  const shown = Math.min(WA_ALL.length, Math.max(0, Math.floor((f - 10) / 42) + 1));
  const toInbox = f >= 300; // cut to the MyBola side for the Auto-balas flip

  if (!toInbox) {
    return <WhatsAppChat name="Akademi Bola Juara" messages={WA_ALL.slice(0, shown)} />;
  }

  // MyBola inbox side: same convo, Auto-balas switch flips off, owner replies "Anda".
  const local = f - 300;
  const flip = interpolate(local, [30, 55], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.easeInOutQuint });
  const typing = local >= 70 && local < 110;
  const sent = local >= 110;
  const msgs: InboxMsg[] = [
    { isMine: false, text: "Terima kasih! Jumpa hari Sabtu ya.", sender: "Pelanggan", time: "2:06 PM" },
  ];
  if (sent) msgs.push({ isMine: true, text: "Sama-sama! Datang 10 minit awal untuk daftar kehadiran. Kami tunggu Danish, InsyaAllah.", sender: "Anda", time: "2:07 PM" });
  return <InboxThread contact="Danish (ibu)" messages={msgs} autoBalas={flip} reply={typing ? "Sama-sama! Datang 10 minit awal…" : ""} />;
};

// -----------------------------------------------------------------------------
// Scene 7 — sessions & attendance
// -----------------------------------------------------------------------------
const SESSION_TRAINEES: Trainee[] = [
  { name: "Ahmad Faizal", age: 12, present: true },
  { name: "Nur Aisyah", age: 11, present: true },
  { name: "Danish Haiqal", age: 11, present: true },
  { name: "Lim Wei Jie", age: 12, present: true },
  { name: "Raj Kumar", age: 11, present: false },
];

const SesiScene: React.FC = () => {
  const f = useCurrentFrame();
  const toAttendance = f >= 54;
  if (!toAttendance) {
    return (
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: MYBOLA.black }}>
        <Rise delay={4} distance={20}>
          <SessionCard day="21" weekday="ISNIN" month="JUL" time="8:00pm" name="Latihan Skuad Bawah-12" location="Padang Melawati" ageGroup="Bawah 12" attendance="12/15" price={rm(50)} />
        </Rise>
      </div>
    );
  }
  // Attendance: reveal green checks progressively.
  const local = f - 54;
  const checkedCount = Math.min(4, Math.max(0, Math.floor(local / 10)));
  const trainees = SESSION_TRAINEES.map((tr, i) => ({ ...tr, present: tr.present && i < checkedCount }));
  const present = trainees.filter((x) => x.present).length;
  return <Attendance title="Latihan Skuad Bawah-12" time="8:00pm" dateLine="Isnin, 21 Julai 2025" present={present} max={15} trainees={trainees} />;
};

// -----------------------------------------------------------------------------
// Scene 8 — dashboard payoff (CountUp on values)
// -----------------------------------------------------------------------------
const DashScene: React.FC = () => {
  const f = useCurrentFrame();
  const p = interpolate(f, [10, 70], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.easeOutExpo });
  // "Jumlah Tertunggak" falls 320 -> 170 as bills get paid; sales climbs.
  const owed = Math.round(interpolate(p, [0, 1], [320, 170]));
  const sales = Math.round(interpolate(p, [0, 1], [0, 4820]));
  const metrics = [
    { label: "Jumlah Tertunggak", value: rm(owed) },
    { label: "Ahli Aktif", value: "48 ahli" },
    { label: "Bil Tertunggak", value: `${Math.round(interpolate(p, [0, 1], [6, 3]))} bil` },
    { label: "Sales Minggu Ini", value: rm(sales) },
  ];
  const ranked = {
    subtitle: "Top 10 Ahli Tertunggak",
    headline: rm(owed),
    rows: [
      { label: "Nur Aisyah", value: rm(120), frac: interpolate(p, [0, 1], [1, 0.9]) },
      { label: "Danish H.", value: rm(50), frac: 0.42 },
      { label: "Raj Kumar", value: rm(0), frac: interpolate(p, [0, 1], [0.55, 0]) },
    ],
  };
  return (
    <Rise delay={0} distance={0}>
      <Dashboard metrics={metrics} ranked={ranked} />
    </Rise>
  );
};

// -----------------------------------------------------------------------------
// Scene 9 — end card + CTA
// -----------------------------------------------------------------------------
const EndCard: React.FC = () => (
  <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
    <Resolve
      accentAt={38}
      accent={
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 22 }}>
          <div style={{ padding: "12px 26px", borderRadius: 9999, background: MYBOLA.primary }}>
            <span style={{ ...t.title, color: MYBOLA.white, fontWeight: 700 }}>Mohon Akses Awal</span>
          </div>
          <span style={{ ...t.meta }}>Kini dalam ujian tertutup · mybola-admin.com</span>
        </div>
      }
      gap={26}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
        <span style={{ fontFamily: displayFamily, fontSize: 76, color: MYBOLA.white, letterSpacing: 1 }}>MyBola</span>
        <span style={{ ...t.body, color: MYBOLA.tertiary, letterSpacing: 0.5 }}>Akademi Anda, Cara Anda.</span>
      </div>
    </Resolve>
  </AbsoluteFill>
);

// -----------------------------------------------------------------------------
// Film
// -----------------------------------------------------------------------------
const Vignette: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none", background: `radial-gradient(120% 100% at 50% 45%, transparent 55%, rgba(0,0,0,${mybola.grain?.vignette ?? 0}) 100%)` }} />
);

const LaunchFilm: React.FC = () => {
  useDesignFonts(mybola);
  return (
    <AbsoluteFill style={{ background: MYBOLA.black }}>
      <Sequence from={S.cold.from} durationInFrames={S.cold.dur}><ColdOpen /></Sequence>

      <Sequence from={S.chat.from} durationInFrames={S.chat.dur}>
        <Stage><PhoneFrame time="9:12"><ChatScene /></PhoneFrame></Stage>
      </Sequence>

      <Sequence from={S.input.from} durationInFrames={S.input.dur}>
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 60 }}>
          <TextReveal text="Hantar apa sahaja." by="word" delay={2} step={2}
            style={{ fontFamily: displayFamily, fontSize: 56, color: MYBOLA.white, letterSpacing: 0.5, justifyContent: "center" }} />
          <InputTypes startDelay={12} />
        </AbsoluteFill>
      </Sequence>

      <Sequence from={S.roster.from} durationInFrames={S.roster.dur}>
        <Stage><PhoneFrame time="9:20"><RosterScene /></PhoneFrame></Stage>
      </Sequence>

      {/* Chapter break into the WhatsApp core. */}
      <Sequence from={S.wa.from} durationInFrames={S.wa.dur}>
        <Stage><PhoneFrame time="2:06"><WaScene /></PhoneFrame></Stage>
        <DipTo colour={MYBOLA.black} at={4} d={7} />
      </Sequence>

      <Sequence from={S.lang.from} durationInFrames={S.lang.dur}>
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 54 }}>
          <TextReveal text="Balas dalam bahasa pelanggan." by="word" delay={2} step={2}
            style={{ fontFamily: displayFamily, fontSize: 46, color: MYBOLA.white, letterSpacing: 0.5, justifyContent: "center", textAlign: "center" }} />
          <Languages startDelay={16} />
        </AbsoluteFill>
      </Sequence>

      <Sequence from={S.sesi.from} durationInFrames={S.sesi.dur}>
        <Stage><PhoneFrame time="8:00"><SesiScene /></PhoneFrame></Stage>
      </Sequence>

      <Sequence from={S.dash.from} durationInFrames={S.dash.dur}>
        <Stage><PhoneFrame time="9:30"><DashScene /></PhoneFrame></Stage>
      </Sequence>

      <Sequence from={S.end.from} durationInFrames={S.end.dur}><EndCard /></Sequence>

      <Vignette />
    </AbsoluteFill>
  );
};

// Unused re-export guard so ct stays referenced if a later edit drops its use.
void ct;

// =============================================================================
// VideoDef
// =============================================================================
export const launch = defineVideo({
  id: "MyBolaLaunch",
  component: LaunchFilm,
  durationInFrames: TOTAL,
  ...PORTRAIT,
  audio: {
    style: "Warm, confident product-launch bed — felt piano + soft analog synth pad, gentle and hopeful, instrumental. Claude-launch calm, never busy.",
    instrumentation: "Felt/soft piano, warm analog pad, light sub-bass, sparse mallet accents, tasteful airy texture. No drums until the payoff, then a soft kick + brushed pulse only.",
    tempoKey: "72 BPM, A major",
    hook: "A simple, memorable 4-note rising piano motif that returns at the payoff and resolves on the end card.",
    beats: [
      { frame: S.cold.from, role: "intro", label: "Cold open", sound: "One held felt-piano chord, air, space. The promise stated." },
      { frame: S.chat.from, role: "build", label: "Admin AI", sound: "Motif enters on piano, pad swells softly under it." },
      { frame: S.input.from, role: "build", label: "Inputs" },
      { frame: S.roster.from, role: "build", label: "PDF roster", sound: "Add a light mallet accent as rows register." },
      { frame: S.wa.from, role: "riser", label: "WhatsApp core", sound: "Gentle rise; warmth grows as the customer is helped end-to-end." },
      { frame: S.dash.from, role: "payoff", label: "Dashboard payoff", sound: "The motif returns full, a soft kick + brushed pulse arrive, hopeful lift." },
      { frame: S.end.from, role: "outro", label: "End card", sound: "Resolve the motif on a warm major chord; let it ring out." },
    ],
    roleText: {
      build: "add one voice at a time, keep it sparse and unhurried",
      riser: "swell warmth and register, no percussion yet",
      sustain: "hold the warmth, let the picture breathe",
    },
    dynamics: "A quiet bed with generous headroom — never near clipping. The payoff is a gentle lift, not a drop.",
    stingerFrame: S.end.from + 8,
    exclude: "vocals, lyrics, hard EDM drops, aggressive drums, lo-fi hiss, fade-out ending",
    sfxNotes: "Soft UI tap on each chat send; a subtle switch-click when Auto-balas flips off; a light chime when the receipt PDF arrives. All low, on-frame.",
  },
});
