import React from "react";
import { AbsoluteFill } from "remotion";
import { UIFONT, ui, usePjs } from "../appTheme";
import { deskText } from "./deskText";

// =============================================================================
// MyBola desktop portal — recreated from portal/shell/*.dart
// =============================================================================
// Code-exact rule: structure and constants come from the Flutter source.
//
// home_screen.dart _DesktopLayout:
//   ShellTopHeader on top, then Row[ BusinessRail | Panel ] where Panel is a
//   Container(topLeft radius 26, left+top border color.border) wrapping
//   Row[ Sidebar | VerticalDivider(1) | Content ].
//   Desktop breakpoint: rail(72)+sidebar(240)+divider(1)+chat(320)+chart(320)=953.
//
// business_rail.dart: width 72, tiles 52.
// sidebar.dart:       width 240, nav rows padded 10, active = color.primary,
//                     inactive text/icon = color.tertiary.
// page_model.dart:    real page names/icons/positions.

/** Real academy pages, in their source `position` order. */
export const PAGES = [
  { id: "pengurus_akademi", name: "Pengurus Akademi", icon: "chat" },
  { id: "inbox", name: "Inbox", icon: "envelope" },
  { id: "sesi", name: "Sesi", icon: "calendar" },
  { id: "bil", name: "Bil", icon: "doc" },
  { id: "kedai", name: "Kedai", icon: "bag" },
  { id: "ahli", name: "Ahli", icon: "person3" },
] as const;

export type PageId = (typeof PAGES)[number]["id"];

/** "Coach Aziz" -> "CA". Initials come from name parts, not the first two letters. */
const initialsOf = (name: string): string =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

// CupertinoIcons equivalents, drawn as strokes to match the app's line weight.
const Icon: React.FC<{ name: string; colour: string; size?: number }> = ({ name, colour, size = 17 }) => {
  const s = size;
  const p = { fill: "none", stroke: colour, strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
      {name === "chat" && <path d="M21 12a8 8 0 0 1-8 8H7l-4 3v-5.5A8 8 0 1 1 21 12z" {...p} />}
      {name === "envelope" && <><rect x="2.5" y="5" width="19" height="14" rx="2.5" {...p} /><path d="M3 7l9 6 9-6" {...p} /></>}
      {name === "calendar" && <><rect x="3" y="5" width="18" height="16" rx="2.5" {...p} /><path d="M3 10h18M8 3v4M16 3v4" {...p} /></>}
      {name === "doc" && <><path d="M6 2.5h8l4.5 4.5V21.5H6z" {...p} /><path d="M14 2.5V7h4.5M9 12h6M9 16h6" {...p} /></>}
      {name === "bag" && <><path d="M5 8h14l-1 13H6z" {...p} /><path d="M9 8V6a3 3 0 0 1 6 0v2" {...p} /></>}
      {name === "person3" && <><circle cx="12" cy="9" r="3.2" {...p} /><path d="M6 20a6 6 0 0 1 12 0" {...p} /><circle cx="4.5" cy="11" r="2.2" {...p} /><circle cx="19.5" cy="11" r="2.2" {...p} /></>}
      {name === "gear" && <><circle cx="12" cy="12" r="3.2" {...p} /><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2" {...p} /></>}
    </svg>
  );
};

/** ShellTopHeader — academy logo + name centred, settings gear right. */
const TopHeader: React.FC<{ academy: string }> = ({ academy }) => (
  <div style={{ height: 56, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", flexShrink: 0 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ width: 20, height: 20, borderRadius: 5, background: ui.primary }} />
      <span style={deskText.label}>{academy}</span>
    </div>
    <div style={{ position: "absolute", right: 16 }}>
      <Icon name="gear" colour={ui.tertiary} size={16} />
    </div>
  </div>
);

/** BusinessRail — width 72, 52px academy tiles. */
const Rail: React.FC<{ initials: string }> = ({ initials }) => (
  <div style={{ width: 72, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 10, gap: 10, flexShrink: 0 }}>
    <div style={{ width: 52, height: 52, borderRadius: 14, background: ui.primary, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <span style={{ fontFamily: UIFONT, fontSize: 18, fontWeight: 600, color: ui.white }}>{initials}</span>
    </div>
    <div style={{ width: 52, height: 52, borderRadius: 14, background: ui.secondary, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <span style={{ fontFamily: UIFONT, fontSize: 26, fontWeight: 300, color: ui.success, lineHeight: 1 }}>+</span>
    </div>
  </div>
);

/** Sidebar — width 240, page list; active row = primary, others tertiary. */
const Sidebar: React.FC<{ active: PageId; user: string }> = ({ active, user }) => (
  <div style={{ width: 240, flexShrink: 0, display: "flex", flexDirection: "column", padding: `${10}px ${10}px`, boxSizing: "border-box" }}>
    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
      {PAGES.map((pg) => {
        const on = pg.id === active;
        const c = on ? ui.white : ui.tertiary;
        return (
          <div key={pg.id} style={{ height: 34, borderRadius: 8, background: on ? ui.primary : "transparent", display: "flex", alignItems: "center", padding: `0 ${10}px`, gap: 6 }}>
            <Icon name={pg.icon} colour={c} size={16} />
            <span style={{ ...deskText.label, color: c, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{pg.name}</span>
          </div>
        );
      })}
    </div>
    <div style={{ height: 44, display: "flex", alignItems: "center", gap: 8, borderTop: `1px solid ${ui.border}`, paddingTop: 8 }}>
      <div style={{ width: 26, height: 26, borderRadius: "50%", background: ui.secondary, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <span style={{ fontFamily: UIFONT, fontSize: 11, fontWeight: 600, color: ui.white }}>{initialsOf(user)}</span>
      </div>
      <span style={{ ...deskText.meta, whiteSpace: "nowrap" }}>{user}</span>
    </div>
  </div>
);

/**
 * The desktop portal shell. `children` is the routed page content; `aside` is
 * the right-hand chart panel (320 in the real layout).
 */
// =============================================================================
// Bil page — recreated from bills_content.dart + selector_widgets.dart
// =============================================================================
// Sliver structure: SelectorSectionLabel('TARIKH') → day chips → 'STATUS' →
// status chips → 'INVOIS' → bill list. Chip geometry from ChipShape:
//   narrow: 48x71, vertical pad 6, radius 6, top-aligned (day chips)
//   chip:   shrink-wrap, h32, horizontal pad 10, radius 6 (status chips)
//   wide:   full width, h48, horizontal pad 10, radius 6 (bill rows)
// Chips sit 6 apart; page padding 10. Day chip: month abbr (meta), day (label),
// overdue count (meta, error) when positive. Status chips show 'Label (count)'
// tinted by the status accent, none selected in the unfiltered state.

const DeskSectionLabel: React.FC<{ label: string }> = ({ label }) => (
  <div style={{ padding: 10 }}><span style={deskText.meta}>{label}</span></div>
);

const DayChip: React.FC<{ month: string; day: string; overdue?: string; on?: boolean }> = ({ month, day, overdue, on }) => (
  <div style={{ width: 48, height: 71, borderRadius: 6, background: on ? ui.primary : ui.secondary, padding: "6px 0", boxSizing: "border-box", display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
    <span style={{ ...deskText.meta, color: on ? ui.white : ui.tertiary }}>{month}</span>
    <span style={deskText.label}>{day}</span>
    {overdue ? <span style={{ ...deskText.meta, color: ui.error }}>{overdue}</span> : null}
  </div>
);

const StatusChip: React.FC<{ label: string; accent: string }> = ({ label, accent }) => (
  <div style={{ height: 32, borderRadius: 6, background: ui.secondary, padding: "0 10px", display: "flex", alignItems: "center", flexShrink: 0 }}>
    <span style={{ ...deskText.label, color: accent }}>{label}</span>
  </div>
);

const BillDeskRow: React.FC<{ desc: string; name: string; amount: string; outstanding?: boolean }> = ({ desc, name, amount, outstanding }) => (
  <div style={{ height: 48, borderRadius: 6, background: ui.secondary, padding: "0 10px", display: "flex", alignItems: "center", justifyContent: "space-between", boxSizing: "border-box" }}>
    <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
      <span style={{ ...deskText.label, whiteSpace: "nowrap" }}>{desc}</span>
      <span style={{ ...deskText.meta, whiteSpace: "nowrap" }}>{name}</span>
    </div>
    <span style={{ ...deskText.label, color: outstanding ? ui.error : ui.white, fontVariantNumeric: "tabular-nums" }}>{amount}</span>
  </div>
);

/**
 * The Bil page in the desktop shell — the evidence screenshot the Pengurus
 * sends after "28 bil dihantar." Figures tie to Scene A: 28 Jun bills at RM80
 * (the action sheet's RM2,240 total), 3 outstanding reminders.
 */
export const BilDeskPage: React.FC = () => (
  <DesktopShell active="bil" pageTitle="Bil">
    <DeskSectionLabel label="TARIKH" />
    <div style={{ display: "flex", gap: 6, padding: "0 10px" }}>
      <DayChip month="Jun" day="2" overdue="3" on />
      <DayChip month="Jun" day="1" />
      <DayChip month="Mei" day="31" />
    </div>
    <DeskSectionLabel label="STATUS" />
    <div style={{ display: "flex", gap: 6, padding: "0 10px" }}>
      <StatusChip label="Belum Bayar (3)" accent={ui.error} />
      <StatusChip label="Dihantar (28)" accent={ui.primary} />
    </div>
    <DeskSectionLabel label="INVOIS" />
    <div style={{ display: "flex", flexDirection: "column", gap: 6, padding: "0 10px" }}>
      <BillDeskRow desc="Yuran Bulanan Jun" name="Adam Haris" amount="RM80.00" outstanding />
      <BillDeskRow desc="Yuran Bulanan Jun" name="Nur Aisyah" amount="RM80.00" outstanding />
      <BillDeskRow desc="Yuran Bulanan Jun" name="Haris Idris" amount="RM80.00" outstanding />
      <BillDeskRow desc="Yuran Bulanan Jun" name="Siti Sarah" amount="RM80.00" />
      <BillDeskRow desc="Yuran Bulanan Jun" name="Danial Zikri" amount="RM80.00" />
      <BillDeskRow desc="Yuran Bulanan Jun" name="Aiman Syafiq" amount="RM80.00" />
      <BillDeskRow desc="Yuran Bulanan Jun" name="Irfan Hakim" amount="RM80.00" />
      <BillDeskRow desc="Yuran Bulanan Jun" name="Amir Danish" amount="RM80.00" />
      <BillDeskRow desc="Yuran Bulanan Jun" name="Hafiz Iman" amount="RM80.00" />
      <BillDeskRow desc="Yuran Bulanan Jun" name="Zharif Aiman" amount="RM80.00" />
      <BillDeskRow desc="Yuran Bulanan Jun" name="Ryan Lee" amount="RM80.00" />
    </div>
  </DesktopShell>
);

export const DesktopShell: React.FC<{
  children: React.ReactNode;
  aside?: React.ReactNode;
  active: PageId;
  pageTitle: string;
  academy?: string;
  user?: string;
}> = ({ children, aside, active, pageTitle, academy = "Akademi Tunas Muda", user = "Coach Aziz" }) => {
  usePjs();
  return (
    <AbsoluteFill style={{ background: ui.black, display: "flex", flexDirection: "column" }}>
      <TopHeader academy={academy} />
      <div style={{ flex: 1, display: "flex", minHeight: 0 }}>
        <Rail initials="AT" />
        {/* Panel: shared top-left radius 26 + left/top border, per _DesktopLayout. */}
        <div style={{ flex: 1, display: "flex", borderTopLeftRadius: 26, borderLeft: `1px solid ${ui.border}`, borderTop: `1px solid ${ui.border}`, overflow: "hidden", minWidth: 0 }}>
          <Sidebar active={active} user={user} />
          <div style={{ width: 1, background: ui.border, flexShrink: 0 }} />
          <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
            <div style={{ height: 52, display: "flex", alignItems: "center", padding: `0 ${20}px`, flexShrink: 0 }}>
              <span style={deskText.title}>{pageTitle}</span>
            </div>
            <div style={{ flex: 1, display: "flex", minHeight: 0 }}>
              <div style={{ flex: 1, padding: 10, minWidth: 0, overflow: "hidden" }}>{children}</div>
              {aside ? (
                <div style={{ width: 320, flexShrink: 0, borderLeft: `1px solid ${ui.border}`, padding: 10, boxSizing: "border-box", display: "flex", flexDirection: "column", gap: 10 }}>
                  {aside}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
