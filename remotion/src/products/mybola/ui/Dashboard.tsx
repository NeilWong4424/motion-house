import React from "react";
import { MYBOLA } from "../design";
import { t } from "./tokens";

// =============================================================================
// Dashboard — 1:1 with portal/charts/{metric_list,ranked_bar_chart}.dart
// =============================================================================
// MetricList: grouped color.secondary card, rows label left (text.body) / value
// right dim (text.hint). RankedBarChart: subtitle (text.meta) -> headline
// (text.heading) -> rows of [label (text.title) · thin 6px proportional bar (fill
// color.warning, rail color.black, radius 3) · right value (text.title, tabular)].
// The film animates values via `reveal` on the caller side by passing computed
// numbers; this component just renders what it's given.

const Card: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ background: MYBOLA.secondary, borderRadius: 12, padding: 16 }}>{children}</div>
);

export const MetricList: React.FC<{ rows: { label: string; value: string }[] }> = ({ rows }) => (
  <Card>
    {rows.map((r, i) => (
      <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: i === 0 ? "0 0 8px" : "8px 0" }}>
        <span style={t.body}>{r.label}</span>
        <span style={{ ...t.hint, fontVariantNumeric: "tabular-nums" }}>{r.value}</span>
      </div>
    ))}
  </Card>
);

export const RankedBarChart: React.FC<{
  subtitle: string;
  headline: string;
  rows: { label: string; value: string; frac: number }[];
}> = ({ subtitle, headline, rows }) => (
  <Card>
    <div style={t.meta}>{subtitle}</div>
    <div style={{ ...t.heading, marginTop: 2, marginBottom: 12 }}>{headline}</div>
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {rows.map((r, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ ...t.title, width: 96, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.label}</span>
          <div style={{ flex: 1, height: 6, borderRadius: 3, background: MYBOLA.black, overflow: "hidden" }}>
            <div style={{ width: `${Math.round(r.frac * 100)}%`, height: "100%", borderRadius: 3, background: MYBOLA.warning }} />
          </div>
          <span style={{ ...t.title, fontVariantNumeric: "tabular-nums", minWidth: 64, textAlign: "right" }}>{r.value}</span>
        </div>
      ))}
    </div>
  </Card>
);

export const Dashboard: React.FC<{
  metrics: { label: string; value: string }[];
  ranked: { subtitle: string; headline: string; rows: { label: string; value: string; frac: number }[] };
}> = ({ metrics, ranked }) => (
  <div style={{ position: "absolute", inset: 0, paddingTop: 56, padding: "56px 14px 14px", display: "flex", flexDirection: "column", gap: 12, background: MYBOLA.black }}>
    <MetricList rows={metrics} />
    <RankedBarChart {...ranked} />
  </div>
);
