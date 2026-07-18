import React from "react";
import { MYBOLA } from "../design";
import { t } from "./tokens";

// =============================================================================
// Attendance — 1:1 with session_sheet_child _MemberAttendanceRow
// =============================================================================
// Per-member rows (h48): name (text.label) over "{age} tahun" (text.meta).
// Attended -> success border + radius 16 + green checkmark; absent -> tertiary
// border + radius 4. The 4<->16 radius morph is the app's signature selection
// animation. Header shows "{n}/{max} PELATIH".

const Check = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="11" fill={MYBOLA.success} />
    <path d="M7 12.5l3.2 3.2L17 8.5" stroke="#04240E" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const EmptyCircle = () => (
  <div style={{ width: 22, height: 22, borderRadius: 11, border: `2px solid ${MYBOLA.tertiary}` }} />
);

export type Trainee = { name: string; age: number; present: boolean };

const Row: React.FC<{ tr: Trainee }> = ({ tr }) => {
  const radius = tr.present ? 16 : 4;
  const border = tr.present ? MYBOLA.success : MYBOLA.border;
  return (
    <div
      style={{
        height: 48,
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "0 12px",
        borderRadius: radius,
        border: `1px solid ${border}`,
        background: tr.present ? "rgba(48,209,88,0.06)" : "transparent",
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ ...t.label }}>{tr.name}</div>
        <div style={{ ...t.meta }}>{tr.age} tahun</div>
      </div>
      {tr.present ? <Check /> : <EmptyCircle />}
    </div>
  );
};

export const Attendance: React.FC<{
  title: string;
  time: string;
  dateLine: string; // "Isnin, 21 Julai 2025"
  present: number;
  max: number;
  trainees: Trainee[];
}> = ({ title, time, dateLine, present, max, trainees }) => (
  <div style={{ position: "absolute", inset: 0, paddingTop: 44, display: "flex", flexDirection: "column", background: MYBOLA.black }}>
    <div style={{ padding: "8px 16px 12px", borderBottom: `1px solid ${MYBOLA.border}` }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={t.title}>{title}</span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 8px", borderRadius: 25, background: "rgba(0,145,255,0.2)" }}>
          <span style={{ ...t.meta, color: MYBOLA.primary, fontWeight: 600 }}>{time}</span>
        </span>
      </div>
      <div style={{ ...t.meta, marginTop: 4 }}>{dateLine}</div>
      <div style={{ ...t.label, color: MYBOLA.success, marginTop: 8, letterSpacing: 1 }}>{present}/{max} PELATIH</div>
    </div>
    <div style={{ flex: 1, padding: 16, display: "flex", flexDirection: "column", gap: 8 }}>
      {trainees.map((tr, i) => (
        <Row key={i} tr={tr} />
      ))}
    </div>
  </div>
);
