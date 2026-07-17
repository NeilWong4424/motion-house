import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { UIFONT, ui, usePjs } from "./theme";

// =============================================================================
// AppScreen — full-bleed dark app canvas (the phone IS the frame)
// =============================================================================
export const AppScreen: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  usePjs();
  return (
    <AbsoluteFill style={{ background: ui.black }}>
      {children}
    </AbsoluteFill>
  );
};

// =============================================================================
// StatusBar — phone status bar inside the screen (9:41, signal/wifi/battery)
// =============================================================================
export const StatusBar: React.FC<{ time?: string; light?: boolean }> = ({ time = "9:41", light = false }) => {
  const c = light ? "#E9EDEF" : ui.white;
  return (
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 90, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 56px 0", zIndex: 5 }}>
      <span style={{ fontFamily: UIFONT, fontSize: 34, fontWeight: 600, color: c }}>{time}</span>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <svg width="36" height="26" viewBox="0 0 18 13">{[2, 5, 8, 11].map((h, i) => (<rect key={i} x={i * 4.4} y={12 - h} width="3" height={h} rx="1" fill={c} />))}</svg>
        <svg width="34" height="26" viewBox="0 0 17 13"><path d="M8.5 12.5 L1 5 a10.6 10.6 0 0 1 15 0 Z" fill="none" stroke={c} strokeWidth="1.8" /><path d="M8.5 12 L4.2 7.7 a6 6 0 0 1 8.6 0 Z" fill={c} /></svg>
        <svg width="50" height="26" viewBox="0 0 25 13"><rect x="0.8" y="1" width="20" height="11" rx="3" fill="none" stroke={c} strokeWidth="1.4" /><rect x="2.6" y="2.8" width="13" height="7.4" rx="1.6" fill={c} /><path d="M22.6 4.5 v4 a2 2 0 0 0 0-4z" fill={c} /></svg>
      </div>
    </div>
  );
};

// =============================================================================
// PhoneFrame — device mockup floating on the product's brand canvas
// =============================================================================
// Brand shell = narration layer (colour passed in via `canvas`/`rim` so this
// module stays product-neutral); dark screen = product layer. The phone never
// moves — only the camera pushes in.
export const PhoneFrame: React.FC<{
  children: React.ReactNode;
  dipFrames?: number[];
  canvas: string;
  rim?: string;
}> = ({ children, canvas, rim = "rgba(31,27,22,0.35)" }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  // Camera only: slow push-in across the scene; the phone itself never moves.
  const p = interpolate(frame, [0, durationInFrames], [0, 1]);
  const zoom = 1.0 + 0.045 * (p * p * (3 - 2 * p));
  return (
    <AbsoluteFill style={{ background: canvas, transform: `scale(${zoom})` }}>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ position: "absolute", width: 1300, height: 1300, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 65%)" }} />
        <div style={{ position: "absolute", bottom: 46, width: 620, height: 60, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(31,27,22,0.30) 0%, rgba(31,27,22,0) 70%)", filter: "blur(6px)" }} />
        <div style={{ width: 902, height: 1836, borderRadius: 96, background: "#0A0A0B", padding: 15, boxSizing: "border-box", border: `1px solid ${rim}` }}>
          <div style={{ width: 872, height: 1806, borderRadius: 82, overflow: "hidden", position: "relative", background: ui.black }}>
            <div style={{ width: 1080, height: 2237, transform: "scale(0.8074)", transformOrigin: "top left", position: "absolute", top: 0, left: 0 }}>
              {children}
            </div>
            <div style={{ position: "absolute", top: 14, left: "50%", transform: "translateX(-50%)", width: 220, height: 56, borderRadius: 30, background: "#0A0A0B" }} />
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
