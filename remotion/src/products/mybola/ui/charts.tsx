import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { EASE } from "../../../shared/motion/easing";
import { SC, UIFONT, ui, uiText } from "../appTheme";

// =============================================================================
// MyBola admin charts — recreated from portal/charts/*.dart
// =============================================================================
// Code-exact rule: every constant below comes from the Flutter source.
//   MetricList      — grouped label/value rows in one dark card
//   RankedBarChart  — subtitle + headline, hairline divider, label·bar·count rows
// Both cards: color.secondary, radius 12, padding 16.
//
// text.heading (20/600, tracking +0.38) exists in app_theme.dart but not in our
// shared uiText, so it's defined here at the same scale as the rest.
const headingStyle: React.CSSProperties = {
  fontFamily: UIFONT,
  fontSize: 20 * SC,
  fontWeight: 600,
  lineHeight: `${25 * SC}px`,
  letterSpacing: `${0.38 * SC}px`,
  color: ui.white,
};

const CARD: React.CSSProperties = {
  background: ui.secondary,
  borderRadius: 12 * SC,
  padding: 16 * SC,
  boxSizing: "border-box",
};

// =============================================================================
// MetricList — grouped label/value rows (portal/charts/metric_list.dart)
// =============================================================================
// Container(color.secondary, radius 12, padding 16) > Column(spacing 16) with
// one row per metric: label left (text.meta), value right (text.label).
export const MetricList: React.FC<{
  rows: Array<[string, string]>;
  /** Frame each row lands on; rows stagger from here. */
  atFrame?: number;
  step?: number;
}> = ({ rows, atFrame = 0, step = 3 }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ ...CARD, display: "flex", flexDirection: "column", gap: 16 * SC }}>
      {rows.map(([label, value], i) => {
        const o = interpolate(frame, [atFrame + i * step, atFrame + i * step + 10], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: EASE.easeOutQuart,
        });
        return (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", opacity: o }}>
            <span style={uiText.meta}>{label}</span>
            <span style={{ ...uiText.label, fontWeight: 500, color: ui.white }}>{value}</span>
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
// per category: fixed label slot (default 45, text.title) | gap 12 | bar track
// | value right.
//
// Bar geometry from source: height 6, radius 3, track color.black, fill
// color.primary. Bar width = value / totalValue — a share of the WHOLE, not of
// the largest row, so a 3-of-28 debtor reads as a thin sliver. That honesty is
// the point of the chart; don't normalize to max.
export const RankedBarChart: React.FC<{
  subtitle: string;
  headline: string;
  rows: Array<[string, number]>;
  totalValue: number;
  formatValue?: (n: number) => string;
  labelWidth?: number;
  /** Frame bars start growing. */
  atFrame?: number;
  step?: number;
}> = ({ subtitle, headline, rows, totalValue, formatValue, labelWidth = 45, atFrame = 0, step = 3 }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ ...CARD, display: "flex", flexDirection: "column", alignItems: "stretch" }}>
      <span style={uiText.meta}>{subtitle}</span>
      <div style={{ height: 4 * SC }} />
      <span style={headingStyle}>{headline}</span>

      {rows.map(([label, value], i) => {
        const start = atFrame + i * step;
        const grow = interpolate(frame, [start, start + 22], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: EASE.easeOutExpo,
        });
        const frac = totalValue === 0 ? 0 : value / totalValue;
        return (
          <div key={i} style={{ display: "flex", alignItems: "center", marginTop: 12 * SC, opacity: grow }}>
            <span style={{ ...uiText.title, width: labelWidth * SC, flexShrink: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {label}
            </span>
            <div style={{ width: 12 * SC, flexShrink: 0 }} />
            <div style={{ flex: 1, height: 6 * SC, borderRadius: 3 * SC, background: ui.black, position: "relative", overflow: "hidden" }}>
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: `${Math.max(frac * grow, 0) * 100}%`,
                  background: ui.primary,
                  borderRadius: 3 * SC,
                }}
              />
            </div>
            <div style={{ width: 12 * SC, flexShrink: 0 }} />
            <span style={{ ...uiText.title, fontVariantNumeric: "tabular-nums", flexShrink: 0 }}>
              {formatValue ? formatValue(value) : value}
            </span>
          </div>
        );
      })}
    </div>
  );
};
