import React from "react";
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame } from "remotion";
import { defineVideo, LANDSCAPE } from "../../../shared/engine/types";
import { useDesignFonts } from "../../../shared/design/fonts";
import { CountUp, Rise, TextReveal } from "../../../shared/motion/reveal";
import { EASE } from "../../../shared/motion/easing";
import { worldcupDesign as D } from "../design";
import { Body, Chip, Display, Kicker, Pitch } from "../ui/stage";

// =============================================================================
// The 2026 World Cup format — 93s, landscape.
// =============================================================================
// One message: 24 teams qualify from the groups, but the Round of 32 needs 32 —
// so the 8 best third-placed teams fill the gap. Every other beat exists to set
// that up (scenes 1-5) or pay it off (scenes 6-9).
//
// The turn is scene 6, where lime first appears. See design.ts: lime ONLY ever
// marks a third-placed team.

// The one fact I could not source. Confirm before shipping — see delivery notes.
const FINAL = "July 19, 2026 · MetLife Stadium, New Jersey";

const GROUPS = 12;
const PER_GROUP = 4;
const GROUP_LETTERS = "ABCDEFGHIJKL".split("");

// ---------------------------------------------------------------------------
// Shared geometry. The grid and the bracket are the film's two stages, and a
// chip must land in the SAME pixel across a cut or the eye loses the object.
// ---------------------------------------------------------------------------
// The grid is vertically centred in the 1080 frame: 4 rows * 74 = 296, so a top
// of 392 leaves the block sitting on the optical centre with the headline above
// and the counter below. Earlier versions clustered it at y=268 over 500px of
// dead space — the exact failure docs/03-motion-craft.md calls out.
const GRID = { x: 210, y: 392, colW: 128, rowH: 74, chipW: 108, chipH: 52 };
const gridPos = (g: number, r: number) => ({
  left: GRID.x + g * GRID.colW,
  top: GRID.y + r * GRID.rowH,
});

// Two columns of 16. Column 1 = the 12 group winners + the first 4 runners-up;
// column 2 = the remaining 8 runners-up, then the 8 third-place slots. That last
// block is what sits empty in scene 5 and fills with lime in scene 8 — keeping
// the eight contiguous at the column's foot is what makes the payoff parse.
const BRACKET = { x: 1150, y: 250, rowH: 30, chipW: 158, chipH: 24, gap: 5 };
const slotPos = (i: number) => ({
  left: BRACKET.x + (i >= 16 ? BRACKET.chipW + 54 : 0),
  top: BRACKET.y + (i % 16) * (BRACKET.rowH + BRACKET.gap),
});
/** Slot label by index: 12 firsts, 12 seconds, then the 8 third-place places. */
const slotLabel = (i: number) => (i < 12 ? "1st" : i < 24 ? "2nd" : "3rd");

/** Scene-level fade. Hard cuts everywhere else — see craft doc on transitions. */
const Scene: React.FC<{ children: React.ReactNode; black?: boolean }> = ({ children, black }) => (
  <Pitch black={black}>{children}</Pitch>
);

// ---------------------------------------------------------------------------
// 1 — 0-150 (5.0s). "2026" / "48 teams."
// ---------------------------------------------------------------------------
const Opening: React.FC = () => (
  <Scene black>
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <TextReveal
        text="2026"
        by="char"
        step={4}
        preset="weighty"
        distance={34}
        style={{
          fontFamily: `'${D.type.display.family}', ${D.type.display.fallback}`,
          fontSize: 260,
          fontWeight: 700,
          color: D.palette.fg,
          letterSpacing: "-0.05em",
        }}
      />
      {/* Delay via Rise, never a nested Sequence: Sequence renders an
          AbsoluteFill, which escapes this centering flex and pins content to the
          frame's top-left corner. */}
      <Rise delay={54} distance={22} preset="crisp">
        <Body size={38} colour={D.palette.muted} style={{ marginTop: 26, textAlign: "center" }}>
          48 teams.
        </Body>
      </Rise>
    </AbsoluteFill>
  </Scene>
);

// ---------------------------------------------------------------------------
// 2 — 150-420 (9.0s). Three nations, sixteen cities, 104 matches.
// ---------------------------------------------------------------------------
// Abstract landmasses: this is a diagram, not a map. Accurate enough to read as
// North America, never precise enough to assert a border.
const LANDS = [
  { d: "M 96 34 L 300 20 L 372 74 L 356 150 L 150 168 L 74 108 Z", label: "CANADA" },
  { d: "M 116 176 L 352 158 L 392 236 L 330 318 L 168 308 L 92 236 Z", label: "UNITED STATES" },
  { d: "M 186 322 L 300 330 L 322 404 L 236 438 L 178 386 Z", label: "MEXICO" },
];
// 16 host cities as dots. Positions are illustrative placements on the diagram,
// not surveyed coordinates.
const CITIES = [
  [150, 96], [232, 72], [318, 92],
  [140, 214], [196, 190], [252, 210], [312, 186], [356, 226],
  [166, 262], [224, 274], [286, 258], [340, 282], [206, 300],
  [212, 356], [268, 372], [296, 406],
];

const Nations: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <Scene>
      <AbsoluteFill style={{ flexDirection: "row", alignItems: "center" }}>
        <div style={{ paddingLeft: 130, width: 700 }}>
          <Rise delay={4} preset="crisp">
            <Kicker>Host nations</Kicker>
          </Rise>
          <div style={{ marginTop: 26 }}>
            <TextReveal
              text={"Three nations.\nSixteen cities.\n104 matches."}
              by="line"
              step={5}
              delay={12}
              preset="crisp"
              distance={26}
              style={{
                fontFamily: `'${D.type.display.family}', ${D.type.display.fallback}`,
                fontSize: 78,
                fontWeight: 700,
                color: D.palette.fg,
                letterSpacing: "-0.035em",
                lineHeight: 1.14,
              }}
            />
          </div>
        </div>

        <div style={{ position: "relative", width: 760, height: 760, marginLeft: 60 }}>
          <svg width={760} height={760} viewBox="0 0 470 470" style={{ position: "absolute" }}>
            {LANDS.map((l, i) => {
              const s = interpolate(frame, [10 + i * 6, 34 + i * 6], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: EASE.easeOutQuart,
              });
              return (
                <path
                  key={l.label}
                  d={l.d}
                  fill={`rgba(242,245,239,${0.05 * s})`}
                  stroke={`rgba(242,245,239,${0.2 * s})`}
                  strokeWidth={1.5}
                />
              );
            })}
            {CITIES.map(([cx, cy], i) => {
              const s = interpolate(frame, [56 + i * 3, 74 + i * 3], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: EASE.easeOutQuart,
              });
              return (
                <circle key={i} cx={cx} cy={cy} r={4.5 * s} fill={D.palette.fg} opacity={0.9 * s} />
              );
            })}
          </svg>
        </div>
      </AbsoluteFill>
    </Scene>
  );
};

// ---------------------------------------------------------------------------
// 3 — 420-750 (11.0s). Twelve groups of four.
// ---------------------------------------------------------------------------
const GroupGrid: React.FC<{
  /** Row index (0-3) -> state. Lets scenes 3/4/6 share one grid. */
  stateFor?: (g: number, r: number) => "neutral" | "dim" | "lime";
  /** Per-chip entrance, or null for "already there" (scenes 4 and 6). */
  entranceDelay?: ((g: number, r: number) => number) | null;
  hidden?: (g: number, r: number) => boolean;
}> = ({ stateFor = () => "neutral", entranceDelay = null, hidden }) => (
  <>
    {Array.from({ length: GROUPS }).flatMap((_, g) =>
      Array.from({ length: PER_GROUP }).map((__, r) => {
        if (hidden?.(g, r)) return null;
        const p = gridPos(g, r);
        const chip = (
          <Chip
            label={`${GROUP_LETTERS[g]}${r + 1}`}
            state={stateFor(g, r)}
            w={GRID.chipW}
            h={GRID.chipH}
          />
        );
        return (
          <div key={`${g}-${r}`} style={{ position: "absolute", ...p }}>
            {entranceDelay ? (
              <Rise delay={entranceDelay(g, r)} distance={22} preset="crisp">
                {chip}
              </Rise>
            ) : (
              chip
            )}
          </div>
        );
      })
    )}
    {Array.from({ length: GROUPS }).map((_, g) => (
      <div
        key={`h-${g}`}
        style={{
          position: "absolute",
          left: gridPos(g, 0).left,
          top: GRID.y - 44,
          width: GRID.chipW,
          textAlign: "center",
        }}
      >
        <Kicker style={{ fontSize: 16, letterSpacing: "0.2em" }}>{GROUP_LETTERS[g]}</Kicker>
      </div>
    ))}
  </>
);

const Groups: React.FC = () => (
  <Scene>
    <AbsoluteFill>
      <div style={{ position: "absolute", left: GRID.x, top: 232 }}>
        <Rise delay={2} preset="crisp">
          <Display size={72}>Twelve groups of four.</Display>
        </Rise>
      </div>
      <GroupGrid entranceDelay={(g, r) => 16 + g * 3 + r * 2} />
      <div style={{ position: "absolute", left: GRID.x, top: GRID.y + PER_GROUP * GRID.rowH + 46 }}>
        <Rise delay={70} preset="crisp" distance={16}>
          <Body size={28}>Forty-eight teams.</Body>
        </Rise>
      </div>
    </AbsoluteFill>
  </Scene>
);

// ---------------------------------------------------------------------------
// 4 — 750-1080 (11.0s). Top two go through. The setup: 24.
// ---------------------------------------------------------------------------
// The grid does NOT re-enter — it was already assembled in scene 3, so the cut
// is seamless and the only move is the dimming. One thing moves at a time.
const TopTwo: React.FC = () => {
  const frame = useCurrentFrame();
  const dim = interpolate(frame, [18, 46], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.easeOutQuart,
  });
  return (
    <Scene>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: GRID.x, top: 232 }}>
          <Display size={72}>Top two go through.</Display>
        </div>
        {Array.from({ length: GROUPS }).flatMap((_, g) =>
          Array.from({ length: PER_GROUP }).map((__, r) => {
            const p = gridPos(g, r);
            const isThrough = r < 2;
            return (
              <div
                key={`${g}-${r}`}
                style={{
                  position: "absolute",
                  ...p,
                  opacity: isThrough ? 1 : interpolate(dim, [0, 1], [1, 0.32]),
                }}
              >
                <Chip
                  label={`${GROUP_LETTERS[g]}${r + 1}`}
                  state={isThrough ? "neutral" : dim > 0.5 ? "dim" : "neutral"}
                  w={GRID.chipW}
                  h={GRID.chipH}
                />
              </div>
            );
          })
        )}
        {Array.from({ length: GROUPS }).map((_, g) => (
          <div
            key={`h-${g}`}
            style={{
              position: "absolute",
              left: gridPos(g, 0).left,
              top: GRID.y - 44,
              width: GRID.chipW,
              textAlign: "center",
            }}
          >
            <Kicker style={{ fontSize: 16, letterSpacing: "0.2em" }}>{GROUP_LETTERS[g]}</Kicker>
          </div>
        ))}

        <div
          style={{
            position: "absolute",
            left: GRID.x,
            top: GRID.y + PER_GROUP * GRID.rowH + 40,
          }}
        >
          <Rise delay={44} preset="crisp" distance={18}>
            {/* whiteSpace:nowrap — without it the flex row collapses and the
                caption wraps under the numeral. */}
            <div style={{ display: "flex", alignItems: "baseline", gap: 20, whiteSpace: "nowrap" }}>
              <CountUp
                to={24}
                duration={34}
                delay={46}
                ease="easeOutExpo"
                style={{
                  fontFamily: `'${D.type.display.family}', ${D.type.display.fallback}`,
                  fontSize: 116,
                  fontWeight: 700,
                  color: D.palette.fg,
                  letterSpacing: "-0.05em",
                  lineHeight: 1,
                }}
              />
              <Body size={32}>teams qualified.</Body>
            </div>
          </Rise>
        </div>
      </AbsoluteFill>
    </Scene>
  );
};

// ---------------------------------------------------------------------------
// 5 — 1080-1410 (11.0s). The problem: the Round of 32 needs 32.
// ---------------------------------------------------------------------------
// This is the film. It ends on eight EMPTY slots and holds there — the viewer
// does the arithmetic themselves, so scene 6 answers a question they're already
// asking. Do not speed this up.
const BracketColumn: React.FC<{
  filled: number;
  limeFrom?: number;
  fillDelay?: (i: number) => number;
  pulseEmpty?: boolean;
}> = ({ filled, limeFrom = 32, fillDelay, pulseEmpty = false }) => {
  const frame = useCurrentFrame();
  const pulse = pulseEmpty
    ? 0.5 + 0.5 * Math.sin(interpolate(frame, [0, 60], [0, Math.PI * 2]))
    : 0;
  return (
    <>
      {Array.from({ length: 32 }).map((_, i) => {
        const p = slotPos(i);
        const isFilled = i < filled;
        const isLime = i >= limeFrom;
        const chip = (
          <Chip
            label={isFilled ? slotLabel(i) : undefined}
            state={isFilled ? (isLime ? "lime" : "neutral") : "empty"}
            w={BRACKET.chipW}
            h={BRACKET.chipH}
            style={
              !isFilled && pulseEmpty
                ? { borderColor: `rgba(242,245,239,${0.18 + 0.34 * pulse})` }
                : undefined
            }
          />
        );
        return (
          <div key={i} style={{ position: "absolute", ...p }}>
            {isFilled && fillDelay ? (
              <Rise delay={fillDelay(i)} distance={14} preset="crisp">
                {chip}
              </Rise>
            ) : (
              chip
            )}
          </div>
        );
      })}
    </>
  );
};

const Problem: React.FC = () => (
  <Scene>
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 130, top: 348, width: 900 }}>
        <Rise delay={2} preset="crisp">
          <Kicker>The problem</Kicker>
        </Rise>
        <div style={{ marginTop: 28 }}>
          <TextReveal
            text={"But the Round of 32\nneeds 32."}
            by="line"
            step={6}
            delay={10}
            preset="weighty"
            distance={28}
            style={{
              fontFamily: `'${D.type.display.family}', ${D.type.display.fallback}`,
              fontSize: 92,
              fontWeight: 700,
              color: D.palette.fg,
              letterSpacing: "-0.04em",
              lineHeight: 1.08,
            }}
          />
        </div>
        <div style={{ marginTop: 34 }}>
          <Rise delay={96} preset="crisp" distance={16}>
            <Body size={30}>Eight places short.</Body>
          </Rise>
        </div>
      </div>
      <BracketColumn filled={24} fillDelay={(i) => 20 + i * 2} pulseEmpty />
      <div style={{ position: "absolute", left: BRACKET.x, top: BRACKET.y - 44 }}>
        <Kicker style={{ fontSize: 16 }}>Round of 32</Kicker>
      </div>
    </AbsoluteFill>
  </Scene>
);

// ---------------------------------------------------------------------------
// 6 — 1410-1800 (13.0s). THE TURN. First lime.
// ---------------------------------------------------------------------------
// Row 3 lifts out of the grid; 8 turn lime, 4 fall away. Longest scene in the
// film because it's the answer — confidence is holding.
const Thirds: React.FC = () => {
  const frame = useCurrentFrame();
  // The 4 groups whose third-placed team misses out. Arbitrary but fixed.
  const OUT = new Set([2, 5, 8, 11]);
  const lift = interpolate(frame, [24, 58], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.easeOutQuart,
  });
  const decide = interpolate(frame, [72, 96], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.easeOutQuart,
  });
  // Pull the third-place row DOWN and clear of the grid, not up: rows 1-2 are
  // still on screen above it, so lifting upward lands the chips on top of them
  // (that shipped as a visible overlap). Below the grid there's open space, and
  // separating the twelve from the block they came out of is the whole point of
  // the move.
  const LIFT_Y = GRID.rowH + 52;
  return (
    <Scene>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: GRID.x, top: 232 }}>
          <Display size={72}>The 8 best third-placed teams.</Display>
        </div>

        {Array.from({ length: GROUPS }).flatMap((_, g) =>
          Array.from({ length: PER_GROUP }).map((__, r) => {
            const p = gridPos(g, r);
            const isThird = r === 2;
            const out = OUT.has(g);
            // Non-third rows stay exactly where scene 4 left them — except row 4,
            // which fades out to clear the space the lifted row moves into.
            if (!isThird) {
              const isFourth = r === 3;
              const base = r < 2 ? 1 : 0.32;
              return (
                <div
                  key={`${g}-${r}`}
                  style={{
                    position: "absolute",
                    ...p,
                    opacity: isFourth ? base * (1 - lift) : base,
                  }}
                >
                  <Chip
                    label={`${GROUP_LETTERS[g]}${r + 1}`}
                    state={r < 2 ? "neutral" : "dim"}
                    w={GRID.chipW}
                    h={GRID.chipH}
                  />
                </div>
              );
            }
            const limeNow = !out && decide > 0.4;
            return (
              <div
                key={`${g}-${r}`}
                style={{
                  position: "absolute",
                  ...p,
                  transform: `translateY(${lift * LIFT_Y}px)`,
                  // The four that miss out stay VISIBLE, just dim. Fading them to
                  // 0.08 made the shot read as "eight teams" when the whole point
                  // is "twelve, of which eight" — you can't see a selection if the
                  // rejected options disappear.
                  opacity: out ? interpolate(decide, [0, 1], [1, 0.45]) : 1,
                }}
              >
                <Chip
                  label={`${GROUP_LETTERS[g]}3`}
                  state={limeNow ? "lime" : out && decide > 0.4 ? "dim" : "neutral"}
                  w={GRID.chipW}
                  h={GRID.chipH}
                />
              </div>
            );
          })
        )}

        <div
          style={{
            position: "absolute",
            left: GRID.x,
            top: GRID.y + PER_GROUP * GRID.rowH + 78,
          }}
        >
          <Rise delay={104} preset="crisp" distance={18}>
            <Body size={30}>Twelve finish third. The best eight go on.</Body>
          </Rise>
        </div>
      </AbsoluteFill>
    </Scene>
  );
};

// ---------------------------------------------------------------------------
// 7 — 1800-2100 (10.0s). Ranked, with the cut line between 8th and 9th.
// ---------------------------------------------------------------------------
const Ranked: React.FC = () => {
  const frame = useCurrentFrame();
  const ROWS = 12;
  const rowH = 54;
  // 12 rows * 54 = 648; a top of 216 centres the list in the 1080 frame.
  const top = 216;
  const left = 760;
  const sort = interpolate(frame, [10, 44], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.easeInOutQuint,
  });
  const line = interpolate(frame, [56, 76], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.easeOutQuart,
  });
  // Where each chip starts (scrambled) vs where it lands (ranked).
  const START = [4, 9, 1, 11, 6, 0, 8, 3, 10, 2, 7, 5];
  return (
    <Scene>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: 130, top: 400, width: 560 }}>
          <Rise delay={2} preset="crisp">
            <Kicker>The tiebreak</Kicker>
          </Rise>
          <div style={{ marginTop: 26 }}>
            <TextReveal
              text={"Ranked by points,\nthen goal difference."}
              by="line"
              step={5}
              delay={8}
              preset="crisp"
              distance={24}
              style={{
                fontFamily: `'${D.type.display.family}', ${D.type.display.fallback}`,
                fontSize: 62,
                fontWeight: 700,
                color: D.palette.fg,
                letterSpacing: "-0.035em",
                lineHeight: 1.12,
              }}
            />
          </div>
        </div>

        {Array.from({ length: ROWS }).map((_, i) => {
          const from = START[i];
          const y = top + interpolate(sort, [0, 1], [from * rowH, i * rowH]);
          const qualifies = i < 8;
          return (
            <div key={i} style={{ position: "absolute", left, top: y, display: "flex", alignItems: "center", gap: 18 }}>
              <div
                style={{
                  fontFamily: `'${D.type.display.family}', ${D.type.display.fallback}`,
                  fontSize: 17,
                  fontWeight: 600,
                  color: D.palette.muted,
                  width: 26,
                  textAlign: "right",
                }}
              >
                {i + 1}
              </div>
              <Chip
                label={`${GROUP_LETTERS[from]}3`}
                state={sort > 0.85 && !qualifies ? "dim" : "lime"}
                w={132}
                h={40}
              />
            </div>
          );
        })}

        {/* The cut line — bone, never lime. Lime marks teams, not rules. */}
        <div
          style={{
            position: "absolute",
            left: left - 14,
            top: top + 8 * rowH - 7,
            width: interpolate(line, [0, 1], [0, 320]),
            height: 2,
            background: D.palette.fg,
            opacity: 0.85,
          }}
        />
        <div style={{ position: "absolute", left: left + 318, top: top + 8 * rowH - 20, opacity: line }}>
          <Kicker style={{ fontSize: 14, letterSpacing: "0.22em" }}>Cut</Kicker>
        </div>
      </AbsoluteFill>
    </Scene>
  );
};

// ---------------------------------------------------------------------------
// 8 — 2100-2430 (11.0s). Payoff: the 8 fill the empty slots.
// ---------------------------------------------------------------------------
const Payoff: React.FC = () => (
  <Scene>
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 130, top: 348, width: 900 }}>
        <Rise delay={2} preset="crisp">
          <Kicker>Complete</Kicker>
        </Rise>
        <div style={{ marginTop: 28 }}>
          <TextReveal
            text={"32 teams.\nThe Round of 32."}
            by="line"
            step={6}
            delay={10}
            preset="weighty"
            distance={28}
            style={{
              fontFamily: `'${D.type.display.family}', ${D.type.display.fallback}`,
              fontSize: 92,
              fontWeight: 700,
              color: D.palette.fg,
              letterSpacing: "-0.04em",
              lineHeight: 1.08,
            }}
          />
        </div>
        <div style={{ marginTop: 34 }}>
          <Rise delay={100} preset="crisp" distance={16}>
            <Body size={30}>24 from the groups. 8 from third place.</Body>
          </Rise>
        </div>
      </div>
      <BracketColumn filled={32} limeFrom={24} fillDelay={(i) => (i >= 24 ? 26 + (i - 24) * 4 : 0)} />
      <div style={{ position: "absolute", left: BRACKET.x, top: BRACKET.y - 44 }}>
        <Kicker style={{ fontSize: 16 }}>Round of 32</Kicker>
      </div>
    </AbsoluteFill>
  </Scene>
);

// ---------------------------------------------------------------------------
// 9 — 2430-2670 (8.0s). Five rounds collapse to one.
// ---------------------------------------------------------------------------
const Collapse: React.FC = () => {
  const frame = useCurrentFrame();
  const ROUNDS = [32, 16, 8, 4, 2, 1];
  const LABELS = ["Round of 32", "Round of 16", "Quarters", "Semis", "Final", "Champion"];
  // 6 columns * 252 = 1512, leaving 1920-1512-176 -> x0 208 keeps the champion
  // slot inside the frame's right third rather than stranded at the edge.
  const colW = 252;
  const x0 = 208;
  return (
    <Scene>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: 130, top: 150 }}>
          <Rise delay={2} preset="crisp">
            <Display size={62}>Five rounds. One trophy.</Display>
          </Rise>
        </div>
        {ROUNDS.map((n, ri) => {
          const appear = interpolate(frame, [18 + ri * 16, 38 + ri * 16], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: EASE.easeOutQuart,
          });
          const h = 560;
          const slotH = Math.min(16, h / n - 4);
          const isTrophy = ri === 5;
          return (
            <div key={ri}>
              {Array.from({ length: n }).map((__, i) => {
                const y = 330 + (i + 0.5) * (h / n) - slotH / 2;
                return (
                  <div
                    key={i}
                    style={{
                      position: "absolute",
                      left: x0 + ri * colW,
                      top: y,
                      width: interpolate(appear, [0, 1], [0, isTrophy ? 176 : 156]),
                      height: isTrophy ? 24 : slotH,
                      borderRadius: 4,
                      // Slots must read against the pitch: surface alone is only a
                      // few percent off bg and rendered as an invisible smear.
                      background: isTrophy ? D.palette.fg : "rgba(242,245,239,0.14)",
                      border: isTrophy ? "none" : `1px solid rgba(242,245,239,0.24)`,
                      opacity: appear,
                      boxShadow: isTrophy ? `0 0 60px rgba(242,245,239,0.22)` : "none",
                    }}
                  />
                );
              })}
              <div style={{ position: "absolute", left: x0 + ri * colW, top: 286, opacity: appear * 0.9 }}>
                <Kicker style={{ fontSize: 13, letterSpacing: "0.18em" }}>{LABELS[ri]}</Kicker>
              </div>
            </div>
          );
        })}
      </AbsoluteFill>
    </Scene>
  );
};

// ---------------------------------------------------------------------------
// 10 — 2670-2790 (4.0s). The close.
// ---------------------------------------------------------------------------
const Close: React.FC = () => (
  <Scene black>
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <Rise delay={4} preset="crisp" distance={20}>
        <Display size={64} style={{ textAlign: "center" }}>
          The Final
        </Display>
      </Rise>
      {/* No lime rule here. An earlier pass put an accent underline under this
          headline; on screen it was pure decoration, and design.ts is explicit
          that lime only ever marks a third-placed team. The film's last lime is
          the eight chips landing in the bracket — that's where it should end. */}
      <div style={{ height: 30 }} />
      <Rise delay={18} preset="crisp" distance={14}>
        <Body size={26} style={{ textAlign: "center" }}>
          {FINAL}
        </Body>
      </Rise>
    </AbsoluteFill>
  </Scene>
);

// ---------------------------------------------------------------------------
// Assembly. Frames match the agreed storyboard exactly.
// ---------------------------------------------------------------------------
const SCENES: [React.FC, number, number][] = [
  [Opening, 0, 150],
  [Nations, 150, 270],
  [Groups, 420, 330],
  [TopTwo, 750, 330],
  [Problem, 1080, 330],
  [Thirds, 1410, 390],
  [Ranked, 1800, 300],
  [Payoff, 2100, 330],
  [Collapse, 2430, 240],
  [Close, 2670, 120],
];

const WorldCupFormat: React.FC = () => {
  useDesignFonts(D);
  return (
    <AbsoluteFill style={{ background: D.palette.bg }}>
      {SCENES.map(([C, from, dur], i) => (
        <Sequence key={i} from={from} durationInFrames={dur}>
          <C />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

export const worldcupFormat = defineVideo({
  id: "WorldCup2026Format",
  component: WorldCupFormat,
  durationInFrames: 2790,
  ...LANDSCAPE,
});
