import React, { useState } from "react";
import { AbsoluteFill, continueRender, delayRender, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

// =============================================================================
// Narration primitives — the serif "outside the phone" layer.
// =============================================================================
// Brand-neutral: colours/copy are passed in by the product. Fonts are the house
// editorial pair (Playfair serif + Inter).

const FONTS = [
  ["Playfair Display", "fonts/playfair-500.woff2", "500"],
  ["Playfair Display", "fonts/playfair-600.woff2", "600"],
  ["Inter", "fonts/inter-400.woff2", "400"],
  ["Inter", "fonts/inter-600.woff2", "600"],
  ["Inter", "fonts/inter-700.woff2", "700"],
] as const;

let fontsLoaded = false;
export const useFonts = () => {
  const [handle] = useState(() => (fontsLoaded ? null : delayRender("fonts")));
  if (!fontsLoaded && handle !== null) {
    Promise.all(
      FONTS.map(([family, file, weight]) => {
        const f = new FontFace(family, `url(${staticFile(file)})`, { weight });
        return f.load().then((loaded) => document.fonts.add(loaded));
      })
    ).then(() => {
      fontsLoaded = true;
      continueRender(handle);
    });
  }
};

export const SERIF = "'Playfair Display', Georgia, serif";
export const SANS = "'Inter', Arial, sans-serif";

export const fadeUp = (frame: number, fps: number, delay = 0) => {
  const s = spring({ frame: frame - delay, fps, config: { damping: 13, stiffness: 175 } });
  return { opacity: s, transform: `translateY(${interpolate(s, [0, 1], [36, 0])}px)` };
};

// Fade in at the head of a scene and out at its tail.
export const FadeIn: React.FC<{ children: React.ReactNode; d?: number }> = ({ children, d = 8 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const o = interpolate(frame, [0, d, durationInFrames - d, durationInFrames], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
};

// Slow settle: gentle scale-down + rise across the scene.
export const Drift: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const p = interpolate(frame, [0, durationInFrames], [0, 1]);
  const e = p * p * (3 - 2 * p);
  return <AbsoluteFill style={{ transform: `scale(${1.035 - 0.035 * e}) translateY(${-22 * (1 - e)}px)` }}>{children}</AbsoluteFill>;
};

// Slow cinematic camera: zoom + gentle drift across the scene's duration.
export const Camera: React.FC<{ children: React.ReactNode; zoomFrom?: number; zoomTo?: number; driftX?: number; driftY?: number }> = ({ children, zoomFrom = 1.0, zoomTo = 1.07, driftX = 0, driftY = 0 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const p = interpolate(frame, [0, durationInFrames], [0, 1], { extrapolateRight: "clamp" });
  const ease = p * p * (3 - 2 * p);
  const z = zoomFrom + (zoomTo - zoomFrom) * ease;
  return (
    <AbsoluteFill style={{ transform: `scale(${z}) translate(${driftX * ease}px, ${driftY * ease}px)` }}>
      {children}
    </AbsoluteFill>
  );
};
