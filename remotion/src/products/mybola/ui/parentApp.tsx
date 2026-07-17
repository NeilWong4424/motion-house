import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { EASE } from "../../../shared/motion/easing";
import { SC, UIFONT, ui, uiText, usePjs } from "../appTheme";

// =============================================================================
// MyBola parent app — recreated from portal/auth/* and portal/user/*
// =============================================================================
// Code-exact rule: structure, copy and constants come from the Flutter source.
//
// login_screen.dart:  black scaffold + auth_bg.png (BoxFit.cover) + centred
//                     GlassShell(radius 26, pad 20) > "Selamat Datang Ke Mybola"
//                     (text.heading), 8, "Log masuk ke akaun anda" (text.label),
//                     12, then 240-wide Google/Apple DesktopButtons.
// glass_shell.dart:   ClipRRect + BackdropFilter(sigma 16) + secondary @ alpha 0.2.
// setup_profile_screen.dart: 2-step wizard in a PopupCard —
//                     step 0 'Nombor telefon' / 'Sila masukkan nombor telefon
//                     anda.' / placeholder '0123456789'
//                     step 1 'Nama pengguna' / 'Sila masukkan nama pengguna
//                     anda.' / placeholder 'cth. Ahmad Faizal'
//                     then updateUser + linkMembersByPhone(uid, phone) — the
//                     phone number is what attaches the parent to the member
//                     record the coach already created. That link IS the story.

const authBg = () => staticFile("images/auth_bg.png");

/** Shared black + auth_bg backdrop used by every auth screen. */
const AuthBackdrop: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  usePjs();
  return (
    <AbsoluteFill style={{ background: ui.black }}>
      <Img src={authBg()} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover" }} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: 40 * SC }}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};

/** GlassShell — blur 16, secondary @ 0.2, thin border. */
const Glass: React.FC<{ children: React.ReactNode; radius?: number; pad?: number; style?: React.CSSProperties }> = ({
  children,
  radius = 26,
  pad = 20,
  style,
}) => (
  <div
    style={{
      background: "rgba(28,28,30,0.20)",
      backdropFilter: "blur(16px)",
      WebkitBackdropFilter: "blur(16px)",
      border: `1px solid ${ui.border}`,
      borderRadius: radius * SC,
      padding: pad * SC,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      boxSizing: "border-box",
      ...style,
    }}
  >
    {children}
  </div>
);

const heading: React.CSSProperties = {
  fontFamily: UIFONT,
  fontSize: 20 * SC,
  fontWeight: 600,
  lineHeight: `${25 * SC}px`,
  letterSpacing: `${0.38 * SC}px`,
  color: ui.white,
  textAlign: "center",
};

/**
 * DesktopButton — button.dart exactly: height 28, radius 6, padding h16, and the
 * fill defaults to color.primary (the real buttons are blue, not grey).
 */
const Btn: React.FC<{ text: string; icon?: React.ReactNode; fill?: string; atFrame?: number; press?: number }> = ({
  text,
  icon,
  fill,
  atFrame = 0,
  press,
}) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [atFrame, atFrame + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // Tap feedback: a quick dip on the press frame.
  const p = press == null ? 0 : interpolate(frame, [press - 2, press, press + 4], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div
      style={{
        opacity: o,
        transform: `scale(${1 - 0.03 * p})`,
        width: "100%",
        height: 28 * SC,
        borderRadius: 6 * SC,
        background: fill ?? ui.primary,
        padding: `0 ${16 * SC}px`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8 * SC,
        boxSizing: "border-box",
      }}
    >
      {icon}
      <span style={{ ...uiText.label, color: ui.white }}>{text}</span>
    </div>
  );
};

/** Google "G" — brand mark, drawn rather than an emoji (headless renders those blank). */
const GoogleG: React.FC = () => (
  <svg width={16 * SC} height={16 * SC} viewBox="0 0 48 48" style={{ flexShrink: 0 }}>
    <path fill="#FFC107" d="M43.6 20.5h-1.9V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.0 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
    <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.0 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
    <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.3 0-9.7-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
    <path fill="#1976D2" d="M43.6 20.5h-1.9V20H24v8h11.3c-.8 2.2-2.2 4.1-4.1 5.6l6.2 5.2C39.9 35.7 44 30.4 44 24c0-1.3-.1-2.4-.4-3.5z" />
  </svg>
);

/** Login — the real screen: welcome copy + Google/Apple buttons in a glass shell. */
export const ParentLogin: React.FC<{ pressAt?: number }> = ({ pressAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - 4, fps, config: { damping: 16, stiffness: 120 } });
  return (
    <AuthBackdrop>
      <Glass style={{ opacity: s, transform: `translateY(${interpolate(s, [0, 1], [24, 0])}px)`, width: 300 * SC }}>
        <span style={heading}>Selamat Datang Ke Mybola</span>
        <div style={{ height: 8 * SC }} />
        <span style={{ ...uiText.label, textAlign: "center" }}>Log masuk ke akaun anda</span>
        <div style={{ height: 12 * SC }} />
        <div style={{ width: 240 * SC, display: "flex", flexDirection: "column", gap: 8 * SC }}>
          <Btn text="Log masuk dengan Google" icon={<GoogleG />} atFrame={10} press={pressAt} />
          <Btn text="Log masuk dengan Apple" atFrame={14} />
        </div>
      </Glass>
    </AuthBackdrop>
  );
};

/**
 * SetupStep — one step of the profile wizard (PopupCard: title, subtitle, field).
 * `typed` drives the field text so the viewer watches it being entered.
 */
export const ParentSetupStep: React.FC<{
  title: string;
  subtitle: string;
  placeholder: string;
  typedText?: string;
  startFrame?: number;
  charsPerFrame?: number;
  prefix?: string;
  cta?: string;
  ctaAt?: number;
  pressAt?: number;
}> = ({ title, subtitle, placeholder, typedText = "", startFrame = 0, charsPerFrame = 0.55, prefix, cta = "Seterusnya", ctaAt = 0, pressAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - 4, fps, config: { damping: 16, stiffness: 120 } });
  const n = Math.max(0, Math.min(typedText.length, Math.floor((frame - startFrame) * charsPerFrame)));
  const shown = typedText.slice(0, n);
  const caret = frame >= startFrame && Math.floor(frame / 9) % 2 === 0;
  return (
    <AuthBackdrop>
      <Glass style={{ opacity: s, transform: `translateY(${interpolate(s, [0, 1], [24, 0])}px)`, width: 300 * SC, alignItems: "stretch" }}>
        <span style={{ ...heading, textAlign: "left" }}>{title}</span>
        <div style={{ height: 6 * SC }} />
        <span style={uiText.meta}>{subtitle}</span>
        <div style={{ height: 16 * SC }} />
        {/* CupertinoTextField: secondary fill, radius 8, hint in text.hint. */}
        <div
          style={{
            height: 40 * SC,
            borderRadius: 8 * SC,
            background: ui.secondary,
            border: `1px solid ${ui.border}`,
            display: "flex",
            alignItems: "center",
            padding: `0 ${12 * SC}px`,
            gap: 2 * SC,
            boxSizing: "border-box",
          }}
        >
          {prefix ? <span style={{ ...uiText.body, color: ui.tertiary }}>{prefix}</span> : null}
          {shown.length ? (
            <span style={uiText.body}>
              {shown}
              {caret ? <span style={{ color: ui.primary }}>|</span> : null}
            </span>
          ) : (
            <span style={uiText.hint}>{placeholder}</span>
          )}
        </div>
        <div style={{ height: 14 * SC }} />
        <Btn text={cta} atFrame={ctaAt} press={pressAt} />
      </Glass>
    </AuthBackdrop>
  );
};

// =============================================================================
// Parent portal — user_home_screen.dart + akademi cards + bottom sheets
// =============================================================================

/** FloatingGlassNavBar — the parent portal's bottom tab bar. */
export const ParentNav: React.FC<{ active: "akademi" | "fasiliti" | "setting" }> = ({ active }) => {
  const tabs = [
    { id: "akademi", label: "Akademi" },
    { id: "fasiliti", label: "Fasiliti" },
    { id: "setting", label: "Setting" },
  ] as const;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 40 * SC, display: "flex", justifyContent: "center", zIndex: 6 }}>
      <div
        style={{
          background: "rgba(28,28,30,0.55)",
          backdropFilter: "blur(16px)",
          border: `1px solid ${ui.border}`,
          borderRadius: 24 * SC,
          padding: `${8 * SC}px ${10 * SC}px`,
          display: "flex",
          gap: 6 * SC,
        }}
      >
        {tabs.map((t) => {
          const on = t.id === active;
          return (
            <div key={t.id} style={{ padding: `${7 * SC}px ${16 * SC}px`, borderRadius: 18 * SC, background: on ? ui.primary : "transparent" }}>
              <span style={{ ...uiText.label, color: on ? ui.white : ui.tertiary, whiteSpace: "nowrap" }}>{t.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/** The parent's akademi screen: member cards for each linked child. */
export const ParentPortal: React.FC<{ children?: React.ReactNode; title?: string }> = ({ children, title = "Akademi" }) => {
  usePjs();
  return (
    <AbsoluteFill style={{ background: ui.black }}>
      <div style={{ height: 150 }} />
      <div style={{ padding: `0 ${16 * SC}px ${10 * SC}px` }}>
        <span style={{ fontFamily: UIFONT, fontSize: 28 * SC, fontWeight: 600, color: ui.white, letterSpacing: "-0.5px" }}>{title}</span>
      </div>
      {/* Demo lists are short; a shipped portal scrolls full. Centring keeps the
          composition balanced instead of stranding a card above a void. */}
      <div style={{ flex: 1, padding: `0 ${12 * SC}px ${120 * SC}px`, display: "flex", flexDirection: "column", justifyContent: "center", gap: 10 * SC }}>{children}</div>
    </AbsoluteFill>
  );
};

/** A linked member card — the child the coach registered, now on the parent's phone. */
export const MemberCard: React.FC<{ name: string; group: string; atFrame: number }> = ({ name, group, atFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - atFrame, fps, config: { damping: 15, stiffness: 130 } });
  if (frame < atFrame - 3) return null;
  return (
    <div
      style={{
        opacity: s,
        transform: `translateY(${interpolate(s, [0, 1], [26, 0])}px) scale(${interpolate(s, [0, 1], [0.96, 1])})`,
        background: ui.secondary,
        borderRadius: 16 * SC,
        padding: 18 * SC,
        display: "flex",
        alignItems: "center",
        gap: 14 * SC,
      }}
    >
      <div style={{ width: 52 * SC, height: 52 * SC, borderRadius: 12 * SC, background: ui.primary, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <span style={{ fontFamily: UIFONT, fontSize: 18 * SC, fontWeight: 600, color: ui.white }}>
          {name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase()}
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 3 * SC, minWidth: 0 }}>
        <span style={{ ...uiText.title, whiteSpace: "nowrap" }}>{name}</span>
        <span style={{ ...uiText.meta, whiteSpace: "nowrap" }}>{group}</span>
      </div>
    </div>
  );
};

/**
 * A bottom sheet, as the parent portal presents bill/session/shop.
 * Slides up from the bottom; the content behind dims (the app's own behaviour).
 */
export const ParentSheet: React.FC<{ children: React.ReactNode; atFrame: number; title: string; sub?: string }> = ({ children, atFrame, title, sub }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - atFrame, fps, config: { damping: 18, stiffness: 110 } });
  if (frame < atFrame - 3) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        transform: `translateY(${interpolate(s, [0, 1], [900, 0])}px)`,
        background: "rgba(28,28,30,0.92)",
        backdropFilter: "blur(16px)",
        borderTopLeftRadius: 26 * SC,
        borderTopRightRadius: 26 * SC,
        borderTop: `1px solid ${ui.border}`,
        padding: `${16 * SC}px ${16 * SC}px ${40 * SC}px`,
        zIndex: 8,
      }}
    >
      <div style={{ width: 40 * SC, height: 4 * SC, borderRadius: 2 * SC, background: ui.tertiary, margin: `0 auto ${16 * SC}px` }} />
      <span style={{ ...uiText.title, fontSize: 22 * SC }}>{title}</span>
      {sub ? (
        <>
          <div style={{ height: 4 * SC }} />
          <span style={uiText.meta}>{sub}</span>
        </>
      ) : null}
      <div style={{ height: 16 * SC }} />
      {children}
    </div>
  );
};

/** Status chip in the app's card-chip language: BELUM BAYAR / DIBAYAR / DIHANTAR. */
export const StatusChip: React.FC<{ label: string; tone: "error" | "success" | "primary" }> = ({ label, tone }) => {
  const c = tone === "error" ? ui.error : tone === "success" ? ui.success : ui.primary;
  return (
    <span
      style={{
        fontFamily: UIFONT,
        fontSize: 11 * SC,
        fontWeight: 600,
        letterSpacing: `${1.2}px`,
        color: c,
        border: `1px solid ${c}`,
        borderRadius: 6 * SC,
        padding: `${3 * SC}px ${8 * SC}px`,
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
};

/** MobileButton — the sheets' full-width action ("Bayar Sekarang" / "Beli Sekarang"). */
export const SheetButton: React.FC<{ text: string; atFrame?: number; pressAt?: number; tone?: "primary" | "success" }> = ({ text, atFrame = 0, pressAt, tone = "primary" }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [atFrame, atFrame + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.easeOutQuart });
  const p = pressAt == null ? 0 : interpolate(frame, [pressAt - 2, pressAt, pressAt + 4], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div
      style={{
        opacity: o,
        transform: `scale(${1 - 0.03 * p})`,
        height: 48 * SC,
        borderRadius: 25 * SC,
        padding: `0 ${16 * SC}px`,
        background: tone === "success" ? ui.success : ui.primary,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <span style={{ ...uiText.label, color: ui.white, fontSize: 16 * SC }}>{text}</span>
    </div>
  );
};

/** Size selector — the shop sheet's "Pilih Saiz". */
export const SizePicker: React.FC<{ sizes: string[]; chosen: string; chooseAt: number }> = ({ sizes, chosen, chooseAt }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ display: "flex", gap: 8 * SC }}>
      {sizes.map((z) => {
        const on = z === chosen && frame >= chooseAt;
        return (
          <div
            key={z}
            style={{
              width: 52 * SC,
              height: 40 * SC,
              borderRadius: 8 * SC,
              background: on ? ui.primary : ui.black,
              border: `1px solid ${on ? ui.primary : ui.border}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ ...uiText.label, color: on ? ui.white : ui.tertiary }}>{z}</span>
          </div>
        );
      })}
    </div>
  );
};
