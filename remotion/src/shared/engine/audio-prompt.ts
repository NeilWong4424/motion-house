// =============================================================================
// Music-generation prompt engine — style-agnostic, no synthesis.
// =============================================================================
// We do not produce audio locally. This turns a video's declarative `audio`
// brief (in VideoDef) + its real frame timings into a tool-agnostic music-
// generation PROMPT plus an ALIGNMENT PLAN, to feed a 3rd-party AI generator
// (ElevenLabs, DaVinci, Suno, Udio…). The returned track is then aligned so its
// biggest-energy moment lands on the cut's `payoff` frame.
//
// Pure + dependency-free (no React, no Remotion, no fs) so it runs anywhere: a
// CLI, a test, or the studio. Given the same VideoDef it always emits the same
// prompt.

import type { AudioBeat, AudioBrief, VideoDef } from "./types";

/** Hard cap for the paste-ready prompt block (generator style boxes are small). */
export const PROMPT_CHAR_LIMIT = 4000;

// The engine is GENRE-AGNOSTIC. It bakes in no register. What a beat sounds like
// comes from the PRODUCT, in this precedence:
//   1. beat.sound            — the beat's own words (highest)
//   2. brief.roleText[role]  — the product's per-role default, in its genre voice
//   3. GENERIC_ROLE fallback — role name only, so a bare brief still renders
// This minimal fallback is intentionally register-free ("the payoff", not "the
// drop / full drums"), so it never contradicts a calm OR an energetic cut. To
// sound good, a product supplies (1) or (2) — the engine never invents a genre.
const GENERIC_ROLE: Record<string, string> = {
  intro: "the opening",
  build: "developing / rising",
  riser: "tension gathering into the payoff",
  payoff: "the payoff — the single most important musical moment",
  sustain: "holding after the payoff",
  outro: "the ending",
};

/** The one payoff beat is the alignment target. `drop` is a legacy alias. */
const PAYOFF_ROLES = new Set(["payoff", "drop"]);

/** Resolve a beat's structure text: beat.sound > brief.roleText > generic. */
function beatText(beat: AudioBeat, brief: AudioBrief): string {
  return beat.sound ?? brief.roleText?.[beat.role] ?? GENERIC_ROLE[beat.role] ?? beat.role;
}

const fmtTime = (s: number): string => `${s.toFixed(2)}s`;

/** A beat with its resolved start/end time and duration share of the cut. */
type Section = {
  beat: AudioBeat;
  start: number;
  end: number;
  pct: number; // share of total duration, 0..100
};

/** Resolve a video's audio beats into timed sections (seconds + % of cut). */
export function sections(video: VideoDef): Section[] {
  const fps = video.fps ?? 30;
  const total = video.durationInFrames / fps;
  const beats = [...(video.audio?.beats ?? [])].sort((a, b) => a.frame - b.frame);
  return beats.map((beat, i) => {
    const start = beat.frame / fps;
    const end = i + 1 < beats.length ? beats[i + 1].frame / fps : total;
    return { beat, start, end, pct: ((end - start) / total) * 100 };
  });
}

/** The payoff beat (the alignment target), or null if the brief declares none. */
export function payoffSection(video: VideoDef): Section | null {
  return sections(video).find((s) => PAYOFF_ROLES.has(s.beat.role)) ?? null;
}

/**
 * The paste-ready prompt block: the ONLY text a generator sees. Self-contained
 * and kept under PROMPT_CHAR_LIMIT. Collapses consecutive same-role beats so the
 * structure list stays compact (the old per-beat list bloated long cuts).
 */
export function promptBlock(video: VideoDef): string {
  const brief = video.audio;
  if (!brief) {
    throw new Error(`Video "${video.id}" has no audio brief; nothing to generate.`);
  }
  const fps = video.fps ?? 30;
  const total = video.durationInFrames / fps;
  const tail = 3;

  // Collapse runs of the same role+text into one % band so the list stays compact.
  const secs = sections(video);
  const bands: { role: string; text: string; a: number; b: number }[] = [];
  for (const s of secs) {
    const a = Math.round((s.start / total) * 100);
    const b = Math.round((s.end / total) * 100);
    const text = beatText(s.beat, brief);
    const last = bands[bands.length - 1];
    // merge only when both role AND text match (per-beat `sound` stays distinct)
    if (last && last.role === s.beat.role && last.text === text) last.b = b;
    else bands.push({ role: s.beat.role, text, a, b });
  }
  const structure = bands
    .map((x) => `- ${x.a}-${x.b}%, ${cap(x.role)}: ${x.text}`)
    .join("\n");

  const exclude =
    brief.exclude ??
    "No vocals, no lyrics. No lo-fi. No fade-out ending. No genre drift mid-track.";

  const dyn =
    brief.dynamics ??
    "Wide dynamic range: a genuinely sparse intro so the payoff lands with contrast. Leave headroom, do not brickwall.";

  const block = `Instrumental music track for a ${fmtTime(total)} film. Structure to these proportions of the track:
${structure}

STYLE: ${brief.style}
INSTRUMENTATION: ${brief.instrumentation}
TEMPO & KEY: ${brief.tempoKey}
HOOK: ${brief.hook}
DYNAMICS: ${dyn}
DO NOT INCLUDE: ${exclude}
LENGTH: at least ${Math.ceil(total + tail)}s (instrumental).`;

  if (block.length > PROMPT_CHAR_LIMIT) {
    throw new Error(
      `Prompt for "${video.id}" is ${block.length} chars, over the ${PROMPT_CHAR_LIMIT} limit. ` +
        `Shorten the brief's style/instrumentation/hook/exclude fields.`,
    );
  }
  return block;
}

/**
 * The full PROMPT.md file: the paste-ready block FIRST (what you give the
 * generator), then reference material (cut table + alignment plan) that is NOT
 * part of the prompt. Throws if the video has no audio brief.
 */
export function buildPrompt(video: VideoDef): string {
  const brief = video.audio!; // promptBlock throws if missing
  const fps = video.fps ?? 30;
  const total = video.durationInFrames / fps;
  const secs = sections(video);
  const payoff = payoffSection(video);

  const block = promptBlock(video);

  const cutTable = secs
    .map((s) => {
      const label = s.beat.label ?? s.beat.role;
      return `| ${fmtTime(s.start)}–${fmtTime(s.end)} | ${label} | ${s.beat.role} |`;
    })
    .join("\n");

  const stinger = brief.stingerFrame != null ? brief.stingerFrame / fps : null;
  const alignment = [
    payoff && `- \`payoff_at\` = **${fmtTime(payoff.start)}** (frame ${payoff.beat.frame}) — the track's biggest-energy moment must land here.`,
    (() => {
      const r = secs.find((s) => s.beat.role === "riser");
      return r && `- \`riser_from\` = **${fmtTime(r.start)}** (frame ${r.beat.frame}) — riser/tension begins here.`;
    })(),
    (() => {
      const o = secs.find((s) => s.beat.role === "outro");
      return o && `- \`outro_at\` = **${fmtTime(o.start)}** (frame ${o.beat.frame}) — resolve into the outro here.`;
    })(),
    stinger != null && `- \`stinger_at\` = **${fmtTime(stinger)}** (frame ${brief.stingerFrame}) — the closing hit lands here.`,
    `- \`total\` = **${fmtTime(total)}** cut; aligned stem ~${fmtTime(total + 0.5)} (cover + tail), never end early.`,
  ]
    .filter(Boolean)
    .join("\n");

  return `# Music-generation prompt — ${video.id}

> GENERATED by \`engine/audio-prompt.ts\` from this video's \`audio\` brief + real
> frame timings. The engine is genre-agnostic — the sound below is the product's
> own. Do not hand-edit; change the brief and re-run \`npm run audio:prompt ${video.id}\`.

Locked cut: ${video.durationInFrames}f / ${fmtTime(total)} @ ${fps}fps.

## >> PASTE THIS INTO THE GENERATOR (${block.length}/${PROMPT_CHAR_LIMIT} chars)

\`\`\`
${block}
\`\`\`

---

## Reference — NOT part of the prompt (for alignment/QC only)

**The cut we're scoring:**

| Time | Beat | Role |
|------|------|------|
${cutTable}

**Alignment plan** (target timestamps in OUR cut):

${alignment}

Alignment (a product-side step): find the returned track's biggest-energy moment,
time-shift it onto \`payoff_at\` (never pitch-shift), and pad/trim to cover the full
cut. Then mux + verify the sound-designer's numeric gates.
${brief.sfxNotes ? `\n**SFX stay synthesized** (not generated): ${brief.sfxNotes}` : ""}
`;
}

function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
