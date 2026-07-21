import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { defineVideo, LANDSCAPE } from "../../../shared/engine/types";
import { useDesignFonts } from "../../../shared/design/fonts";
import { claudeDispatch, CD } from "../design";
import { Stage, DeviceLayer, useBeat, type Beat } from "../ui/world";
import {
  PhoneDevice, MacWindow, ImacDevice,
  DispatchChat, HeroBubble, CopyLine, TitleCard, PairPanel,
  DeckApp, FinderApp, CalendarApp, TerminalApp, LibraryApp, PixelForgeApp,
  Squiggle, ClaudeLogo, type ChatMsg,
} from "../ui/surfaces";

// =============================================================================
// Claude "Dispatch" — 1:1 staged replica of Recording 2026-07-17 073006.mp4
// =============================================================================
// Built against the FRAME-BY-FRAME LOG in ../NOTES.md. Timeline = the recording's
// own 2× frames (1091 @30fps) so this matches THIS file exactly. Beats hard-cut on
// the measured cut frames; phone↔desktop handoffs are eased slides (DeviceLayer
// `from`); in-app content animates natively. LANDSCAPE 16:9. No player chrome.
//
//   Beat        at     kind      content
//   title       0      title     "Reach your desktop from your pocket" + pair panel
//   v1line      57     line      "Like when the deck is on your laptop, but you aren't"
//   v1hero      98     hero      export-deck bubble (full frame)
//   v1chat      133    chat      Dispatch phone (bubble morphs in) → "Sure thing…"
//   v1desk      168    desk      PowerPoint→Export→Finder→Calendar (laptop + phone)
//   v1conf      332    chat      phone confirm "Attached the PDF…"
//   v2line      379    line      "…check the build, but you're on the train"
//   v2hero      427    hero      dev-server bubble
//   v2chat      435    chat      phone "On it — starting a code task…"
//   v2desk      490    desk      terminal → Cueform Library (browser + phone)
//   v2conf      576    confL     phone-forward: "22 preset cards…"
//   v3line      711    line      "…150 photos to process, but you have dinner plans"
//   v3hero      758    hero      batch-photos bubble
//   v3chat      766    chat      phone "Found them — starting the batch…"
//   v3desk      806    desk      PixelForge iMac → Finder folder
//   v3conf      1001   confL     phone-forward confirm on lavender bg
//   end         1036   logo      Claude sunburst bloom + wordmark
const TOTAL = 1091;
const END_AT = 1036;

type Kind = "title" | "line" | "hero" | "chat" | "desk" | "confL" | "logo";
type DBeat = Beat & { kind: Kind };
const BEATS: DBeat[] = [
  { at: 0, kind: "title" },
  { at: 57, kind: "line" },
  { at: 98, kind: "hero" },
  { at: 133, kind: "chat" },
  { at: 168, kind: "desk" },
  { at: 332, kind: "chat" },
  { at: 379, kind: "line" },
  { at: 427, kind: "hero" },
  { at: 435, kind: "chat" },
  { at: 490, kind: "desk" },
  { at: 576, kind: "confL" },
  { at: 711, kind: "line" },
  { at: 758, kind: "hero" },
  { at: 766, kind: "chat" },
  { at: 806, kind: "desk" },
  { at: 1001, kind: "confL" },
  { at: END_AT, kind: "logo" },
];

// -----------------------------------------------------------------------------
// Copy per beat (measured from the reference)
// -----------------------------------------------------------------------------
const LINES: Record<number, [string, string]> = {
  57: ["Like when the deck is on your laptop,", "but you aren't"],
  379: ["Or when it's time to check the build,", "but you're on the train"],
  711: ["Or when there are 150 photos to process,", "but you have dinner plans"],
};
const HEROES: Record<number, string> = {
  98: "I'm running late to an appointment. Can you export my pitch deck as a PDF and attach it to my 2 PM invite?",
  427: "Start the dev server, screenshot the library page, and send it to me before the demo at 3PM. Please!",
  758: "Can you batch process all the shop photos on my desktop? Size them as 1200px PNGs and add the white logo bottom-right. Ran out of time to do it myself",
};

// Phone transcripts (frames are LOCAL to each chat beat's `at`; offset applied below).
const V1_CHAT: ChatMsg[] = [
  { out: false, text: "Downloads folder — signed contract-v3.pdf. Want me to move it somewhere?", at: 0 },
  { out: true, text: "I'm running late to an appointment. Can you export my pitch deck as a PDF and attach it to my 2 PM invite?", time: "12:04 PM", at: 0 },
  { out: false, text: "Sure thing — pulling up the deck now.", at: 14 },
];
const V1_CONF: ChatMsg[] = [
  { out: true, text: "I'm running late to an appointment. Can you export my pitch deck as a PDF and attach it to my 2 PM invite?", time: "12:04 PM", at: 0 },
  { out: false, text: "Sure thing — pulling up the deck now.", at: 0 },
  { out: false, text: "Attached the PDF to your 2 PM invite. Grabbed the version you edited at 9:47 this morning, exported full quality. You're good to go.", at: 8 },
];
const V2_CHAT: ChatMsg[] = [
  { out: true, text: "Start the dev server, screenshot the library page, and send it to me before the demo at 3PM. Please!", time: "3:09 PM", at: 0 },
  { out: false, text: "On it — starting a code task to run the dev server and grab that screenshot.", at: 12 },
];
const V2_CONF: ChatMsg[] = [
  { out: true, text: "Start the dev server, screenshot the library page, and send it to me before the demo at 3PM. Please!", time: "3:09 PM", at: 0 },
  { out: false, text: "App's running — found the library page.", at: 0 },
  { out: false, text: "22 preset cards in a 4-column grid under \"Cueform/Library\". Now getting the screenshot!", at: 10 },
  { out: false, text: "Rendering looks clean with new brand. Header is a 4-column grid. Each one has a thumbnail, title, description, primitive name and duration.", at: 120 },
];
const V3_CHAT: ChatMsg[] = [
  { out: true, text: "Can you batch process all the shop photos on my desktop? Size them as 1200px PNGs and add the white logo bottom-right. Ran out of time to do it myself", time: "6:22 PM", at: 0 },
  { out: false, text: "Found them — starting the batch now. I'll ping you when it's done.", at: 12 },
];
const V3_CONF: ChatMsg[] = [
  { out: true, text: "Can you batch process all the shop photos on my desktop? Size them as 1200px PNGs and add the white logo bottom-right. Ran out of time to do it myself", time: "6:22 PM", at: 0 },
  { out: false, text: "Found them — starting the batch now. I'll ping you when it's done.", at: 0 },
  { out: false, text: "Done! 150 photos added to a new folder on your desktop, sized to 1200px with the logo bottom-right.", at: 20 },
];

// -----------------------------------------------------------------------------
// Composition
// -----------------------------------------------------------------------------
const Composition: React.FC = () => {
  const f = useCurrentFrame();
  const { beat, nextAt } = useBeat(BEATS);
  const hold = (nextAt === Infinity ? END_AT : nextAt) - beat.at;
  const at = beat.at;

  // -- title
  if (beat.kind === "title") {
    return (<><TitleCard f={f} /><PairPanel f={f} at={38} /></>);
  }
  // -- copy line
  if (beat.kind === "line") {
    const [l1, l2] = LINES[at] ?? ["", ""];
    return <CopyLine line1={l1} line2={l2} f={f} at={at} />;
  }
  // -- hero bubble (full frame)
  if (beat.kind === "hero") {
    return <HeroBubble text={HEROES[at] ?? ""} f={f} at={at} />;
  }
  // -- phone-full chat (bubble morphs into phone at start of first chat beat)
  if (beat.kind === "chat") {
    const msgs = at === 133 ? V1_CHAT : at === 332 ? V1_CONF : at === 435 ? V2_CHAT : at === 766 ? V3_CHAT : V3_CHAT;
    // offset transcript frames to global
    const gmsgs = msgs.map((m) => ({ ...m, at: at + m.at }));
    const bg = at === 1001 ? CD.bgWave : CD.bg;
    // morph-in from the hero bubble: phone rises/scales in for the very first chat of each vignette
    const morph = at === 133 || at === 435;
    return (
      <DeviceLayer x={680} y={38} scale={0.86} z={2} bornAt={at} holdFor={hold} from={morph ? { dy: 40, scale: 0.8 } : undefined} dur={11}>
        <PhoneDevice><DispatchChat f={f} msgs={gmsgs} scrollAt={at + 20} scrollBy={at === 332 ? 120 : 0} /></PhoneDevice>
      </DeviceLayer>
    );
  }
  // -- desk (phone anchor left + one desktop right, handoff slide-in)
  if (beat.kind === "desk") {
    const phone = (
      <DeviceLayer x={30} y={300} scale={0.5} z={3} bornAt={at} holdFor={hold} from={{ dx: 260, scale: 0.62 }} dur={9}>
        <PhoneDevice><DispatchChat f={f} msgs={deskPhoneMsgs(at)} /></PhoneDevice>
      </DeviceLayer>
    );
    const squig = (
      <div style={{ position: "absolute", left: 400, top: 470, zIndex: 4 }}><Squiggle f={f} at={at + 6} /></div>
    );
    let desktop: React.ReactNode = null;
    if (at === 168) desktop = <DeskV1 f={f} at={at} hold={hold} />;
    else if (at === 490) desktop = <DeskV2 f={f} at={at} hold={hold} />;
    else desktop = <DeskV3 f={f} at={at} hold={hold} />;
    return (<>{desktop}{squig}{phone}</>);
  }
  // -- confL: phone-forward two-device (phone big-left, desktop small-right)
  if (beat.kind === "confL") {
    const msgs = at === 576 ? V2_CONF : V3_CONF;
    const gmsgs = msgs.map((m) => ({ ...m, at: at + m.at }));
    const bg = at === 1001 ? CD.bgWave : CD.bg;
    const small =
      at === 576
        ? <DeviceLayer x={900} y={300} scale={0.5} z={1} bornAt={at} holdFor={hold}><MacWindow menuApp="Claude"><LibraryApp f={f} at={at} /></MacWindow></DeviceLayer>
        : <DeviceLayer x={880} y={280} scale={0.46} z={1} bornAt={at} holdFor={hold}><ImacDevice><PixelForgeApp f={f} at={at} /></ImacDevice></DeviceLayer>;
    return (
      <>
        {small}
        <div style={{ position: "absolute", left: 480, top: 470, zIndex: 2 }}><Squiggle f={f} at={at + 4} /></div>
        <DeviceLayer x={60} y={70} scale={0.78} z={3} bornAt={at} holdFor={hold} from={{ dx: -40, scale: 0.7 }} dur={8}>
          <PhoneDevice><DispatchChat f={f} msgs={gmsgs} scrollAt={at + 30} scrollBy={at === 576 ? 160 : 100} /></PhoneDevice>
        </DeviceLayer>
      </>
    );
  }
  return null;
};

// Small helper: the anchored phone during a desk beat shows the vignette's chat.
const deskPhoneMsgs = (at: number): ChatMsg[] => {
  if (at === 168) return V1_CHAT.map((m) => ({ ...m, at: 0 }));
  if (at === 490) return V2_CHAT.map((m) => ({ ...m, at: 0 }));
  return V3_CHAT.map((m) => ({ ...m, at: 0 }));
};

// -----------------------------------------------------------------------------
// Desktop staging per vignette (laptop/iMac slides in from the right)
// -----------------------------------------------------------------------------
const DeskV1: React.FC<{ f: number; at: number; hold: number }> = ({ f, at, hold }) => {
  // Sub-timeline (local frames from at=168): deck+menu → export dialog → Finder → Calendar
  const local = f - at;
  return (
    <DeviceLayer x={640} y={95} scale={0.82} z={1} bornAt={at} holdFor={hold} from={{ dx: 300, scale: 0.7 }} dur={9}>
      <MacWindow menuApp="PowerPoint">
        {local < 80 ? (
          <DeckApp f={f} menuOpenAt={at + 32} dialogAt={at + 46} />
        ) : local < 104 ? (
          <FinderApp f={f} at={at + 80} />
        ) : (
          <CalendarApp f={f} at={at + 104} />
        )}
      </MacWindow>
    </DeviceLayer>
  );
};
const DeskV2: React.FC<{ f: number; at: number; hold: number }> = ({ f, at, hold }) => {
  const local = f - at;
  return (
    <DeviceLayer x={640} y={95} scale={0.82} z={1} bornAt={at} holdFor={hold} from={{ dx: 300, scale: 0.7 }} dur={9}>
      <MacWindow menuApp="Claude">
        {local < 30 ? <TerminalApp f={f} at={at + 6} /> : <LibraryApp f={f} at={at + 30} />}
      </MacWindow>
    </DeviceLayer>
  );
};
const DeskV3: React.FC<{ f: number; at: number; hold: number }> = ({ f, at, hold }) => {
  const local = f - at;
  return (
    <DeviceLayer x={620} y={70} scale={0.62} z={1} bornAt={at} holdFor={hold} from={{ dx: 320, scale: 0.52 }} dur={9}>
      <ImacDevice>
        {local < 154 ? <PixelForgeApp f={f} at={at + 10} /> : <FinderApp f={f} at={at + 154} folder />}
      </ImacDevice>
    </DeviceLayer>
  );
};

// -----------------------------------------------------------------------------
// End card
// -----------------------------------------------------------------------------
const EndCard: React.FC = () => {
  const f = useCurrentFrame();
  if (f < END_AT) return null;
  return (
    <AbsoluteFill style={{ background: CD.bg }}>
      <ClaudeLogo f={f} at={END_AT + 1} />
    </AbsoluteFill>
  );
};

const DispatchFilm: React.FC = () => {
  useDesignFonts(claudeDispatch);
  const f = useCurrentFrame();
  const bg = f >= 1001 && f < END_AT ? CD.bgWave : CD.bg;
  return (
    <AbsoluteFill style={{ background: CD.bg }}>
      <Stage bg={bg}>
        <Composition />
      </Stage>
      <EndCard />
    </AbsoluteFill>
  );
};

// =============================================================================
// VideoDef
// =============================================================================
export const dispatch = defineVideo({
  id: "ClaudeDispatch",
  component: DispatchFilm,
  durationInFrames: TOTAL,
  ...LANDSCAPE,
  audio: {
    style: "Calm, warm editorial product bed — felt piano + soft analog pad, unhurried and confident, instrumental. The Claude product-film register: bright, human, never busy.",
    instrumentation: "Felt piano, warm analog pad, light sub, sparse mallet. No drums until the payoff; then a soft kick + brushed pulse only.",
    tempoKey: "76 BPM, F major",
    hook: "A simple rising 3-note piano motif that returns on each vignette's copy-line and resolves on the logo.",
    beats: [
      { frame: 0, role: "intro", label: "Title", sound: "A held piano note; a soft mallet as the title sets." },
      { frame: 57, role: "build", label: "V1 line", sound: "Motif enters as the serif line cuts in." },
      { frame: 168, role: "build", label: "V1 desk", sound: "A soft chord seats on the handoff; light run as the export lands." },
      { frame: 379, role: "build", label: "V2 line", sound: "Motif restates; pad swells." },
      { frame: 490, role: "riser", label: "V2 desk", sound: "Warmth grows as the Library renders." },
      { frame: 711, role: "riser", label: "V3 line", sound: "Register lifts into the final vignette." },
      { frame: 806, role: "build", label: "V3 desk", sound: "A light pulse as the 150-photo grid fills." },
      { frame: END_AT, role: "payoff", label: "Logo", sound: "Motif resolves on a warm major chord as the sunburst blooms; let it ring." },
    ],
    roleText: { build: "add one voice at a time, sparse and unhurried", riser: "swell warmth and register, no percussion yet" },
    dynamics: "A quiet bed with generous headroom — never near clipping. The logo is a gentle lift, not a drop.",
    stingerFrame: END_AT + 2,
    exclude: "vocals, lyrics, EDM drops, aggressive drums, lo-fi hiss, hard fade-out",
    sfxNotes: "Soft UI tap on each bubble send; a light whoosh on each phone-to-desktop handoff; a warm chime as the logo blooms. All low, on-frame.",
  },
});
