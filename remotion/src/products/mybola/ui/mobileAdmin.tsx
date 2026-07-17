import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { EASE } from "../../../shared/motion/easing";
import { SC, UIFONT, ui, uiText } from "../appTheme";

// =============================================================================
// MyBola admin — MOBILE layout (portal/shell/home_screen.dart _MobileLayout)
// =============================================================================
// The app really does have this: below the 953px breakpoint the portal drops the
// rail and sidebar and shows the routed page full-screen, with the chat as a
// pill overlay. That's what makes the admin dashboard honest to show on a phone —
// it isn't a portrait mock-up of the desktop, it's the layout the app ships.
//
// Everything here uses the phone scale (SC = 2.7), same as every other in-phone
// scene: 390pt logical width -> 1080px frame.
//
// Content structure from bills_content.dart:
//   MobileTopSpacerSliver -> SelectorSectionLabel('TARIKH') -> day chips
//   -> SelectorSectionLabel('STATUS') -> status chips
//   -> SelectorSectionLabel('INVOIS') -> bills list
// Section labels are text.meta; chips come from selector_widgets.dart.

/** SelectorSectionLabel — SliverPadding(all 10) + Text(style: text.meta). */
export const SectionLabel: React.FC<{ label: string }> = ({ label }) => (
  <div style={{ padding: 10 * SC }}>
    <span style={uiText.meta}>{label}</span>
  </div>
);

/** Horizontal chip row — the day/status filters. */
export const ChipRow: React.FC<{
  chips: Array<{ label: string; sub?: string; badge?: string; on?: boolean }>;
  atFrame?: number;
  step?: number;
}> = ({ chips, atFrame = 0, step = 3 }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ display: "flex", gap: 8 * SC, padding: `0 ${10 * SC}px`, overflow: "hidden" }}>
      {chips.map((c, i) => {
        const o = interpolate(frame, [atFrame + i * step, atFrame + i * step + 10], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: EASE.easeOutQuart,
        });
        return (
          <div
            key={i}
            style={{
              opacity: o,
              background: c.on ? ui.primary : ui.secondary,
              borderRadius: 10 * SC,
              padding: `${8 * SC}px ${14 * SC}px`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2 * SC,
              flexShrink: 0,
              minWidth: 56 * SC,
            }}
          >
            <span style={{ ...uiText.meta, color: c.on ? ui.white : ui.tertiary, whiteSpace: "nowrap" }}>{c.label}</span>
            {c.sub ? (
              <span style={{ fontFamily: UIFONT, fontSize: 17 * SC, fontWeight: 600, color: c.on ? ui.white : ui.white }}>{c.sub}</span>
            ) : null}
            {c.badge ? (
              <span style={{ fontFamily: UIFONT, fontSize: 11 * SC, fontWeight: 600, color: ui.error }}>{c.badge}</span>
            ) : null}
          </div>
        );
      })}
    </div>
  );
};

/** One bill row: description + member name left, status badge + amount right. */
export const BillRow: React.FC<{
  desc: string;
  name: string;
  amount?: string;
  overdue?: boolean;
  atFrame: number;
}> = ({ desc, name, amount, overdue, atFrame }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [atFrame, atFrame + 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.easeOutQuart,
  });
  const y = interpolate(o, [0, 1], [14, 0]);
  return (
    <div
      style={{
        opacity: o,
        transform: `translateY(${y}px)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12 * SC,
        background: ui.secondary,
        borderRadius: 12 * SC,
        padding: `${14 * SC}px ${16 * SC}px`,
        marginBottom: 8 * SC,
        boxSizing: "border-box",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 3 * SC, minWidth: 0, flex: 1 }}>
        <span style={{ ...uiText.label, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{desc}</span>
        <span style={{ ...uiText.meta, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{name}</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 * SC, flexShrink: 0 }}>
        {overdue ? (
          <span
            style={{
              fontFamily: UIFONT,
              fontSize: 11 * SC,
              fontWeight: 600,
              color: ui.error,
              border: `1px solid ${ui.error}`,
              borderRadius: 6 * SC,
              padding: `${3 * SC}px ${8 * SC}px`,
              whiteSpace: "nowrap",
            }}
          >
            Tertunggak
          </span>
        ) : null}
        {amount ? <span style={{ ...uiText.title, fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>{amount}</span> : null}
      </div>
    </div>
  );
};

/**
 * MobileAdminScreen — the routed page filling the phone, per _MobileLayout.
 * `title` is the page name; children are the page's slivers.
 */
export const MobileAdminScreen: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <AbsoluteFill style={{ background: ui.black, display: "flex", flexDirection: "column" }}>
    {/* MobileTopSpacerSliver: clears the status bar, then the page title. */}
    <div style={{ height: 150, flexShrink: 0 }} />
    <div style={{ padding: `0 ${16 * SC}px ${6 * SC}px`, flexShrink: 0 }}>
      <span style={{ fontFamily: UIFONT, fontSize: 28 * SC, fontWeight: 600, color: ui.white, letterSpacing: "-0.5px" }}>{title}</span>
    </div>
    {/* Content sits in the upper-middle rather than pinned to the top: a real
        scroll view would be full, but a short demo list leaves a void at the
        bottom. Centring the block keeps the composition balanced on screen. */}
    <div style={{ flex: 1, padding: `0 ${10 * SC}px ${40 * SC}px`, minHeight: 0, overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "center", gap: 0 }}>
      {children}
    </div>
  </AbsoluteFill>
);
