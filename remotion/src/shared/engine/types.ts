import React from "react";

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
export const defineVideo = (v: VideoDef): Required<VideoDef> => ({
  ...PORTRAIT,
  ...v,
}) as Required<VideoDef>;
