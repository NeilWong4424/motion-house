import React from "react";
import { MYBOLA } from "../design";
import { familyOf } from "../../../shared/design/types";
import { mybola } from "../design";

// =============================================================================
// PdfRoster — a trainee-member roster as a PDF document tile
// =============================================================================
// The file the owner drops into the admin chat in scene 4. The app accepts PDF
// natively (not .xlsx/.csv), so this is a PDF *export* of a member table — a
// spreadsheet-style roster (name / IC / age). The admin AI OCR-reads it and bulk-
// registers every row. Rendered as a small paper document with a header + rows.

const FONT = familyOf(mybola.type.body);

// Generic example rows — names are placeholders, not real member data.
const ROWS = [
  ["Ahmad Faizal", "120815-10-1234", "12"],
  ["Nur Aisyah", "130422-14-5678", "11"],
  ["Danish Haiqal", "110930-08-2211", "13"],
  ["Lim Wei Jie", "121204-07-9032", "12"],
  ["Raj Kumar", "130118-05-4417", "11"],
  ["Siti Sarah", "111011-12-7788", "13"],
];

export const PdfRoster: React.FC<{ title?: string }> = ({ title = "Senarai Pelatih 2026.pdf" }) => (
  <div style={{ width: 260 }}>
    {/* Paper. */}
    <div style={{ background: "#F5F3EE", borderRadius: 6, padding: "14px 14px 16px", color: "#1A1A1A" }}>
      <div style={{ fontFamily: FONT, fontSize: 13, fontWeight: 700, color: "#111", marginBottom: 2 }}>Akademi Bola — Pelatih</div>
      <div style={{ fontFamily: FONT, fontSize: 9, color: "#777", marginBottom: 10 }}>Nama · No. KP · Umur</div>
      {/* Header row. */}
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1.4fr 0.5fr", gap: 4, borderBottom: "1px solid #CDCabf", paddingBottom: 4, marginBottom: 4 }}>
        {["Nama", "No. KP", "Umur"].map((h) => (
          <span key={h} style={{ fontFamily: FONT, fontSize: 9, fontWeight: 700, color: "#555" }}>{h}</span>
        ))}
      </div>
      {ROWS.map((r, i) => (
        <div key={i} style={{ display: "grid", gridTemplateColumns: "1.4fr 1.4fr 0.5fr", gap: 4, padding: "3px 0" }}>
          <span style={{ fontFamily: FONT, fontSize: 9.5, color: "#222" }}>{r[0]}</span>
          <span style={{ fontFamily: FONT, fontSize: 9.5, color: "#444" }}>{r[1]}</span>
          <span style={{ fontFamily: FONT, fontSize: 9.5, color: "#444" }}>{r[2]}</span>
        </div>
      ))}
    </div>
    {/* Filename strip under the paper. */}
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
      <svg width="18" height="21" viewBox="0 0 26 30" fill="none"><path d="M3 1h13l7 7v20a1 1 0 01-1 1H3a1 1 0 01-1-1V2a1 1 0 011-1z" fill="#EA4335" /><path d="M16 1l7 7h-7V1z" fill="#B31412" /><text x="13" y="22" textAnchor="middle" fontFamily="sans-serif" fontSize="7" fontWeight={700} fill="#fff">PDF</text></svg>
      <span style={{ fontFamily: FONT, fontSize: 13, color: MYBOLA.white }}>{title}</span>
    </div>
  </div>
);
