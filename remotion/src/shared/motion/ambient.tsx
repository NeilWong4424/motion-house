import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

// =============================================================================
// Ambient motion — life for held frames.
// =============================================================================
// A held frame is not a dead frame. When the camera holds and the content has
// landed, a whisper of continuous motion keeps the shot alive without pulling the
// eye. SUBTLE ONLY — if you can clearly see it move, it's too much. These loop
// forever off a sine, so they never "arrive" or "finish"; they just breathe.

/** Slow vertical float — an object drifting as if weightless. Amplitude in px. */
export const Float: React.FC<{
  children: React.ReactNode;
  amplitude?: number;
  period?: number; // seconds per cycle
  phase?: number;
}> = ({ children, amplitude = 6, period = 4, phase = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const y = Math.sin((frame / fps / period) * Math.PI * 2 + phase) * amplitude;
  return <div style={{ transform: `translateY(${y}px)` }}>{children}</div>;
};

/** Slow scale breathe — a gentle pulse of presence. Keep `amount` tiny (~0.01). */
export const Breathe: React.FC<{
  children: React.ReactNode;
  amount?: number;
  period?: number;
  phase?: number;
}> = ({ children, amount = 0.01, period = 5, phase = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = 1 + Math.sin((frame / fps / period) * Math.PI * 2 + phase) * amount;
  return <div style={{ transform: `scale(${s})`, transformOrigin: "center" }}>{children}</div>;
};

/** Slow drift on both axes (Lissajous) — ambient parallax for a background layer. */
export const Drift2D: React.FC<{
  children: React.ReactNode;
  ax?: number;
  ay?: number;
  period?: number;
}> = ({ children, ax = 8, ay = 5, period = 7 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = (frame / fps / period) * Math.PI * 2;
  return <div style={{ transform: `translate(${Math.sin(t) * ax}px, ${Math.cos(t * 0.8) * ay}px)` }}>{children}</div>;
};
