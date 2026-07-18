import React from "react";
import { MYBOLA } from "../design";
import { t } from "./tokens";

// =============================================================================
// PhoneFrame
// =============================================================================
// A neutral black phone the app screens live inside. Per craft, the subject is
// mounted ONCE above the scenes and never scales itself — scenes swap the screen
// content, the camera (a parent transform) does any movement. Fixed logical size
// so every screen recreation shares one coordinate space.

/** Logical screen size inside the frame (portrait phone viewport). */
export const SCREEN_W = 560;
export const SCREEN_H = 1212; // ~ iPhone 19.5:9 aspect at 560 wide

export const BEZEL = 18;
const RADIUS = 76;

export const PhoneFrame: React.FC<{
  children: React.ReactNode;
  /** Status-bar time text (defaults to a neutral academy-hours time). */
  time?: string;
}> = ({ children, time = "9:41" }) => {
  return (
    <div
      style={{
        width: SCREEN_W + BEZEL * 2,
        height: SCREEN_H + BEZEL * 2,
        borderRadius: RADIUS,
        background: "#0A0A0A",
        border: `1px solid ${MYBOLA.border}`,
        padding: BEZEL,
        boxSizing: "border-box",
      }}
    >
      {/* Screen: the app canvas. overflow hidden clips content to the frame. */}
      <div
        style={{
          position: "relative",
          width: SCREEN_W,
          height: SCREEN_H,
          borderRadius: RADIUS - BEZEL,
          overflow: "hidden",
          background: MYBOLA.black,
        }}
      >
        {/* Status bar: minimal, matches a dark iOS app chrome. */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 44,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 26px",
            zIndex: 5,
            pointerEvents: "none",
          }}
        >
          <span style={{ ...t.meta, color: MYBOLA.white, fontWeight: 600 }}>{time}</span>
          <span style={{ ...t.meta, color: MYBOLA.white, fontWeight: 600, letterSpacing: 1 }}>MyBola</span>
        </div>
        {/* Dynamic-island pill. */}
        <div
          style={{
            position: "absolute",
            top: 11,
            left: "50%",
            transform: "translateX(-50%)",
            width: 92,
            height: 26,
            borderRadius: 13,
            background: "#000",
            zIndex: 6,
          }}
        />
        {children}
      </div>
    </div>
  );
};
