import { Easing } from "remotion";

// =============================================================================
// Easing + spring presets — the motion vocabulary.
// =============================================================================
// Premium motion is mostly restraint plus the right curve. Two rules that carry
// most of the quality:
//   1. Nothing linear. Linear motion reads as cheap because nothing in the
//      physical world starts and stops instantly.
//   2. Fast out, slow in. Elements should cover most of their distance early and
//      ease into rest — that's what makes a move feel "expensive".
// See craft/motion-craft.md for when to reach for which.

/**
 * Named curves. `linear` exists only for cases that genuinely need constant
 * rate (a continuous ticker, a looping rotation) — never for entrances.
 */
export const EASE = {
  /** Very fast out, long glide to rest. The Apple-keynote curve. Hero moves. */
  easeOutExpo: Easing.out(Easing.exp),
  /** Fast out, gentle settle. Softer than expo — text, cards, most entrances. */
  easeOutQuart: Easing.out(Easing.poly(4)),
  /** Symmetric accelerate/decelerate. Camera moves, scene pushes, A-to-B travel. */
  easeInOutQuint: Easing.inOut(Easing.poly(5)),
  /** Slight overshoot before settling. Playful accents — use sparingly. */
  backOut: Easing.out(Easing.back(1.6)),
  /** Constant rate. Tickers and loops only. */
  linear: Easing.linear,
} as const;

export type EaseName = keyof typeof EASE;

/**
 * Spring presets. Springs beat curves when something should feel physical —
 * arriving, landing, reacting. Restrained configs (damping 10-20, stiffness
 * 90-170): controlled arrivals, no gratuitous wobble.
 */
export const SPRING = {
  /** Quick and controlled, no visible wobble. UI, chat bubbles, captions. */
  crisp: { damping: 17, stiffness: 135 },
  /** The default. Lands with a hint of weight. Headlines, cards. */
  settle: { damping: 14, stiffness: 130 },
  /** Slower, heavier arrival. Big type, logo reveals, hero moments. */
  weighty: { damping: 20, stiffness: 90 },
  /** Loose and lively. Accents only — bounce reads as informal. */
  bouncy: { damping: 10, stiffness: 170 },
} as const;

export type SpringName = keyof typeof SPRING;

/** Frames between staggered items. 2-4 reads deliberate; past ~6 it drags. */
export const STAGGER = { tight: 2, normal: 3, loose: 5 } as const;
