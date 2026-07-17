import React from "react";
import { AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { SERIF, useFonts } from "../../../shared/narration/primitives";
import { FadeIn } from "../../../shared/motion/transitions";
import { Shot } from "../../../shared/motion/shot";
import { StatusBar } from "../../../shared/ui/phone";
import { defineVideo } from "../../../shared/engine/types";
import { PhoneFrame } from "../ui/phone";
import {
  MemberCard,
  ParentLogin,
  ParentNav,
  ParentPortal,
  ParentSetupStep,
  ParentSheet,
  SheetButton,
  SizePicker,
  StatusChip,
} from "../ui/parentApp";
import { SC, UIFONT, ui, uiText } from "../appTheme";
import { CORAL, CREAM, INK, KICKER, LAUNCH_BADGE, TAGLINE, WORDMARK } from "../brand";

// =============================================================================
// Parent onboarding — "Anak dah didaftar. Sekarang giliran anda." (~56s)
// =============================================================================
// The companion film to the launch cut: that one is the coach's side, this is
// the parent's. Google sign-in -> phone -> name -> portal -> the three things a
// parent actually does: log attendance, pay a bill, buy merchandise.
//
// The spine is the phone number. setup_profile_screen.dart calls
// linkMembersByPhone(uid, phone) — the number the coach typed when registering
// Adam is what makes Adam appear on his mother's phone. That's the whole story,
// and it's real, not a narrative invention.
//
// Cast/figures continue the launch film: Adam Haris (U-12), Puan Aida his
// mother, RM80 June fee, jersey home M at RM65.

const H = 100;   // hook — the reference never flashes a card
const LOGIN = 180;
const PHONE = 210;
const CARD1 = 100; // the link payoff — held, not flashed
const NAME = 180;
const PORTAL = 180;
const SESI = 180;   // log attendance
const BIL = 210;    // pay bill
const KEDAI = 210;  // buy merchandise
const CARD2 = 100;
const CLOSE = 130;

const AT_LOGIN = H;
const AT_PHONE = AT_LOGIN + LOGIN;
const AT_CARD1 = AT_PHONE + PHONE;
const AT_NAME = AT_CARD1 + CARD1;
const AT_PORTAL = AT_NAME + NAME;
const AT_SESI = AT_PORTAL + PORTAL;
const AT_BIL = AT_SESI + SESI;
const AT_KEDAI = AT_BIL + BIL;
const AT_CARD2 = AT_KEDAI + KEDAI;
const AT_CLOSE = AT_CARD2 + CARD2;
export const TOTAL_PARENT = AT_CLOSE + CLOSE;

// ---------- narration ----------
const Serif: React.FC<{ lines: string[]; size?: number; delay?: number }> = ({ lines, size = 66, delay = 4 }) => {
  useFonts();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ks = spring({ frame: frame - delay, fps, config: { damping: 14, stiffness: 130 } });
  return (
    <AbsoluteFill style={{ background: CREAM, alignItems: "center", justifyContent: "center", padding: "0 70px" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ opacity: ks, fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 25, fontWeight: 600, letterSpacing: 9, color: CORAL, marginBottom: 34 }}>{KICKER}</div>
        {lines.map((l, i) => {
          const s = spring({ frame: frame - delay - 3 - i * 5, fps, config: { damping: 14, stiffness: 130 } });
          return (
            <div key={i} style={{ fontFamily: SERIF, fontSize: size, color: INK, fontWeight: 500, lineHeight: 1.32, opacity: s, transform: `translateY(${interpolate(s, [0, 1], [28, 0])}px)` }}>
              {l}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ---------- app scenes ----------
const LoginScene: React.FC = () => (
  <>
    <StatusBar time="9:05" />
    <ParentLogin pressAt={120} />
  </>
);

const PhoneScene: React.FC = () => (
  <>
    <StatusBar time="9:05" />
    <ParentSetupStep
      title="Nombor telefon"
      subtitle="Sila masukkan nombor telefon anda."
      placeholder="0123456789"
      typedText="012-345 6789"
      startFrame={20}
      ctaAt={12}
      pressAt={150}
    />
  </>
);

const NameScene: React.FC = () => (
  <>
    <StatusBar time="9:06" />
    <ParentSetupStep
      title="Nama pengguna"
      subtitle="Sila masukkan nama pengguna anda."
      placeholder="cth. Ahmad Faizal"
      typedText="Aida Rahman"
      startFrame={18}
      cta="Selesai"
      ctaAt={12}
      pressAt={135}
    />
  </>
);

// The link landing: Adam — registered by the coach in the launch film — appears
// on his mother's phone because their phone numbers match.
const PortalScene: React.FC = () => (
  <>
    <StatusBar time="9:06" />
    <ParentPortal>
      <MemberCard atFrame={20} name="Adam Haris" group="U-12 · Akademi Tunas Muda" />
    </ParentPortal>
    <ParentNav active="akademi" />
  </>
);

const SesiScene: React.FC = () => {
  const frame = useCurrentFrame();
  const dim = interpolate(frame, [24, 34], [1, 0.25], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const done = frame >= 120;
  return (
    <>
      <StatusBar time="5:52" />
      <div style={{ opacity: dim }}>
        <ParentPortal>
          <MemberCard atFrame={0} name="Adam Haris" group="U-12 · Akademi Tunas Muda" />
        </ParentPortal>
      </div>
      <ParentSheet atFrame={30} title="Latihan Petang" sub="Rabu, 5:00PM · 24 PELATIH">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 * SC }}>
          <span style={uiText.body}>Adam Haris</span>
          {done ? <StatusChip label="HADIR" tone="success" /> : null}
        </div>
        <SheetButton text={done ? "Kehadiran direkod" : "Rekod Kehadiran"} tone={done ? "success" : "primary"} atFrame={40} pressAt={110} />
      </ParentSheet>
    </>
  );
};

const BilScene: React.FC = () => {
  const frame = useCurrentFrame();
  const dim = interpolate(frame, [24, 34], [1, 0.25], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const paid = frame >= 140;
  return (
    <>
      <StatusBar time="9:12" />
      <div style={{ opacity: dim }}>
        <ParentPortal>
          <MemberCard atFrame={0} name="Adam Haris" group="U-12 · Akademi Tunas Muda" />
        </ParentPortal>
      </div>
      <ParentSheet atFrame={30} title="Yuran Bulanan Jun" sub="Adam Haris · U-12">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 * SC }}>
          <span style={{ fontFamily: UIFONT, fontSize: 34 * SC, fontWeight: 600, color: ui.white }}>RM80.00</span>
          <StatusChip label={paid ? "DIBAYAR" : "BELUM BAYAR"} tone={paid ? "success" : "error"} />
        </div>
        <SheetButton text={paid ? "Dibayar" : "Bayar Sekarang"} tone={paid ? "success" : "primary"} atFrame={40} pressAt={128} />
      </ParentSheet>
    </>
  );
};

const KedaiScene: React.FC = () => {
  const frame = useCurrentFrame();
  const dim = interpolate(frame, [24, 34], [1, 0.25], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const bought = frame >= 150;
  return (
    <>
      <StatusBar time="9:14" />
      <div style={{ opacity: dim }}>
        <ParentPortal>
          <MemberCard atFrame={0} name="Adam Haris" group="U-12 · Akademi Tunas Muda" />
        </ParentPortal>
      </div>
      <ParentSheet atFrame={30} title="Jersi Home" sub="Akademi Tunas Muda">
        <span style={{ ...uiText.meta, display: "block", marginBottom: 8 * SC }}>Pilih Saiz</span>
        <SizePicker sizes={["S", "M", "L"]} chosen="M" chooseAt={70} />
        <div style={{ height: 16 * SC }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 * SC }}>
          <span style={uiText.meta}>JUMLAH</span>
          <span style={{ fontFamily: UIFONT, fontSize: 30 * SC, fontWeight: 600, color: ui.white }}>RM65.00</span>
        </div>
        <SheetButton text={bought ? "Pesanan disahkan" : "Beli Sekarang"} tone={bought ? "success" : "primary"} atFrame={40} pressAt={138} />
      </ParentSheet>
    </>
  );
};

const Close: React.FC = () => {
  useFonts();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s0 = spring({ frame: frame - 4, fps, config: { damping: 14, stiffness: 130 } });
  const s = spring({ frame: frame - 12, fps, config: { damping: 13, stiffness: 140 } });
  const s2 = spring({ frame: frame - 30, fps, config: { damping: 14, stiffness: 130 } });
  return (
    <AbsoluteFill style={{ background: CREAM, alignItems: "center", justifyContent: "center", gap: 36 }}>
      <div style={{ opacity: s0, display: "inline-flex", alignItems: "center", gap: 14, border: `2px solid ${INK}`, borderRadius: 14, padding: "12px 30px" }}>
        <span style={{ width: 13, height: 13, borderRadius: "50%", background: CORAL, display: "inline-block" }} />
        <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 25, fontWeight: 600, letterSpacing: 5, color: INK }}>{LAUNCH_BADGE}</span>
      </div>
      <span style={{ opacity: s, transform: `scale(${interpolate(s, [0, 1], [0.94, 1])})`, fontFamily: SERIF, fontSize: 116, color: INK, fontWeight: 500 }}>{WORDMARK}</span>
      <span style={{ opacity: s2, fontFamily: SERIF, fontSize: 33, color: "rgba(31,27,22,0.6)", fontStyle: "italic" }}>{TAGLINE}</span>
    </AbsoluteFill>
  );
};

// =============================================================================
// Framing
// =============================================================================
// Measured against the Dispatch reference (Recording 2026-07-17 073006.mp4):
// it makes 6 cuts in 36s (~1 per 6s) and uses only TWO framings for the whole
// film. It never punches in. What ffmpeg reads as "cuts" is the CONTENT
// changing inside a locked frame — a dialog opens, a window swaps — while the
// camera and the phone sit perfectly still.
//
// A first pass here added 3-4 punch-ins per scene: 19 cuts in 56s, twice the
// reference's rate. It read as choppy, not premium. The lesson: 分镜 is not
// "more shots". Confidence is holding.
//
// So: one static framing per scene, held 6-7s, and the beat is carried by
// content arriving (text typing, a card landing, a sheet sliding up). The only
// camera move in the film is the portal payoff, where the travel means
// something.
const S_STATIC = [{ until: 99999 }];

// The one exception: Adam's card lands in an empty frame, then the camera eases
// in — the move IS the payoff, so it earns its keep.
const S_PORTAL = [
  { until: 60 },
  { until: PORTAL, x: 540, y: 800, scale: 1.12, via: "move" as const, moveFrames: 40 },
];

export const ParentOnboarding: React.FC = () => (
  <AbsoluteFill style={{ background: CREAM }}>
    <Sequence durationInFrames={H}><FadeIn><Serif lines={["Anak dah didaftar.", "Sekarang giliran anda."]} /></FadeIn></Sequence>
    <Sequence from={AT_LOGIN} durationInFrames={LOGIN}><FadeIn><Shot shots={S_STATIC}><PhoneFrame canvas={CREAM}><LoginScene /></PhoneFrame></Shot></FadeIn></Sequence>
    <Sequence from={AT_PHONE} durationInFrames={PHONE}><FadeIn><Shot shots={S_STATIC}><PhoneFrame canvas={CREAM}><PhoneScene /></PhoneFrame></Shot></FadeIn></Sequence>
    <Sequence from={AT_CARD1} durationInFrames={CARD1}><FadeIn><Serif size={62} lines={["Nombor anda kunci.", "Anak anda muncul."]} /></FadeIn></Sequence>
    <Sequence from={AT_NAME} durationInFrames={NAME}><FadeIn><Shot shots={S_STATIC}><PhoneFrame canvas={CREAM}><NameScene /></PhoneFrame></Shot></FadeIn></Sequence>
    <Sequence from={AT_PORTAL} durationInFrames={PORTAL}><FadeIn><Shot shots={S_PORTAL}><PhoneFrame canvas={CREAM}><PortalScene /></PhoneFrame></Shot></FadeIn></Sequence>
    <Sequence from={AT_SESI} durationInFrames={SESI}><FadeIn><Shot shots={S_STATIC}><PhoneFrame canvas={CREAM}><SesiScene /></PhoneFrame></Shot></FadeIn></Sequence>
    <Sequence from={AT_BIL} durationInFrames={BIL}><FadeIn><Shot shots={S_STATIC}><PhoneFrame canvas={CREAM}><BilScene /></PhoneFrame></Shot></FadeIn></Sequence>
    <Sequence from={AT_KEDAI} durationInFrames={KEDAI}><FadeIn><Shot shots={S_STATIC}><PhoneFrame canvas={CREAM}><KedaiScene /></PhoneFrame></Shot></FadeIn></Sequence>
    <Sequence from={AT_CARD2} durationInFrames={CARD2}><FadeIn><Serif size={62} lines={["Semua dari", "telefon anda."]} /></FadeIn></Sequence>
    <Sequence from={AT_CLOSE} durationInFrames={CLOSE}><FadeIn><Close /></FadeIn></Sequence>
  </AbsoluteFill>
);

export const mybolaParent = defineVideo({
  id: "MyBolaParent",
  component: ParentOnboarding,
  durationInFrames: TOTAL_PARENT,
});
