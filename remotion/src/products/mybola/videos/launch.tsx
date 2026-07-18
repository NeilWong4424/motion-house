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
import { HookBubble } from "../ui/HookOptions";
import { CapsOrbit } from "../ui/Capabilities";
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

// v2 scene table. The Pengurus Akademi chapter (hook + capability montage +
// summary + inputs) is now the front half; WhatsApp onward shift later.
const S = {
  hook: { from: 0, dur: 150 }, //   0–5s   phone bursts to life -> headline
  chat: { from: 150, dur: 570 }, //  5–24s  Pengurus Akademi full capability montage
  caps: { from: 720, dur: 180 }, // 24–30s  capability summary (variant slotted in)
  input: { from: 900, dur: 150 }, // 30–35s the 5 input kinds
  wa: { from: 1050, dur: 450 }, // 35–50s  WhatsApp core + Auto-balas -> Anda
  lang: { from: 1500, dur: 150 }, // 50–55s balas dalam bahasa pelanggan
  sesi: { from: 1650, dur: 150 }, // 55–60s sessions & attendance
  dash: { from: 1800, dur: 120 }, // 60–64s dashboard payoff
  end: { from: 1920, dur: 150 }, // 64–69s end card + CTA
} as const;

const TOTAL = S.end.from + S.end.dur; // 2070 frames = 69s

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
// Scene 1 — hook (built in ui/Hook.tsx)
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Scene 2 — Pengurus Akademi: full capability montage
// -----------------------------------------------------------------------------
// A scripted transcript that plays through the AI's real capabilities. Each STEP
// is one exchange: the owner types a line (shown in the omnibar), it sends,
// "Pengurus sedang memproses…", then the AI reply lands. Some steps attach a media
// bubble (a snapped receipt, a dropped PDF roster). The transcript sticks to the
// bottom and scrolls up as it fills — like the real chat. Every action maps to a
// real tool in mybola_chat_agent/agent.py; copy is rule-faithful, RM 2-dp.

type Step = {
  q: string; // owner's typed line
  a: string; // Pengurus Akademi reply
  time: string;
  media?: "receipt" | "roster"; // optional bubble attached to the owner's message
};

const STEPS: Step[] = [
  {
    q: "siapa belum bayar?",
    a: `3 ahli belum bayar, jumlah ${rm(320)}:\n• Ahmad Faizal — ${rm(150)}\n• Nur Aisyah — ${rm(120)}\n• Danish Haiqal — ${rm(50)}\nMahu saya hantar peringatan?`,
    time: "9:12 AM",
  },
  {
    q: "ya, hantar peringatan kepada mereka",
    a: `Peringatan dihantar kepada 3 ahli melalui notifikasi. Mahu saya keluarkan yuran bulan ini juga?`,
    time: "9:12 AM",
  },
  {
    q: "keluarkan yuran bulan ni untuk skuad bawah-12",
    a: `Sedia untuk keluarkan yuran ${rm(150)} kepada 15 ahli Skuad Bawah-12 — jumlah ${rm(2250)}. Sahkan?`,
    time: "9:13 AM",
  },
  {
    q: "snap resit ni, isikan bil",
    a: `Saya baca resit — Kedai Sukan Maju, ${rm(240)} untuk 12 bola. Direkod sebagai perbelanjaan. Tak perlu taip apa-apa.`,
    time: "9:15 AM",
    media: "receipt",
  },
  {
    q: "jadualkan latihan Sabtu 9 pagi di Padang Melawati",
    a: `Sesi dicipta: Latihan Skuad Bawah-12, Sabtu 9:00 pagi, Padang Melawati. Mahu saya jemput ahli?`,
    time: "9:16 AM",
  },
  {
    q: "daftar semua pelatih dalam senarai ni",
    a: `Saya baca 6 pelatih dari PDF ini. Semua telah didaftarkan sebagai ahli baru. Mahu saya jadualkan sesi pertama mereka?`,
    time: "9:18 AM",
    media: "roster",
  },
];

// A snapped-receipt tile (owner sends a photo of a paper receipt).
const ReceiptPhoto: React.FC = () => (
  <div style={{ width: 190, borderRadius: 10, overflow: "hidden", background: MYBOLA.paperWarm }}>
    <div style={{ padding: "14px 14px 18px", color: MYBOLA.paperInk, fontFamily: "monospace" }}>
      <div style={{ textAlign: "center", fontWeight: 700, fontSize: 12, letterSpacing: 1 }}>KEDAI SUKAN MAJU</div>
      <div style={{ textAlign: "center", fontSize: 8, color: MYBOLA.paperDim, marginTop: 2 }}>RESIT RASMI</div>
      <div style={{ borderTop: `1px dashed ${MYBOLA.paperRule}`, margin: "10px 0" }} />
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9 }}><span>Bola latihan x12</span><span>240.00</span></div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, marginTop: 4 }}><span>Kon x6</span><span>—</span></div>
      <div style={{ borderTop: `1px dashed ${MYBOLA.paperRule}`, margin: "10px 0" }} />
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, fontWeight: 700 }}><span>JUMLAH</span><span>RM240.00</span></div>
    </div>
  </div>
);

// A completed exchange (owner bubble [+ media] then AI reply), rendered whole.
const DoneStep: React.FC<{ step: Step }> = ({ step }) => (
  <>
    <ChatBubble isMine sender="Anda" time={step.time} text={step.q} maxWidth={280} />
    {step.media === "receipt" && (
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <ChatBubble isMine sender="Anda" time={step.time} text="" bare>
          <ReceiptPhoto />
        </ChatBubble>
      </div>
    )}
    {step.media === "roster" && (
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <ChatBubble isMine sender="Anda" time={step.time} text="" bare>
          <PdfRoster />
        </ChatBubble>
      </div>
    )}
    <ChatBubble isMine={false} sender="Pengurus Akademi" time={step.time} text={step.a} maxWidth={288} />
  </>
);

// Per-step timing (frames): type -> send/process -> reply -> hold, then next.
const STEP_TYPE = 22; //  owner line typing in the omnibar
const STEP_PROC = 24; //  processing dots
const STEP_REPLY = 40; // reply visible + read
const STEP_HOLD = 8; //   small hold before the next step
const STEP_DUR = STEP_TYPE + STEP_PROC + STEP_REPLY + STEP_HOLD; // 94f

const ChatScene: React.FC = () => {
  const f = useCurrentFrame();
  const idx = Math.min(STEPS.length - 1, Math.floor(f / STEP_DUR));
  const local = f - idx * STEP_DUR;

  // Phase within the current step.
  const typing = local < STEP_TYPE;
  const processing = local >= STEP_TYPE && local < STEP_TYPE + STEP_PROC;
  const replied = local >= STEP_TYPE + STEP_PROC;
  const cur = STEPS[idx];

  // Completed steps render fully; the current step reveals in phases.
  const completed = STEPS.slice(0, idx);

  // The omnibar shows the typing line during the type phase, else empty/processing.
  const omniValue = typing ? cur.q : "";

  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", background: MYBOLA.black, paddingTop: 44 }}>
      <div style={{ flex: 1, padding: 12, display: "flex", flexDirection: "column", justifyContent: "flex-end", gap: 10, overflow: "hidden" }}>
        {completed.map((s, i) => (
          <DoneStep key={i} step={s} />
        ))}
        {/* current step: owner bubble appears once sent; reply appears once replied. */}
        {!typing && (
          <>
            <ChatBubble isMine sender="Anda" time={cur.time} text={cur.q} maxWidth={280} />
            {cur.media === "receipt" && (
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <ChatBubble isMine sender="Anda" time={cur.time} text="" bare>
                  <ReceiptPhoto />
                </ChatBubble>
              </div>
            )}
            {cur.media === "roster" && (
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <ChatBubble isMine sender="Anda" time={cur.time} text="" bare>
                  <PdfRoster />
                </ChatBubble>
              </div>
            )}
          </>
        )}
        {replied && (
          <Rise delay={0} distance={14}>
            <ChatBubble isMine={false} sender="Pengurus Akademi" time={cur.time} text={cur.a} maxWidth={288} />
          </Rise>
        )}
      </div>
      <div style={{ padding: 12, paddingBottom: 16 }}>
        <ChatOmnibar value={omniValue} processing={processing} dots={dotsFor(local)} />
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
      {/* Scene 1 — hook: giant chat bubble (client's pick). */}
      <Sequence from={S.hook.from} durationInFrames={S.hook.dur}><HookBubble /></Sequence>

      {/* Scene 2 — Pengurus Akademi full capability montage. */}
      <Sequence from={S.chat.from} durationInFrames={S.chat.dur}>
        <Stage><PhoneFrame time="9:12"><ChatScene /></PhoneFrame></Stage>
      </Sequence>

      {/* Scene 3 — capability summary (orbit variant, client's pick). */}
      <Sequence from={S.caps.from} durationInFrames={S.caps.dur}>
        <CapsOrbit />
      </Sequence>

      {/* Scene 4 — send it anything. */}
      <Sequence from={S.input.from} durationInFrames={S.input.dur}>
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 60 }}>
          <TextReveal text="Hantar apa sahaja." by="word" delay={2} step={2}
            style={{ fontFamily: displayFamily, fontSize: 56, color: MYBOLA.white, letterSpacing: 0.5, justifyContent: "center" }} />
          <InputTypes startDelay={12} />
        </AbsoluteFill>
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
      { frame: S.hook.from, role: "intro", label: "Hook", sound: "Motif hits with the montage — the product bursts to life; resolves under the headline." },
      { frame: S.chat.from, role: "build", label: "Pengurus Akademi", sound: "Piano motif carries; pad swells; a light mallet accent on each action landing." },
      { frame: S.caps.from, role: "build", label: "Capability summary", sound: "Add a bright arpeggio as the capabilities stagger in." },
      { frame: S.input.from, role: "build", label: "Inputs" },
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
