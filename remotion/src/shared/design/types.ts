// =============================================================================
// DesignLanguage — everything that makes one video look unlike another.
// =============================================================================
// A design language is the whole visual identity of a video: its palette, its
// type, how it moves, how much depth it has. Two videos sharing the engine but
// carrying different design languages should look like they came from different
// studios.
//
// Nothing in shared/ hardcodes a look. Scenes read values from the active design
// language, so "make it feel like an Apple keynote" and "make it feel like a
// League of Legends explainer" are the same code path with different data.

/** One font family + the weights this design actually uses. */
export type FontSpec = {
  /** CSS family name, e.g. "Playfair Display". */
  family: string;
  /** Fallback stack appended after `family`, e.g. "Georgia, serif". */
  fallback: string;
  /**
   * Weight -> filename in public/fonts/, e.g. { 500: "playfair-500.woff2" }.
   * Add a family by dropping woff2 files there (see shared/design/fonts.tsx).
   */
  weights: Record<number, string>;
};

/**
 * Colour roles, not colour names. A scene asks for `accent`, never "coral" —
 * that's what lets the same scene code carry any brand.
 */
export type Palette = {
  /** Page/canvas behind everything. */
  bg: string;
  /** Primary text/graphic colour on `bg`. */
  fg: string;
  /** Secondary text — captions, taglines, supporting copy. */
  muted: string;
  /** The one colour that draws the eye. Use sparingly. */
  accent: string;
  /** Optional second accent for gradients/duotone. */
  accent2?: string;
  /** Surface for cards/panels sitting above `bg`. */
  surface?: string;
};

/**
 * How this design moves. Names refer to presets in shared/motion/easing.ts, so a
 * design language expresses taste ("everything settles, nothing bounces")
 * without rewriting timing per scene.
 */
export type MotionProfile = {
  /** Default spring preset for elements entering. */
  enter: "crisp" | "settle" | "weighty" | "bouncy";
  /** Default easing curve name for interpolated moves. */
  ease: "easeOutExpo" | "easeOutQuart" | "easeInOutQuint" | "backOut" | "linear";
  /** Frames between items in a stagger. 2-4 reads as deliberate; >6 drags. */
  stagger: number;
  /** Frames a scene holds still after its last element lands. Premium work waits. */
  hold?: number;
};

/** Optional depth/texture treatment. Absent = flat. */
export type Grain = {
  /** Faint grid/paper behind content: alpha 0-1 (keep ~0.02-0.04). */
  texture?: number;
  /** Edge darkening 0-1. */
  vignette?: number;
  /** Ambient shadow strength 0-1 for floating objects. */
  shadow?: number;
};

export type DesignLanguage = {
  /** Stable id, e.g. "mybola-editorial". */
  id: string;
  /** One line naming the feel — the brief this design answers. */
  feel: string;
  palette: Palette;
  type: {
    /** Headlines, wordmarks — the voice. */
    display: FontSpec;
    /** Body, captions, UI. */
    body: FontSpec;
  };
  motion: MotionProfile;
  grain?: Grain;
};

/** Every font a design language needs, deduped — for the loader. */
export const fontsOf = (d: DesignLanguage): FontSpec[] => {
  const seen = new Map<string, FontSpec>();
  for (const f of [d.type.display, d.type.body]) {
    if (!seen.has(f.family)) seen.set(f.family, f);
  }
  return [...seen.values()];
};

/** CSS font-family string for a spec. */
export const familyOf = (f: FontSpec): string => `'${f.family}', ${f.fallback}`;
