import React from "react";
import { AbsoluteFill } from "remotion";
import { ui, usePjs } from "../appTheme";

// =============================================================================
// MyBola's device staging — how this design language puts the app on screen.
// =============================================================================
// Deliberately NOT in shared/: the geometry below (a 902x1836 iPhone-proportioned
// body, content scaled 0.8074 to fit, the glow and grounding shadow) is a styling
// decision belonging to MyBola's "warm editorial" language. Another product might
// stage a laptop, a floating browser, or no device at all.
//
// The rule this encodes: cream shell = narration layer, dark screen = product
// layer. The phone NEVER moves; only the camera pushes in.

/** Full-bleed dark app canvas — the phone IS the frame. */
export const AppScreen: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  usePjs();
  return <AbsoluteFill style={{ background: ui.black }}>{children}</AbsoluteFill>;
};

export const PhoneFrame: React.FC<{
  children: React.ReactNode;
  dipFrames?: number[];
  canvas: string;
  rim?: string;
}> = ({ children, canvas, rim = "rgba(31,27,22,0.35)" }) => {
  // The phone is DEAD STILL. It used to carry `scale(1 + 0.045 * t)`, which was
  // wrong twice over: the scaled element contains the phone, so it was the phone
  // moving rather than a camera; and because each scene mounts its own
  // PhoneFrame, the zoom reset to 1.0 on every cut — the device visibly pumped
  // smaller at each scene change.
  //
  // Camera work belongs to <Shot> (shared/motion/shot.tsx), which frames and
  // moves the whole composition. A prop never moves itself.
  return (
    <AbsoluteFill style={{ background: canvas }}>
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
