import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { EASE } from "../../../shared/motion/easing";
import { SC, UIFONT, ui } from "../appTheme";

// =============================================================================
// MyBola admin charts — recreated from portal/charts/*.dart
// =============================================================================
// Code-exact rule: every constant below comes from the Flutter source.
//   MetricList      — grouped label/value rows in one dark card
//   RankedBarChart  — subtitle + headline, then label·bar·count rows
// Both cards: color.secondary, radius 12, padding 16.
//
// These are the SAME widgets in the app's desktop and mobile layouts, so scale
// is a parameter rather than baked in: `scale` = SC (2.7) inside PhoneFrame
// (390pt -> 1080px), or 1 on a natively-sized desktop surface. Everything below
// is written in the app's logical px and multiplied once.
type Scaled = { scale?: number };

/** app_theme.dart text roles at a given scale. */
const roles = (k: number) => ({
  heading: { fontFamily: UIFONT, fontSize: 20 * k, fontWeight: 600, lineHeight: `${25 * k}px`, letterSpacing: `${0.38 * k}px`, color: ui.white } as React.CSSProperties,
  title: { fontFamily: UIFONT, fontSize: 17 * k, fontWeight: 500, lineHeight: `${22 * k}px`, letterSpacing: `${-0.43 * k}px`, color: ui.white } as React.CSSProperties,
  label: { fontFamily: UIFONT, fontSize: 15 * k, fontWeight: 500, lineHeight: `${20 * k}px`, letterSpacing: `${-0.23 * k}px`, color: ui.white } as React.CSSProperties,
  meta: { fontFamily: UIFONT, fontSize: 13 * k, fontWeight: 500, lineHeight: `${18 * k}px`, letterSpacing: `${-0.08 * k}px`, color: ui.tertiary } as React.CSSProperties,
});

const card = (k: number): React.CSSProperties => ({
  background: ui.secondary,
  borderRadius: 12 * k,
  padding: 16 * k,
  boxSizing: "border-box",
});

// =============================================================================
// MetricList — grouped label/value rows (portal/charts/metric_list.dart)
// =============================================================================
// Container(color.secondary, radius 12, padding 16) > Column(spacing 16) with
// one row per metric: label left (text.meta), value right (text.label).
export const MetricList: React.FC<Scaled & {
  rows: Array<[string, string]>;
  /** Frame the first row lands on; rows stagger from here. */
  atFrame?: number;
  step?: number;
}> = ({ rows, atFrame = 0, step = 3, scale = SC }) => {
  const frame = useCurrentFrame();
  const t = roles(scale);
  return (
    <div style={{ ...card(scale), display: "flex", flexDirection: "column", gap: 16 * scale }}>
      {rows.map(([label, value], i) => {
        const o = interpolate(frame, [atFrame + i * step, atFrame + i * step + 10], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: EASE.easeOutQuart,
        });
        return (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 * scale, opacity: o }}>
            <span style={{ ...t.meta, whiteSpace: "nowrap" }}>{label}</span>
            <span style={{ ...t.label, whiteSpace: "nowrap" }}>{value}</span>
          </div>
        );
      })}
    </div>
  );
};

// =============================================================================
// RankedBarChart — categorical breakdown (portal/charts/ranked_bar_chart.dart)
// =============================================================================
// Header: subtitle (text.meta), 4px gap, headline (text.heading). Then one row
// per category: fixed label slot (text.title) | gap 12 | bar track | value.
//
// Bar geometry from source: height 6, radius 3, track color.black, fill
// color.primary. Bar width = value / totalValue — a share of the WHOLE, not of
// the largest row, so three equal debtors read as three equal slivers. That
// honesty is the point of the chart; don't normalize to max.
export const RankedBarChart: React.FC<Scaled & {
  subtitle: string;
  headline: string;
  rows: Array<[string, number]>;
  totalValue: number;
  formatValue?: (n: number) => string;
  /** Label slot width in logical px (the real BillsChart passes 60). */
  labelWidth?: number;
  atFrame?: number;
  step?: number;
}> = ({ subtitle, headline, rows, totalValue, formatValue, labelWidth = 45, atFrame = 0, step = 3, scale = SC }) => {
  const frame = useCurrentFrame();
  const t = roles(scale);
  return (
    <div style={{ ...card(scale), display: "flex", flexDirection: "column", alignItems: "stretch" }}>
      <span style={t.meta}>{subtitle}</span>
      <div style={{ height: 4 * scale }} />
      <span style={t.heading}>{headline}</span>

      {rows.map(([label, value], i) => {
        const start = atFrame + i * step;
        const grow = interpolate(frame, [start, start + 22], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: EASE.easeOutExpo,
        });
        const frac = totalValue === 0 ? 0 : value / totalValue;
        return (
          <div key={i} style={{ display: "flex", alignItems: "center", marginTop: 12 * scale, opacity: grow }}>
            <span style={{ ...t.title, width: labelWidth * scale, flexShrink: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {label}
            </span>
            <div style={{ width: 12 * scale, flexShrink: 0 }} />
            <div style={{ flex: 1, height: 6 * scale, borderRadius: 3 * scale, background: ui.black, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${Math.max(frac * grow, 0) * 100}%`, background: ui.primary, borderRadius: 3 * scale }} />
            </div>
            <div style={{ width: 12 * scale, flexShrink: 0 }} />
            <span style={{ ...t.title, fontVariantNumeric: "tabular-nums", flexShrink: 0, whiteSpace: "nowrap" }}>
              {formatValue ? formatValue(value) : value}
            </span>
          </div>
        );
      })}
    </div>
  );
};
