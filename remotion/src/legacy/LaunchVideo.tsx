import React from "react";
import { AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "./theme";
import { Badge, Camera, Canvas, Chapter, ChapterHeader, ChatMsg, Conversation, HeroText, ModalityChip, PillarCard, SANS, SERIF, Wordmark, fadeUp } from "./components";

// ---------- timeline ----------
const HERO = 110;
const INTRO = 95;
const MODAL = 150;
const ADMIN = 850;
const INBOX = 360;
const PORTAL = 220;
const PILLARS = 240;
const CLOSE = 170;

const ADMIN_START = HERO + INTRO + MODAL;
const INBOX_START = ADMIN_START + ADMIN;
const PORTAL_START = INBOX_START + INBOX;
const PILLARS_START = PORTAL_START + PORTAL;
const CLOSE_START = PILLARS_START + PILLARS;
export const TOTAL_FRAMES = CLOSE_START + CLOSE;

const FadeIn: React.FC<{ children: React.ReactNode; duration?: number }> = ({ children, duration = 9 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const opacity = interpolate(frame, [0, duration, durationInFrames - duration, durationInFrames], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>;
};

// ---------- scenes ----------
const Hero: React.FC = () => (
  <Canvas>
    <Camera zoomFrom={1.0} zoomTo={1.08}>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 40, padding: "0 60px" }}>
        <Badge text="Kini dilancarkan" delay={4} />
        <HeroText size={84} lines={["Urus akademi", "bola sepak anda", "dari satu chat"]} delay={12} />
      </AbsoluteFill>
    </Camera>
  </Canvas>
);

const Intro: React.FC = () => (
  <Canvas>
    <Camera zoomFrom={1.04} zoomTo={1.0}>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: "0 70px" }}>
        <HeroText size={62} lines={["Semua kerja admin akademi —", "biar AI uruskan"]} delay={4} />
      </AbsoluteFill>
    </Camera>
  </Canvas>
);

const IconText: React.FC = () => (<svg width="30" height="30" viewBox="0 0 30 30"><path d="M6 8 H24 M6 15 H24 M6 22 H17" stroke="#C15F3C" strokeWidth="2.6" strokeLinecap="round" fill="none" /></svg>);
const IconAudio: React.FC = () => (<svg width="30" height="30" viewBox="0 0 30 30">{[5, 10, 15, 20, 25].map((x, i) => (<line key={i} x1={x} y1={15 - [5, 9, 12, 8, 4][i]} x2={x} y2={15 + [5, 9, 12, 8, 4][i]} stroke="#C15F3C" strokeWidth="2.6" strokeLinecap="round" />))}</svg>);
const IconVideo: React.FC = () => (<svg width="30" height="30" viewBox="0 0 30 30"><rect x="4" y="8" width="15" height="14" rx="3" fill="none" stroke="#C15F3C" strokeWidth="2.4" /><path d="M19 13 L26 9 V21 L19 17 Z" fill="#C15F3C" /></svg>);
const IconPdf: React.FC = () => (<svg width="30" height="30" viewBox="0 0 30 30"><path d="M8 3 H18 L24 9 V27 H8 Z" fill="none" stroke="#C15F3C" strokeWidth="2.4" strokeLinejoin="round" /><path d="M18 3 V9 H24" fill="none" stroke="#C15F3C" strokeWidth="2.4" strokeLinejoin="round" /></svg>);
const IconImage: React.FC = () => (<svg width="30" height="30" viewBox="0 0 30 30"><rect x="4" y="6" width="22" height="18" rx="3" fill="none" stroke="#C15F3C" strokeWidth="2.4" /><circle cx="11" cy="12" r="2.2" fill="#C15F3C" /><path d="M5 22 L13 15 L19 20 L23 17 L26 19" fill="none" stroke="#C15F3C" strokeWidth="2.4" strokeLinecap="round" /></svg>);

const Modality: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <Canvas>
      <Camera zoomFrom={1.0} zoomTo={1.06}>
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 22 }}>
          <div style={{ ...fadeUp(frame, fps, 2), fontFamily: SERIF, fontSize: 62, color: theme.colors.ink, fontWeight: 500, marginBottom: 16, textAlign: "center" }}>
            Faham semua format
          </div>
          <ModalityChip label="Teks" atFrame={12} icon={<IconText />} />
          <ModalityChip label="Suara" atFrame={20} icon={<IconAudio />} />
          <ModalityChip label="Video" atFrame={28} icon={<IconVideo />} />
          <ModalityChip label="PDF" atFrame={36} icon={<IconPdf />} />
          <ModalityChip label="Imej" atFrame={44} icon={<IconImage />} />
        </AbsoluteFill>
      </Camera>
    </Canvas>
  );
};

// ---------- continuous conversations ----------
const ADMIN_CHAPTERS: Chapter[] = [
  { num: "01", title: "Pendaftaran Pemain", from: 0, to: 170 },
  { num: "02", title: "Yuran & Bil", from: 170, to: 340 },
  { num: "03", title: "Kehadiran", from: 340, to: 510 },
  { num: "04", title: "Jadual Latihan", from: 510, to: 680 },
  { num: "05", title: "Notifikasi Ahli", from: 680, to: 850 },
];

const ADMIN_MSGS: ChatMsg[] = [
  { side: "user", at: 20, text: "Daftarkan pemain baru: Adam Haris, U-12. No. ibu: 012-345 6789" },
  { side: "agent", at: 85, text: "Siap — profil pemain dicipta. Yuran pendaftaran RM50 telah diinvois kepada ibu Adam." },
  { side: "user", at: 190, text: "Hantar bil bulan Jun kepada semua ahli U-12" },
  { side: "agent", at: 255, text: "28 bil dihantar — jumlah RM2,240." },
  { side: "agent", at: 300, text: "3 yuran April masih tertunggak. Peringatan telah dihantar." },
  { side: "user", at: 360, kind: "voice" },
  { side: "agent", at: 425, text: "Kehadiran direkod: 22/24 hadir. Ibu bapa pemain yang tiada telah dimaklumkan." },
  { side: "user", at: 530, text: "Latihan Rabu tukar ke 5 petang" },
  { side: "agent", at: 595, text: "Jadual dikemas kini — 28 ibu bapa dimaklumkan tentang perubahan." },
  { side: "user", at: 700, kind: "image", label: "poster_perlawanan.png" },
  { side: "user", at: 725, text: "Umumkan perlawanan Sabtu ini" },
  { side: "agent", at: 780, text: "Pengumuman & poster dihantar kepada semua 132 ahli." },
];

const ADMIN_DOTS: Array<[number, number]> = [[55, 80], [225, 250], [395, 420], [565, 590], [750, 775]];

const INBOX_CHAPTERS: Chapter[] = [
  { num: "06", title: "Kedai Akademi", from: 0, to: 180 },
  { num: "07", title: "Inbox Ibu Bapa 24/7", from: 180, to: 360 },
];

const INBOX_MSGS: ChatMsg[] = [
  { side: "user", at: 25, text: "Nak order jersi home saiz M untuk Adam" },
  { side: "agent", at: 90, text: "Pesanan disahkan — Jersi Home (M), RM65. Bil dihantar ke akaun anda." },
  { side: "user", at: 205, kind: "pdf", label: "resit_bank.pdf" },
  { side: "user", at: 230, text: "Dah bayar yuran Jun" },
  { side: "agent", at: 290, text: "Resit disahkan — yuran Jun ditandakan selesai. Terima kasih!" },
];

const INBOX_DOTS: Array<[number, number]> = [[60, 85], [258, 285]];

const AdminConvo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <Canvas>
      <Camera zoomFrom={1.0} zoomTo={1.1} driftY={-14}>
        <AbsoluteFill style={{ alignItems: "center", paddingTop: 120 }}>
          <ChapterHeader chapters={ADMIN_CHAPTERS} />
          <div style={{ ...fadeUp(frame, fps, 6), transform: `${fadeUp(frame, fps, 6).transform} scale(1.34)`, transformOrigin: "top center", marginTop: 40 }}>
            <Conversation title="MyBola" chip="AI PEMBANTU ADMIN" msgs={ADMIN_MSGS} dots={ADMIN_DOTS} />
          </div>
        </AbsoluteFill>
      </Camera>
    </Canvas>
  );
};

// Inbox conversation slides in from the right while the scene starts — the one animated window switch.
const InboxConvo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const slide = spring({ frame, fps, config: { damping: 15, stiffness: 90 } });
  const x = interpolate(slide, [0, 1], [1100, 0]);
  const rot = interpolate(slide, [0, 1], [6, 0]);
  return (
    <Canvas>
      <Camera zoomFrom={1.02} zoomTo={1.1} driftY={-10}>
        <AbsoluteFill style={{ alignItems: "center", paddingTop: 120 }}>
          <ChapterHeader chapters={INBOX_CHAPTERS} />
          <div style={{ transform: `translateX(${x}px) rotate(${rot}deg) scale(1.34)`, transformOrigin: "top center", marginTop: 40 }}>
            <Conversation title="MyBola" chip="INBOX IBU BAPA" msgs={INBOX_MSGS} dots={INBOX_DOTS} />
          </div>
        </AbsoluteFill>
      </Camera>
    </Canvas>
  );
};

const PortalScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rows = [
    ["Ahmad Danial — U-12", "Dibayar"],
    ["Harith Iskandar — U-12", "Dibayar"],
    ["Wan Aiman — U-14", "Tertunggak"],
    ["Adam Mikhail — U-14", "Dibayar"],
    ["Danish Irfan — U-16", "Tertunggak"],
    ["Iman Firdaus — U-16", "Dibayar"],
  ];
  return (
    <Canvas>
      <Camera zoomFrom={1.0} zoomTo={1.07}>
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: "0 50px" }}>
          <div style={{ textAlign: "center", marginBottom: 34 }}>
            <div style={{ ...fadeUp(frame, fps, 2), fontFamily: SANS, fontSize: 26, letterSpacing: 6, color: theme.colors.coral, fontWeight: 700, marginBottom: 10 }}>08</div>
            <div style={{ ...fadeUp(frame, fps, 6), fontFamily: SERIF, fontSize: 68, color: theme.colors.ink, fontWeight: 500 }}>Portal Admin</div>
          </div>
          <div style={{ ...fadeUp(frame, fps, 10), width: 940, background: "#171512", borderRadius: 28, padding: 44, boxSizing: "border-box" }}>
            <div style={{ fontFamily: SANS, fontSize: 40, fontWeight: 700, color: "#EDE8DD", marginBottom: 8 }}>MyBola Admin</div>
            <div style={{ fontFamily: SANS, fontSize: 24, color: "#9C948A", marginBottom: 30 }}>132 ahli aktif · RM 8,940 kutipan bulan ini</div>
            {rows.map((r, i) => {
              const o = interpolate(frame, [24 + i * 8, 36 + i * 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
              const paid = r[1] === "Dibayar";
              return (
                <div key={i} style={{ opacity: o, background: "#211E1A", borderRadius: 14, padding: "20px 26px", fontFamily: SANS, fontSize: 26, display: "flex", justifyContent: "space-between", marginBottom: 14, color: "#EDE8DD" }}>
                  <span>{r[0]}</span>
                  <span style={{ color: paid ? "#7FB069" : "#D9977E" }}>{r[1]}</span>
                </div>
              );
            })}
          </div>
        </AbsoluteFill>
      </Camera>
    </Canvas>
  );
};

const PillarsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <Canvas>
      <Camera zoomFrom={1.0} zoomTo={1.06}>
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 26, padding: "0 60px" }}>
          <div style={{ ...fadeUp(frame, fps, 2), fontFamily: SERIF, fontSize: 62, color: theme.colors.ink, fontWeight: 500, marginBottom: 4, textAlign: "center" }}>
            Semua dalam satu
          </div>
          <PillarCard atFrame={14} title="Pentadbiran" items={["Pendaftaran pemain", "Yuran & bil automatik", "Kehadiran", "Jadual & sesi latihan"]} />
          <PillarCard atFrame={34} title="Pembangunan" items={["Profil pemain", "Laporan prestasi", "Jejak perkembangan"]} />
          <PillarCard atFrame={54} title="Komunikasi" items={["Notifikasi ibu bapa", "Pengumuman", "Kedai akademi", "AI inbox 24/7"]} />
        </AbsoluteFill>
      </Camera>
    </Canvas>
  );
};

const Close: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <Canvas>
      <Camera zoomFrom={1.06} zoomTo={1.0}>
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 34 }}>
          <Wordmark size={104} delay={4} />
          <div style={{ ...fadeUp(frame, fps, 24), fontFamily: SANS, fontSize: 30, letterSpacing: 2, color: theme.colors.inkSoft, textAlign: "center" }}>
            Perisian pengurusan akademi bola sepak
          </div>
        </AbsoluteFill>
      </Camera>
    </Canvas>
  );
};

export const LaunchVideo: React.FC = () => (
  <AbsoluteFill style={{ background: theme.colors.canvas }}>
    <Sequence durationInFrames={HERO}><FadeIn><Hero /></FadeIn></Sequence>
    <Sequence from={HERO} durationInFrames={INTRO}><FadeIn><Intro /></FadeIn></Sequence>
    <Sequence from={HERO + INTRO} durationInFrames={MODAL}><FadeIn><Modality /></FadeIn></Sequence>
    <Sequence from={ADMIN_START} durationInFrames={ADMIN}><FadeIn><AdminConvo /></FadeIn></Sequence>
    <Sequence from={INBOX_START} durationInFrames={INBOX}><FadeIn><InboxConvo /></FadeIn></Sequence>
    <Sequence from={PORTAL_START} durationInFrames={PORTAL}><FadeIn><PortalScene /></FadeIn></Sequence>
    <Sequence from={PILLARS_START} durationInFrames={PILLARS}><FadeIn><PillarsScene /></FadeIn></Sequence>
    <Sequence from={CLOSE_START} durationInFrames={CLOSE}><FadeIn><Close /></FadeIn></Sequence>
  </AbsoluteFill>
);
