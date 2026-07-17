import React from "react";
import { UIFONT, ui } from "./theme";

// =============================================================================
// StatusBar — phone status bar inside the screen (9:41, signal/wifi/battery)
// =============================================================================
// Generic: any video staging a phone needs one, whatever the product or design
// language. Device staging itself (how the phone is framed on the canvas) is a
// design decision and lives with the product — see products/mybola/ui/phone.tsx.
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
