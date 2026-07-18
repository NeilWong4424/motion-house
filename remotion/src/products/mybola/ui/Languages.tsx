import React from "react";
import { interpolate } from "remotion";
import { MYBOLA } from "../design";
import { familyOf } from "../../../shared/design/types";
import { mybola } from "../design";
import { useEnter } from "../../../shared/motion/reveal";

// =============================================================================
// Languages — "Balas dalam bahasa pelanggan"
// =============================================================================
// True product behavior: the customer AI (concierge) replies in whatever language
// the customer wrote in — there is NO fixed supported-languages list. So this beat
// shows example customer greetings in a few scripts each getting a natural reply,
// not a checklist. Each pair fades up on a stagger.

const FONT = familyOf(mybola.type.body);

// Greeting -> the academy's reply, in the same language. Faithful, generic.
const PAIRS: { q: string; a: string }[] = [
  { q: "Assalamualaikum, ada kelas bola?", a: "Waalaikumsalam! Ada, boleh saya bantu daftar?" },
  { q: "Hi, do you have weekend sessions?", a: "Yes! Saturday 9am — want me to book a spot?" },
  { q: "请问有试训课吗?", a: "有的!我帮您安排一堂试训好吗?" },
];

const Pair: React.FC<{ q: string; a: string; delay: number }> = ({ q, a, delay }) => {
  const p = useEnter(delay, "settle");
  const y = interpolate(p, [0, 1], [18, 0]);
  return (
    <div style={{ opacity: p, transform: `translateY(${y}px)`, display: "flex", flexDirection: "column", gap: 8, width: 320 }}>
      {/* Customer greeting (incoming, left). */}
      <div style={{ alignSelf: "flex-start", maxWidth: 260, background: "rgba(0,145,255,0.2)", borderRadius: "12px 12px 12px 4px", padding: "9px 11px" }}>
        <span style={{ fontFamily: FONT, fontSize: 15, lineHeight: "20px", color: MYBOLA.white }}>{q}</span>
      </div>
      {/* Academy reply (outgoing, right). */}
      <div style={{ alignSelf: "flex-end", maxWidth: 260, background: MYBOLA.secondary, borderRadius: "12px 12px 4px 12px", padding: "9px 11px" }}>
        <span style={{ fontFamily: FONT, fontSize: 15, lineHeight: "20px", color: MYBOLA.white }}>{a}</span>
      </div>
    </div>
  );
};

export const Languages: React.FC<{ startDelay?: number; stagger?: number }> = ({ startDelay = 0, stagger = 12 }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 18, alignItems: "center" }}>
    {PAIRS.map((pr, i) => (
      <Pair key={i} q={pr.q} a={pr.a} delay={startDelay + i * stagger} />
    ))}
  </div>
);
