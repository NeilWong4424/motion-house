import React from "react";
import { AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { FadeIn, SERIF, useFonts } from "../../../shared/narration/primitives";
import { ActionSheet, Omnibar, RealBubble } from "../../../shared/ui/chat";
import { AppScreen, PhoneFrame, StatusBar } from "../../../shared/ui/phone";
import { WABubble, WADoc, WAScreen } from "../../../shared/ui/whatsapp";
import { defineVideo } from "../../../shared/engine/types";
import { ui, uiText } from "../appTheme";
import { CORAL, CREAM, INK, KICKER, LAUNCH_BADGE, TAGLINE, WORDMARK } from "../brand";

// v5: full feature demo in the real UI — member, bil, session/kehadiran,
// jadual, kedai, WhatsApp inbox onboarding. No logo anywhere.

const S1 = 90;
const A = 330;
const C1 = 66;
const B = 315;
const C2 = 66;
const C = 320;
const C3 = 66;
const CL = 130;
export const TOTAL_V4 = S1 + A + C1 + B + C2 + C + C3 + CL;

const Serif: React.FC<{ lines: string[]; size?: number; delay?: number }> = ({ lines, size = 68, delay = 4 }) => {
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
          return <div key={i} style={{ fontFamily: SERIF, fontSize: size, color: INK, fontWeight: 500, lineHeight: 1.32, opacity: s, transform: `translateY(${interpolate(s, [0, 1], [28, 0])}px)` }}>{l}</div>;
        })}
      </div>
    </AbsoluteFill>
  );
};

const Greeting: React.FC = () => {
  useFonts();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - 6, fps, config: { damping: 14, stiffness: 120 } });
  return (
    <AbsoluteFill style={{ background: CREAM, alignItems: "center", justifyContent: "center" }}>
      <span style={{ opacity: s, transform: `translateY(${interpolate(s, [0, 1], [26, 0])}px)`, fontFamily: SERIF, fontSize: 82, color: INK, fontWeight: 500 }}>
        Selamat pagi, Coach<span style={{ color: CORAL }}>.</span>
      </span>
    </AbsoluteFill>
  );
};

const ChatShell: React.FC<{ children: React.ReactNode; header?: React.ReactNode; omnibar: React.ReactNode; time?: string }> = ({ children, header, omnibar, time = "9:41" }) => (
  <AppScreen>
    <StatusBar time={time} />
    <AbsoluteFill style={{ padding: "170px 27px 46px", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
      {header}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end", paddingBottom: 26 }}>
        {children}
      </div>
      {omnibar}
    </AbsoluteFill>
  </AppScreen>
);

// ---------- Scene A: member + bil ----------
const P1 = "Daftarkan pemain baru: Adam Haris, U-12. No. ibu: 012-345 6789";
const SceneA: React.FC = () => {
  const frame = useCurrentFrame();
  // Transcript dims to 0.2 while the action sheet is up (chat_content.dart behavior).
  const dim = interpolate(frame, [265, 274], [1, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <ChatShell omnibar={
      <>
        <ActionSheet
          atFrame={268}
          title="Bil Bulan Jun"
          subtitle="U-12 · 28 ahli"
          fields={[
            { label: "Jumlah", value: "RM2,240.00" },
            { label: "Status", value: "Dihantar" },
            { label: "Tertunggak", value: "3 peringatan dihantar" },
          ]}
          options={[{ label: "Kemaskini" }, { label: "Padam", color: ui.error }]}
        />
        <Omnibar typedText={P1} startFrame={8} charsPerFrame={0.8} sentAtFrame={95} processing={[99, 136]} />
      </>
    }>
      <div style={{ opacity: dim }}>
        <RealBubble mine atFrame={95} caption="Anda · 9:41 AM"><span style={uiText.body}>{P1}</span></RealBubble>
        <RealBubble atFrame={140} caption="Pengurus · 9:41 AM"><span style={uiText.body}>Siap — profil Adam dicipta. Yuran pendaftaran RM50 diinvois kepada ibu Adam.</span></RealBubble>
        <RealBubble mine atFrame={195} caption="Anda · 9:42 AM"><span style={uiText.body}>Hantar bil bulan Jun kepada semua ahli U-12</span></RealBubble>
        <RealBubble atFrame={243} caption="Pengurus · 9:42 AM"><span style={uiText.body}>28 bil dihantar.</span></RealBubble>
      </div>
    </ChatShell>
  );
};

// ---------- Scene B: session (voice attendance) + jadual ----------
const VoiceBody: React.FC = () => (
  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
    <div style={{ width: 60, height: 60, borderRadius: "50%", background: "rgba(255,255,255,0.14)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <svg width="22" height="22" viewBox="0 0 14 14"><path d="M3 2 L11 7 L3 12 Z" fill="#FFF" /></svg>
    </div>
    {[10, 18, 12, 22, 16, 26, 14, 20, 10, 16, 24, 12].map((h, i) => (
      <span key={i} style={{ width: 6, height: h * 1.7, borderRadius: 3, background: "rgba(255,255,255,0.85)", display: "inline-block", marginLeft: i ? -8 : 0 }} />
    ))}
    <span style={{ ...uiText.meta, color: "rgba(255,255,255,0.8)", marginLeft: 8 }}>0:07</span>
  </div>
);

const SceneB: React.FC = () => (
  <ChatShell omnibar={<Omnibar processing={[55, 96]} />}>
    <RealBubble mine atFrame={20} caption="Anda · 5:58 PM"><VoiceBody /></RealBubble>
    <RealBubble atFrame={100} caption="Pengurus · 5:58 PM"><span style={uiText.body}>Kehadiran sesi petang direkod — <span style={{ color: ui.success }}>22/24 hadir</span>. Ibu bapa 2 pemain yang tiada telah dimaklumkan.</span></RealBubble>
    <RealBubble mine atFrame={195} caption="Anda · 5:59 PM"><span style={uiText.body}>Latihan Rabu tukar ke 5 petang</span></RealBubble>
    <RealBubble atFrame={245} caption="Pengurus · 5:59 PM"><span style={uiText.body}>Jadual dikemas kini — 28 ibu bapa dimaklumkan tentang perubahan.</span></RealBubble>
  </ChatShell>
);

// ---------- Scene C: kedai via WhatsApp inbox + PDF resit ----------
const P2 = "Nak order jersi home saiz M untuk Adam";
const SceneC: React.FC = () => (
  <WAScreen typedText={P2} startFrame={8} charsPerFrame={0.8} sentAtFrame={60}>
    <StatusBar time="9:02" light />
    <WABubble mine atFrame={60} time="9:02 PM"><span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 32, color: "#E9EDEF", lineHeight: 1.4 }}>{P2}</span></WABubble>
    <WABubble atFrame={105} time="9:02 PM"><span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 32, color: "#E9EDEF", lineHeight: 1.4 }}>Pesanan disahkan — Jersi Home (M), RM65. Bil dihantar ke akaun anda.</span></WABubble>
    <WABubble mine atFrame={168} time="9:04 PM" maxWidth={860}><WADoc name="resit_bank.pdf" caption="Dah bayar yuran Jun" /></WABubble>
    <WABubble atFrame={230} time="9:04 PM"><span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 32, color: "#E9EDEF", lineHeight: 1.4 }}>Resit disahkan ✓ Yuran Jun selesai. Terima kasih, Puan Aida!</span></WABubble>
  </WAScreen>
);

const CloseV5: React.FC = () => {
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

export const LaunchVideoV4: React.FC = () => (
  <AbsoluteFill style={{ background: CREAM }}>
    <Sequence durationInFrames={S1}><FadeIn><Greeting /></FadeIn></Sequence>
    <Sequence from={S1} durationInFrames={A}><FadeIn><PhoneFrame canvas={CREAM} dipFrames={[95, 195]}><SceneA /></PhoneFrame></FadeIn></Sequence>
    <Sequence from={S1 + A} durationInFrames={C1}><FadeIn><Serif lines={["Ahli didaftar.", "Bil dihantar."]} /></FadeIn></Sequence>
    <Sequence from={S1 + A + C1} durationInFrames={B}><FadeIn><PhoneFrame canvas={CREAM} dipFrames={[20, 195]}><SceneB /></PhoneFrame></FadeIn></Sequence>
    <Sequence from={S1 + A + C1 + B} durationInFrames={C2}><FadeIn><Serif size={62} lines={["Sesi, kehadiran, jadual —", "automatik."]} /></FadeIn></Sequence>
    <Sequence from={S1 + A + C1 + B + C2} durationInFrames={C}><FadeIn><PhoneFrame canvas={CREAM} dipFrames={[60, 168]}><SceneC /></PhoneFrame></FadeIn></Sequence>
    <Sequence from={S1 + A + C1 + B + C2 + C} durationInFrames={C3}><FadeIn><Serif size={56} lines={["Ibu bapa terus guna WhatsApp.", "Tiada app baru.", "Pengurus? Semua masuk MyBola."]} /></FadeIn></Sequence>
    <Sequence from={S1 + A + C1 + B + C2 + C + C3} durationInFrames={CL}><FadeIn><CloseV5 /></FadeIn></Sequence>
  </AbsoluteFill>
);

export const mybolaV4 = defineVideo({
  id: "MyBolaV4",
  component: LaunchVideoV4,
  durationInFrames: TOTAL_V4,
});
