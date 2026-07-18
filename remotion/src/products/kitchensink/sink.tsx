import React from "react";
import { AbsoluteFill } from "remotion";
import { Rise, Stagger, CountUp, IrisWipe, ClipReveal } from "../../shared/motion/reveal";
import { LineDraw, Rule, Badge, Bracket } from "../../shared/motion/graphic";
import { Bar, Column, Ring, LineChart, Axis } from "../../shared/motion/data";
import { Emphasis, WordSwap, HighlightSweep, TrackingIn, LineMask } from "../../shared/motion/type-kinetic";
import { MarkDraw, Lockup, Resolve } from "../../shared/motion/logo";
import { Float, Breathe } from "../../shared/motion/ambient";

// Neutral placeholder palette — NOT a design language. Demo only.
const C = { bg: "#14161C", fg: "#F2F3F5", muted: "#8A8F98", accent: "#5B8CFF", track: "#262A34" };
const FONT = "'Plus Jakarta Sans', sans-serif";

const Panel: React.FC<{ children: React.ReactNode; title: string; delay: number }> = ({ children, title, delay }) => (
  <div style={{ background: "#1B1E27", borderRadius: 14, padding: 24, position: "relative", minHeight: 220, display: "flex", flexDirection: "column", gap: 14 }}>
    <Rise delay={delay}>
      <div style={{ fontFamily: FONT, fontSize: 20, fontWeight: 600, color: C.muted, letterSpacing: 2 }}>{title}</div>
    </Rise>
    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>{children}</div>
  </div>
);

export const KitchenSink: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg, padding: 48, fontFamily: FONT }}>
    <Rise delay={2}>
      <div style={{ fontFamily: FONT, fontSize: 40, fontWeight: 700, color: C.fg, marginBottom: 24 }}>
        Motion <Emphasis at={14} color={C.accent}>primitives</Emphasis>
      </div>
    </Rise>

    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, flex: 1 }}>
      {/* Kinetic type */}
      <Panel title="TYPE" delay={8}>
        <div style={{ color: C.fg, fontSize: 30, fontWeight: 700, textAlign: "center", lineHeight: 1.3 }}>
          <TrackingIn text="Launch" at={20} /><br />
          <HighlightSweep color={C.accent} at={40} under>ready</HighlightSweep>{" "}
          <WordSwap from="now" to="today" at={70} style={{ color: C.accent }} />
        </div>
      </Panel>

      {/* Data */}
      <Panel title="DATA" delay={10}>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <Ring value={0.72} color={C.accent} size={120} thickness={12} delay={24}>
            <CountUp to={72} delay={24} format={(n) => `${Math.round(n)}%`} style={{ color: C.fg, fontSize: 30, fontWeight: 700 }} />
          </Ring>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, width: 90 }}>
            <Bar value={0.9} color={C.accent} track={C.track} thickness={14} delay={30} />
            <Bar value={0.6} color={C.accent} track={C.track} thickness={14} delay={36} />
            <Bar value={0.75} color={C.accent} track={C.track} thickness={14} delay={42} />
          </div>
        </div>
      </Panel>

      {/* Graphic */}
      <Panel title="GRAPHIC" delay={12}>
        <div style={{ position: "relative", width: 160, height: 120 }}>
          <Bracket color={C.accent} delay={30} arm={26} />
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Badge bg={C.accent} fg="#FFF" delay={44}>NEW</Badge>
          </div>
        </div>
      </Panel>

      {/* Chart */}
      <Panel title="CHART" delay={14}>
        <div style={{ position: "relative", width: 200, height: 120 }}>
          <Axis color={C.muted} width={200} height={120} delay={28} />
          <LineChart points={[[0, 2], [1, 3], [2, 2.5], [3, 4], [4, 3.6], [5, 5]]} stroke={C.accent} fill="rgba(91,140,255,0.15)" width={200} height={120} delay={34} />
        </div>
      </Panel>

      {/* Columns */}
      <Panel title="COLUMNS" delay={16}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 12, height: 120 }}>
          {[0.5, 0.8, 0.65, 1, 0.75].map((v, i) => (
            <Column key={i} value={v} color={C.accent} track={C.track} thickness={22} length={120} delay={30 + i * 4} />
          ))}
        </div>
      </Panel>

      {/* Reveal shapes */}
      <Panel title="REVEAL" delay={18}>
        <div style={{ display: "flex", gap: 16 }}>
          <IrisWipe delay={40} duration={20}>
            <div style={{ width: 70, height: 70, borderRadius: 12, background: C.accent }} />
          </IrisWipe>
          <ClipReveal delay={50} from="left">
            <div style={{ width: 70, height: 70, borderRadius: 12, background: C.fg }} />
          </ClipReveal>
        </div>
      </Panel>

      {/* Line + rule */}
      <Panel title="LINE" delay={20}>
        <div style={{ width: 180 }}>
          <div style={{ height: 60 }}>
            <LineDraw d="M4 50 C30 10, 60 90, 96 30" stroke={C.accent} strokeWidth={3} delay={40} duration={26} />
          </div>
          <Rule color={C.muted} delay={54} />
        </div>
      </Panel>

      {/* Logo resolve + ambient */}
      <Panel title="LOGO" delay={22}>
        <Float amplitude={5}>
          <Breathe>
            <Resolve accent={<div style={{ width: 10, height: 10, borderRadius: 5, background: C.accent }} />} accentAt={70}>
              <Lockup
                markDelay={40}
                wordDelay={52}
                mark={<MarkDraw d="M50 8 L86 68 H14 Z" stroke={C.accent} size={70} strokeWidth={4} />}
                wordmark={<div style={{ color: C.fg, fontSize: 26, fontWeight: 700, letterSpacing: 3 }}>ACME</div>}
              />
            </Resolve>
          </Breathe>
        </Float>
      </Panel>
    </div>

    {/* Stagger + LineMask footer */}
    <div style={{ marginTop: 20 }}>
      <Stagger delay={30} step={3}>
        <span style={{ display: "inline-block", marginRight: 10, color: C.muted, fontSize: 18 }}>Rise</span>
        <span style={{ display: "inline-block", marginRight: 10, color: C.muted, fontSize: 18 }}>Stagger</span>
        <span style={{ display: "inline-block", marginRight: 10, color: C.muted, fontSize: 18 }}>CountUp</span>
      </Stagger>
      <div style={{ color: C.fg, fontSize: 22, fontWeight: 600, marginTop: 8 }}>
        <LineMask lines={["Every colour here is a placeholder —", "the primitives carry any design language."]} at={60} step={5} />
      </div>
    </div>
  </AbsoluteFill>
);
