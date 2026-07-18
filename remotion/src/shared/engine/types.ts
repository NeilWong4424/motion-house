import React from "react";

// =============================================================================
// Audio brief — declarative sound direction for a video.
// =============================================================================
// We no longer synthesize music locally. Each video declares WHAT it should sound
// like and WHERE its beats fall (in frames); the shared prompt engine
// (engine/audio-prompt.ts) turns this into a tool-agnostic music-generation prompt
// to feed a 3rd-party AI generator (ElevenLabs, DaVinci, Suno, Udio…). The
// returned track is then aligned to the payoff frame-exact. This type carries NO
// synthesis — only intent + timing.
//
// THE BRIEF OWNS THE SOUND, THE ENGINE ONLY FORMATS. The engine is genre-agnostic:
// it bakes in no register (no "calm" vs "energetic"). Whatever a beat should sound
// like — sports EDM, felt piano, trap, horror drone, folk, corporate bed — the
// PRODUCT says so, per beat or per role. Adding a new genre never touches the
// engine. So it supports every kind of video and every kind of track.

/**
 * The canonical arrangement roles. These are SUGGESTIONS with a shared meaning
 * the engine understands (e.g. exactly one `payoff` is the alignment target); a
 * product may also use any other string for song-form structure ("verse",
 * "chorus", "breakdown", "loop"). `payoff` replaces the old promo-specific "drop"
 * name so calm films aren't described as "dropping".
 */
export type AudioRole =
  | "intro" // the opening — however the genre opens
  | "build" // developing / rising
  | "riser" // tension gathering into the payoff
  | "payoff" // THE turn: the single most important musical moment (the align target)
  | "sustain" // holding after the payoff
  | "outro"; // the ending

/** One structural beat of the cut, in frames. */
export type AudioBeat = {
  /** Frame this beat starts on (from the composition's own scene table). */
  frame: number;
  /**
   * The beat's role. A canonical `AudioRole` (the engine treats `payoff` as the
   * alignment target) OR any product-defined string for bespoke song structure.
   */
  role: AudioRole | (string & {});
  /** Optional human label for the reference table (e.g. "ColdOpen (48 NATIONS)"). */
  label?: string;
  /**
   * What the MUSIC does here, in this beat's own words — the product's genre voice.
   * Highest precedence in the prompt's structure list. Use this to say exactly
   * what a beat sounds like ("808s enter, hats stutter"; "a lone cello, rubato").
   */
  sound?: string;
};

/** Declarative sound direction the prompt engine reads. No synthesis here. */
export type AudioBrief = {
  /** One-line style: genre + energy + reference feel + "instrumental". */
  style: string;
  /** The specific instrument palette to ask the generator for. */
  instrumentation: string;
  /** Concrete tempo/key so the track is consistent and nudgeable to a grid. */
  tempoKey: string;
  /** The earworm: describe the motif / main musical idea. */
  hook: string;
  /** The cut's beats in frames. The engine derives proportions from them. */
  beats: AudioBeat[];
  /**
   * Default per-role descriptions in THIS product's genre voice, used when a beat
   * has no `sound` of its own. The product owns the register here — the engine
   * ships none. e.g. { build: "add one voice at a time, no percussion", ... }.
   */
  roleText?: Partial<Record<string, string>>;
  /** The dynamics line (loud/soft, headroom). Product-specific; has a generic default. */
  dynamics?: string;
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
   * dots; PascalCase reads best (e.g. "AcmeLaunch", "AcmeTeaser").
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
