import React from "react";

// =============================================================================
// Audio brief — declarative sound direction for a video.
// =============================================================================
// We no longer synthesize music locally. Each video declares WHAT it should sound
// like and WHERE its beats fall (in frames); the shared prompt engine
// (engine/audio-prompt.ts) turns this into a tool-agnostic music-generation prompt
// to feed a 3rd-party AI generator (ElevenLabs, DaVinci, Suno, Udio…). The
// returned track is then aligned to `drop` frame-exact. This type carries NO
// synthesis — only intent + timing.

/** One structural beat of the cut, in frames, with the musical role it plays. */
export type AudioBeat = {
  /** Frame this beat starts on (from the composition's own scene table). */
  frame: number;
  /** What the music should be doing here. Drives the prompt's structure list. */
  role:
    | "intro" // sparse, anticipatory — before the energy
    | "build" // energy climbing
    | "riser" // tension / pull-back-then-rise into the drop
    | "drop" // THE payoff — the biggest, most euphoric moment (exactly one)
    | "sustain" // hold the energy after the drop
    | "outro"; // resolve; end on a hit
  /** Optional human label for the prompt table (e.g. "ColdOpen (48 NATIONS)"). */
  label?: string;
};

/** Declarative sound direction the prompt engine reads. No synthesis here. */
export type AudioBrief = {
  /** One-line style: genre + energy + reference feel + "instrumental". */
  style: string;
  /** The specific instrument palette to ask the generator for. */
  instrumentation: string;
  /** Concrete tempo/key so the track is consistent and nudgeable to a grid. */
  tempoKey: string;
  /** The earworm: describe the motif that repeats and lifts at the drop. */
  hook: string;
  /** The cut's beats in frames, with roles. The engine derives proportions. */
  beats: AudioBeat[];
  /** Frame the closing decisive hit / stinger lands on (e.g. a logo). */
  stingerFrame?: number;
  /** What to exclude — the negative prompt (vocals, fade-out, lo-fi…). */
  exclude?: string;
  /** SFX cue notes for the sound-designer (synthesized separately, not generated). */
  sfxNotes?: string;
};

// One renderable video. Products publish these; the registry turns each into a
// Remotion <Composition>. `id` is the composition id used by render/still commands.
export type VideoDef = {
  /**
   * Composition id — also the render/still argument and default output name.
   * Remotion allows only a-z, A-Z, 0-9, CJK and `-`. No underscores, spaces, or
   * dots; PascalCase reads best (e.g. "MyBolaV4", "AcmeTeaser").
   */
  id: string;
  component: React.FC;
  durationInFrames: number;
  fps?: number;
  width?: number;
  height?: number;
  /**
   * Optional sound direction. When present, `npm run audio:prompt <id>` emits a
   * music-generation prompt + alignment plan for a 3rd-party AI generator. Videos
   * without it simply have no generated score (e.g. a silent or SFX-only cut).
   */
  audio?: AudioBrief;
};

// =============================================================================
// Format presets — pick the frame the video is actually for.
// =============================================================================
// Aspect is a creative decision, not a default: a web hero and a Reel are
// different films. Spread one of these into defineVideo, or pass width/height
// directly for anything bespoke.

/** 9:16 — social feeds, Reels, Stories, TikTok. */
export const PORTRAIT = { fps: 30, width: 1080, height: 1920 } as const;
/** 16:9 — website hero, YouTube, keynote playback. */
export const LANDSCAPE = { fps: 30, width: 1920, height: 1080 } as const;
/** 1:1 — feed posts that must work in either orientation. */
export const SQUARE = { fps: 30, width: 1080, height: 1080 } as const;
/** 21:9 — cinematic banner/title sequences. */
export const CINEMA = { fps: 30, width: 2560, height: 1080 } as const;

/**
 * Build a VideoDef. Defaults to PORTRAIT; pass fps/width/height (or spread a
 * preset) to override:
 *   defineVideo({ id, component, durationInFrames, ...LANDSCAPE })
 */
export const defineVideo = (
  v: VideoDef,
): Required<Omit<VideoDef, "audio">> & Pick<VideoDef, "audio"> => ({
  ...PORTRAIT,
  ...v,
}) as Required<Omit<VideoDef, "audio">> & Pick<VideoDef, "audio">;
