import React from "react";
import { AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { SERIF, useFonts } from "../../../shared/narration/primitives";
import { FadeIn } from "../../../shared/motion/transitions";
import { EASE } from "../../../shared/motion/easing";
import { ActionSheet, Omnibar, RealBubble } from "../../../shared/ui/chat";
import { StatusBar } from "../../../shared/ui/phone";
import { WABubble, WADoc, WAScreen } from "../../../shared/ui/whatsapp";
import { defineVideo } from "../../../shared/engine/types";
import { AppScreen, PhoneFrame } from "../ui/phone";
import { MetricList, RankedBarChart } from "../ui/charts";
import { ui, uiText, SC } from "../appTheme";
import { BillRow, ChipRow, MobileAdminScreen, SectionLabel } from "../ui/mobileAdmin";
import { CORAL, CREAM, INK, KICKER, LAUNCH_BADGE, TAGLINE, WORDMARK } from "../brand";

// =============================================================================
// v8 — "Runs the whole academy" (~90s, portrait)
// =============================================================================
// Extends the v7 cut with a third act: the owner's desktop portal, where the
// money the coach billed in Act 1 shows up as a real dashboard.
//
// Three surfaces, one per act — the film's spine:
//   Act 1  MyBola mobile  — coach asks, admin happens (v7 Scenes A/B)
//   Act 2  WhatsApp       — parent never leaves their app (v7 Scene C)
//   Act 3  MyBola desktop — owner sees everything (NEW, full-bleed)
//
// Figures are tied to Act 1's bill run and must stay self-consistent:
// 28 U-12 members x RM80 = RM2,240 sent; 3 unpaid = RM240 outstanding, 11%.
// Never inflate these — an academy owner does this arithmetic in their head.

const S1 = 90;   // greeting
const H1 = 60;   // NEW: "satu akademi" hook
const A = 330;   // Scene A: member + bil
const C1 = 66;
const B = 315;   // Scene B: session + jadual
const C2 = 66;
const C = 320;   // Scene C: WhatsApp kedai
const C3 = 66;
const T1 = 66;   // NEW: the turn — "dan duit?"
const D1 = 360;  // NEW: desktop bills dashboard
const C4 = 66;   // NEW: "siapa belum bayar"
const D2 = 300;  // NEW: desktop ahli/sesi
const C5 = 66;   // NEW: "semua dalam satu tempat"
const CL = 130;  // close

const AT_H1 = S1;
const AT_A = AT_H1 + H1;
const AT_C1 = AT_A + A;
const AT_B = AT_C1 + C1;
const AT_C2 = AT_B + B;
const AT_C = AT_C2 + C2;
const AT_C3 = AT_C + C;
const AT_T1 = AT_C3 + C3;
const AT_D1 = AT_T1 + T1;
const AT_C4 = AT_D1 + D1;
const AT_D2 = AT_C4 + C4;
const AT_C5 = AT_D2 + D2;
const AT_CL = AT_C5 + C5;
export const TOTAL_V8 = AT_CL + CL;

// ---------- narration layer ----------
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

// ---------- phone scenes (v7, unchanged) ----------
const ChatShell: React.FC<{ children: React.ReactNode; omnibar: React.ReactNode; time?: string }> = ({ children, omnibar, time = "9:41" }) => (
  <AppScreen>
    <StatusBar time={time} />
    <AbsoluteFill style={{ padding: "170px 27px 46px", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end", paddingBottom: 26 }}>{children}</div>
      {omnibar}
    </AbsoluteFill>
  </AppScreen>
);

const P1 = "Daftarkan pemain baru: Adam Haris, U-12. No. ibu: 012-345 6789";
const SceneA: React.FC = () => {
  const frame = useCurrentFrame();
  const dim = interpolate(frame, [265, 274], [1, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <ChatShell omnibar={
      <>
        <ActionSheet atFrame={268} title="Bil Bulan Jun" subtitle="U-12 · 28 ahli"
          fields={[
            { label: "Jumlah", value: "RM2,240.00" },
            { label: "Status", value: "Dihantar" },
            { label: "Tertunggak", value: "3 peringatan dihantar" },
          ]}
          options={[{ label: "Kemaskini" }, { label: "Padam", color: ui.error }]} />
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
  <ChatShell omnibar={<Omnibar processing={[55, 96]} />} time="5:58">
    <RealBubble mine atFrame={20} caption="Anda · 5:58 PM"><VoiceBody /></RealBubble>
    <RealBubble atFrame={100} caption="Pengurus · 5:58 PM"><span style={uiText.body}>Kehadiran sesi petang direkod — <span style={{ color: ui.success }}>22/24 hadir</span>. Ibu bapa 2 pemain yang tiada telah dimaklumkan.</span></RealBubble>
    <RealBubble mine atFrame={195} caption="Anda · 5:59 PM"><span style={uiText.body}>Latihan Rabu tukar ke 5 petang</span></RealBubble>
    <RealBubble atFrame={245} caption="Pengurus · 5:59 PM"><span style={uiText.body}>Jadual dikemas kini — 28 ibu bapa dimaklumkan tentang perubahan.</span></RealBubble>
  </ChatShell>
);

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

// ---------- Act 3: the desktop portal, full-bleed ----------
// Breaks out of the phone deliberately: this is the owner's view, not the
// coach's. The cream canvas stays as a frame so we're still in the same film.
// ---------- Act 3: the admin dashboard, on the phone ----------
// The app really ships a mobile layout (_MobileLayout, <953px): rail and sidebar
// drop away and the routed page fills the screen. So the owner's dashboard is
// shown natively rather than as a shrunken desktop � code-exact AND readable in
// 9:16. Same PhoneFrame as Acts 1-2, so the film keeps one visual grammar.
//
// Figures tie to Act 1: 28 bills sent, 3 unpaid at RM80 = RM240 outstanding, 11%.

const SceneD1: React.FC = () => (
  <MobileAdminScreen title="Bil">
    <StatusBar time="9:41" />
    <SectionLabel label="TARIKH" />
    <ChipRow atFrame={8} chips={[
      { label: "ISN", sub: "2", on: true, badge: "3 tertunggak" },
      { label: "AHD", sub: "1" },
      { label: "SAB", sub: "31" },
    ]} />
    <SectionLabel label="INVOIS" />
    <BillRow atFrame={30} desc="Yuran Bulanan Jun" name="Adam Haris" amount="RM80.00" overdue />
    <BillRow atFrame={38} desc="Yuran Bulanan Jun" name="Nur Aisyah" amount="RM80.00" overdue />
    <BillRow atFrame={46} desc="Yuran Bulanan Jun" name="Haris Idris" amount="RM80.00" overdue />
    <BillRow atFrame={54} desc="Yuran Bulanan Jun" name="Siti Sarah" amount="RM80.00" />
    <BillRow atFrame={62} desc="Yuran Bulanan Jun" name="Danial Zikri" amount="RM80.00" />
    <div style={{ marginTop: 10 * SC }}>
      <MetricList atFrame={95} step={4} rows={[
        ["Jumlah Tertunggak", "RM240.00"],
        ["Ahli Berhutang", "3 ahli"],
        ["Peratus Ahli Berhutang", "11%"],
      ]} />
    </div>
  </MobileAdminScreen>
);

const SceneD2: React.FC = () => (
  <MobileAdminScreen title="Ahli">
    <StatusBar time="9:41" />
    <SectionLabel label="KUMPULAN" />
    <ChipRow atFrame={6} chips={[{ label: "U-12", on: true }, { label: "U-14" }, { label: "U-16" }]} />
    <div style={{ marginTop: 6 * SC }}>
      <RankedBarChart atFrame={30} step={5}
        subtitle="Top 10 Ahli Tertunggak"
        headline="RM240.00"
        rows={[["Adam Haris", 8000], ["Nur Aisyah", 8000], ["Haris Idris", 8000]]}
        totalValue={24000}
        labelWidth={150}
        formatValue={(c) => `RM${(c / 100).toFixed(2)}`}
      />
    </div>
    <div style={{ marginTop: 10 * SC }}>
      <MetricList atFrame={90} step={4} rows={[
        ["Jumlah Ahli", "28 ahli"],
        ["Kehadiran Sesi Petang", "22/24"],
        ["Kumpulan", "U-12"],
      ]} />
    </div>
  </MobileAdminScreen>
);

const CloseV8: React.FC = () => {
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

export const LaunchVideoV8: React.FC = () => (
  <AbsoluteFill style={{ background: CREAM }}>
    <Sequence durationInFrames={S1}><FadeIn><Greeting /></FadeIn></Sequence>
    <Sequence from={AT_H1} durationInFrames={H1}><FadeIn><Serif size={62} lines={["Satu akademi.", "Seratus benda nak urus."]} /></FadeIn></Sequence>
    <Sequence from={AT_A} durationInFrames={A}><FadeIn><PhoneFrame canvas={CREAM}><SceneA /></PhoneFrame></FadeIn></Sequence>
    <Sequence from={AT_C1} durationInFrames={C1}><FadeIn><Serif lines={["Ahli didaftar.", "Bil dihantar."]} /></FadeIn></Sequence>
    <Sequence from={AT_B} durationInFrames={B}><FadeIn><PhoneFrame canvas={CREAM}><SceneB /></PhoneFrame></FadeIn></Sequence>
    <Sequence from={AT_C2} durationInFrames={C2}><FadeIn><Serif size={62} lines={["Sesi, kehadiran, jadual —", "automatik."]} /></FadeIn></Sequence>
    <Sequence from={AT_C} durationInFrames={C}><FadeIn><PhoneFrame canvas={CREAM}><SceneC /></PhoneFrame></FadeIn></Sequence>
    <Sequence from={AT_C3} durationInFrames={C3}><FadeIn><Serif size={56} lines={["Ibu bapa terus guna WhatsApp.", "Tiada app baru."]} /></FadeIn></Sequence>
    <Sequence from={AT_T1} durationInFrames={T1}><FadeIn><Serif size={68} lines={["Dan duit?", "Semua nampak."]} /></FadeIn></Sequence>
    <Sequence from={AT_D1} durationInFrames={D1}><FadeIn><PhoneFrame canvas={CREAM}><SceneD1 /></PhoneFrame></FadeIn></Sequence>
    <Sequence from={AT_C4} durationInFrames={C4}><FadeIn><Serif size={62} lines={["Siapa belum bayar.", "Tanpa tanya."]} /></FadeIn></Sequence>
    <Sequence from={AT_D2} durationInFrames={D2}><FadeIn><PhoneFrame canvas={CREAM}><SceneD2 /></PhoneFrame></FadeIn></Sequence>
    <Sequence from={AT_C5} durationInFrames={C5}><FadeIn><Serif size={62} lines={["Semua dalam", "satu tempat."]} /></FadeIn></Sequence>
    <Sequence from={AT_CL} durationInFrames={CL}><FadeIn><CloseV8 /></FadeIn></Sequence>
  </AbsoluteFill>
);

export const mybolaV8 = defineVideo({
  id: "MyBolaV8",
  component: LaunchVideoV8,
  durationInFrames: TOTAL_V8,
});
