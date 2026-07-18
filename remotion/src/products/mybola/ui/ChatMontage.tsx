import React from "react";
import { useCurrentFrame } from "remotion";
import { MYBOLA } from "../design";
import { t, rm } from "./tokens";
import { Rise } from "../../../shared/motion/reveal";
import { ChatBubble } from "./ChatBubble";
import { ChatOmnibar } from "./ChatOmnibar";
import { PdfRoster } from "./PdfRoster";

// =============================================================================
// ChatMontage — the Pengurus Akademi capability montage (scene 2)
// =============================================================================
// Shared by the launch film and the scene1->2 review clip so there is ONE source
// of the steps + timing (no drift). A scripted transcript that plays through the
// AI's real capabilities: owner types a line -> processing -> reply lands, some
// steps attach a media bubble (snapped receipt, dropped PDF roster). Every action
// maps to a real tool in mybola_chat_agent/agent.py; copy is rule-faithful.

export type Step = {
  q: string; // owner's typed line
  a: string; // Pengurus Akademi reply
  time: string;
  media?: "receipt" | "roster";
};

export const STEPS: Step[] = [
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

// Per-step timing (frames): type -> send/process -> reply -> hold, then next.
export const STEP_TYPE = 22;
export const STEP_PROC = 24;
export const STEP_REPLY = 40;
export const STEP_HOLD = 8;
export const STEP_DUR = STEP_TYPE + STEP_PROC + STEP_REPLY + STEP_HOLD; // 94f

const dotsFor = (localFrame: number): string => ".".repeat((Math.floor(localFrame / 8) % 4));

// A snapped-receipt tile (owner sends a photo of a paper receipt).
export const ReceiptPhoto: React.FC = () => (
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
        <ChatBubble isMine sender="Anda" time={step.time} text="" bare><ReceiptPhoto /></ChatBubble>
      </div>
    )}
    {step.media === "roster" && (
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <ChatBubble isMine sender="Anda" time={step.time} text="" bare><PdfRoster /></ChatBubble>
      </div>
    )}
    <ChatBubble isMine={false} sender="Pengurus Akademi" time={step.time} text={step.a} maxWidth={288} />
  </>
);

// The montage. `startStep` lets a caller (the seamless transition) begin after
// step 0 has already been shown by the morph. `priorSteps` are rendered as fully-
// completed exchanges above the live one (so the transcript reads continuously).
export const ChatMontage: React.FC<{ startStep?: number; delay?: number }> = ({ startStep = 0, delay = 0 }) => {
  // `delay` lets a caller mount the montage early (to underlap a transition)
  // while its clock stays frozen at 0 until `delay` frames have passed — so the
  // settled step-0 transcript shows without advancing.
  const f = Math.max(0, useCurrentFrame() - delay);
  const stepsFromHere = STEPS.slice(startStep);
  const idx = Math.min(stepsFromHere.length - 1, Math.floor(f / STEP_DUR));
  const local = f - idx * STEP_DUR;

  const typing = local < STEP_TYPE;
  const processing = local >= STEP_TYPE && local < STEP_TYPE + STEP_PROC;
  const replied = local >= STEP_TYPE + STEP_PROC;
  const cur = stepsFromHere[idx];

  // Everything before the live step is complete: the steps skipped by startStep
  // (already shown, e.g. by the morph) plus steps done within this montage.
  const completed = STEPS.slice(0, startStep + idx);

  const omniValue = typing ? cur.q : "";

  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", background: MYBOLA.black, paddingTop: 44 }}>
      <div style={{ flex: 1, padding: 12, display: "flex", flexDirection: "column", justifyContent: "flex-end", gap: 10, overflow: "hidden" }}>
        {completed.map((s, i) => (
          <DoneStep key={i} step={s} />
        ))}
        {!typing && (
          <>
            <ChatBubble isMine sender="Anda" time={cur.time} text={cur.q} maxWidth={280} />
            {cur.media === "receipt" && (
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <ChatBubble isMine sender="Anda" time={cur.time} text="" bare><ReceiptPhoto /></ChatBubble>
              </div>
            )}
            {cur.media === "roster" && (
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <ChatBubble isMine sender="Anda" time={cur.time} text="" bare><PdfRoster /></ChatBubble>
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

// Total frames for a montage starting at `startStep`.
export const montageDur = (startStep = 0): number => (STEPS.length - startStep) * STEP_DUR;
