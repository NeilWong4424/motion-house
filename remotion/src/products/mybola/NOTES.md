# MyBola — production notes & Dispatch-reference work-log

**Product-specific.** This is MyBola's own reference analysis and polish log — the
measured gap to Anthropic's "Dispatch" launch film, step by step. The *universal*
craft rules it taught (measure your reference before building; hold the camera;
music as a quiet bed) live in `craft/motion-craft.md`; this file keeps only the
MyBola-and-Dispatch specifics — exact pixel measurements, scene constants, the
coral/phone rule, the Bahasa copy. When starting a new product, write its own
notes file like this one; don't generalise from these numbers.

MyBola is a Malaysian football academy management SaaS. Its current cut is v7
(~49s, composition id `MyBolaV4`). The "warm editorial" look
(cream/serif/coral, the two-layer phone rule) lives in code in
`products/mybola/design.ts` — it is **one design language among many**, not the
house style. The rules in this section describe *that* language; nothing in
`shared/` assumes them.

---

## Design language — the two-layer rule

1. **Narration layer** — cream canvas `#E8E0D3`, ink `#1F1B16`, coral `#C15F3C`,
   Playfair serif. Greeting, punctuation cards (with letterspaced MYBOLA kicker),
   and the KINI DILANCARKAN close live here. Coral NEVER appears inside the phone —
   the accent belongs to the storyteller, not the product.
2. **Product layer** — everything inside `PhoneFrame`: the real dark app UI.
   The phone NEVER moves; only the camera zooms (scale on the whole frame).

## Code-exact UI — the real Flutter source

The universal rule (any on-screen product UI matches its real source exactly)
lives in `CLAUDE.md`. For MyBola, every UI figure inside the phone must match the
real Flutter app source at `../../project-4/flutter/lib/` (relative to this
repo's parent):

- Tokens: `lib/core/app_theme.dart` — primary #0091FF, secondary #1C1C1E,
  border #1A1A1A, success #30D158, error #FF4245, tertiary 33% white.
  Text roles: body 16/400, title 17/500, label 15/500, meta 13/500 tertiary.
- Bubbles: `lib/widgets/media/message_bubble.dart` — AI = primary @20% alpha,
  corners 12/12/4(bl)/12; user = secondary, 12/12/12/4(br); padding 10;
  caption "Pengurus · h:mm a" in meta below.
- Omnibar: `lib/portal/chat/chat_omnibar/chat_omnibar.dart` — GlassShell
  (radius 16, blur, margin 10), row: attach, mic, slash-chip 15x15, field
  (hint "Semua urusan bermula di sini...", processing "Pengurus sedang memproses
  permintaan anda…"), send 32x32 arrow-RIGHT (blue when text present).
- Action sheet: `lib/portal/chat/chat_omnibar/chat_action_card.dart` —
  ActionSummaryCard (title/subtitle/field rows) + numbered DesktopButtons
  (h28, radius 6, "1. Kemaskini" primary, "2. Padam" error, "0. Batal dan
  kembali" secondary). Transcript dims to 0.2 behind it.
- Scale: 390pt logical width → 1080px content = 2.7x (`SC` in shared/ui/theme.tsx).
- WhatsApp scene: exact WA dark theme (bg #0B141A, bar #202C33, out #005C4B,
  ticks #53BDEB, send circle #00A884).

## Copy

All on-screen copy in MyBola videos is Bahasa Malaysia. AI label is "Pengurus".
Demo cast: coach ("Anda"), player Adam Haris (U-12), parent Puan Aida. Times:
admin 9:41 AM, parent 9:02 PM — status bar clock must match bubble timestamps.

## Audio — score & mix

`audio/make_audio.py` synthesizes the score (see `score.py`) plus UI SFX (typing
taps before sends, send/receive pops). **Per-video**: each entry in its `VIDEOS`
dict carries that cut's `duration` and cue table, so a new video adds a dict
entry rather than editing the synthesis code. Convenience: `npm run audio:mybola-v4`
→ `out/audio/MyBolaV4-{music,sfx}.wav`. The universal mux command is in `CLAUDE.md`.

**Measured mix targets** (against the Dispatch reference): music sits at
**mean −37 dB, max −18 dB**. Our first cuts ran −21/−4 — ~15 dB hot, peaking near
clipping, a large part of why they felt cheap. Mix music at `volume=0.05`, SFX at
`volume=0.22`; verify `volumedetect` reports mean ≈ −37 / max ≈ −18 dB, with tap
windows still peaking ~−19 dB so SFX reads above the bed.

**The score is written to the cut.** `score.py` is a FREE-TIME score — no drum
pulse, no bar grid — because this edit's scene gaps are 3.33/6/7s and 3.33s isn't
a musical duration at any tempo (best fit across 56-120bpm still drifted ~58ms per
cut; a grid would fight the picture). Each `VIDEOS` entry carries a `cuts` list —
the film's actual scene-change times — and chord changes land exactly on them
(verified 10/10 within 50ms). `payoff_at` marks the film's turn: harmony lifts to
the relative major and the glass bell sounds ONCE. **Recompute `cuts` whenever a
scene length changes**, or the score drifts off the edit. Instruments match the
design language: felt piano (voice), bowed strings (bed), upright bass (floor),
glass bell (the accent, used once — scarcity, exactly like coral in the visual
layer). No drums: a pulse would make it a promo.

---

## Polish work-log

Status: steps 1–2 shipped, 3–6 open. Ordered cheapest-highest-payoff first.
Each step is independently shippable — render, look, commit, move on.

## Why this exists

The user shared `Recording 2026-07-17 073006.mp4` — a screen-recording of
Anthropic's **"Dispatch"** launch video — as the quality bar, and asked what our gap
is. Frame-by-frame analysis against our v7 cut:

**The gap is staging and polish, not style.** We already match the design language:
cream canvas, editorial serif headlines, coral accent, phone floating in a warm
frame, the two-layer narration/product rule. Nothing about the look needs redoing.

What the reference has that we don't:

| Their move | Ours today |
|---|---|
| Faint grid texture behind chat, gradient washes, big diffuse shadow | Flat cream, hard edges, one small shadow ellipse |
| AI replies with a real embedded app screenshot | AI describes results in text only |
| Phone + full desktop app side-by-side, joined by a hand-drawn squiggle | Everything happens inside the phone |
| Simulated cursor driving the desktop app | No desktop at all |
| Per-shot hand-tuned springs, unhurried 1:13 pacing | Uniform springs, tight 46s |
| Real brand font (theirs is a licensed face) | Plus Jakarta Sans standing in for Axiforma |

**Decisions locked with the user:**

- **Keep PORTRAIT 1080x1920.** Theirs is landscape (a web-hero format); ours targets
  social/Reels. Adopt their *look and staging*, not their orientation. Every step
  below is designed to work in portrait.
- **Work one step at a time**, in the order below. Don't batch.

**Prerequisite met:** this roadmap assumes the `shared/` + `products/` restructure
(commit `5d04f43`). Steps 1-4 touch shared primitives, so the styling lands once and
every future product/video inherits it. That's why the restructure went first.

---

## Step 1 — Texture & depth — DONE (and two thirds of it was wrong)

**Status: shipped.** But only one of the three planned changes survived contact
with a measurement, which is worth recording.

I wrote this step from *looking* at compressed reference frames. Before building
it I measured them instead. Two of the three items turned out to be things I
thought I saw:

| Planned | Measured reality |
|---|---|
| "Grid texture behind chat" | Their chat bg is `rgb(250,248,244)` — a **light** theme. Flattest patch std = 2.68 with row/col profile std 0.55/0.80: that's JPEG noise, **not a grid**. No periodic structure exists. And their light chat doesn't transfer to MyBola's dark one anyway. |
| "Gradient washes in the cream field" | Their cream field measures **std 0.00 — perfectly flat**. There is no wash. |
| "Bigger, softer phone shadow" | **Real, and we were badly short.** See below. |

**What shipped — the shadow.** Measured on the reference: the cream darkens
**~11 luminance** at the device edge, falling off over **~18px** on a ~500px
phone — a soft ambient shadow.

Ours had **no side shadow at all**: cream met the black body in a single pixel,
a **184-luminance cliff**. The phone read as a sticker pasted on the page rather
than an object sitting in space. There was a bottom ellipse but nothing around
the body.

Fixed in `products/mybola/ui/phone.tsx` with a layered warm-tinted `box-shadow`
(three passes: tight contact, mid, wide ambient). Tuned by measurement, not by
eye: **depth 10.3 lum, falloff 22px** against the reference's 11 lum / ~18px
(≈32px scaled to our 902px phone). Narration frames verified still flat
(std 0.00) — matching the reference, which is also flat.

**The lesson for the rest of this roadmap:** these steps were written by eyeballing
a compressed recording. Measure each one before building it. Two of three items
here were invented.

---

## Step 2 — Evidence bubbles — DONE

**Status: shipped.** Measured first this time, per the Step 1 lesson.

**What the reference actually does (measured on `ref_22.png`):** the screenshot is
NOT inside the bubble's padding — it's a **separate rounded block below the reply
bubble**, left-aligned with it. On their ~500px phone: image 269px wide (~54% of
the interior), landscape aspect ~1.35 (it's a *desktop* app screen sent into a
phone chat), corner radius ~13px, ~6px gap to the bubble above. Scaled to our
1080px interior: 585px wide, radius 28, 13px gap.

**What shipped:**

- `RealBubble` in `src/shared/ui/chat.tsx` grew optional `media` /
  `mediaAtFrame` / `mediaWidth` / `mediaAspect` props: bubble → media block →
  caption, with the media on its own entrance spring so the screenshot lands as
  its own beat after the text. One deviation from app tokens, deliberate: the
  media frame's hairline is `rgba(255,255,255,0.14)`, not the app border
  `#1A1A1A`, because the app border is invisible black-on-black against the chat
  bg (the reference never had this problem — its chat is light).
- `BilDeskPage` in `products/mybola/ui/desktop.tsx`: the desktop Bil portal page
  recreated from `bills_content.dart` + `selector_widgets.dart` chip geometry
  (narrow day chips 48x71 r6, status chips h32, wide bill rows h48, 6px gaps,
  10px page padding), composed in the existing `DesktopShell`. Rendered at
  1280x950 (the measured ~1.35 aspect) and scaled 0.457 into the bubble.
- Scene A: the shot lands at f278 after "28 bil dihantar." (f243); the action
  sheet moved 268→358 and the scene lengthened 330→430f so nothing is crammed.
  Cut is now 49.43s.
- Audio: `make_audio.py` MyBolaV4 got the new duration **and** — since the
  boundaries moved anyway — the carried-over-bug fix: cue times re-derived from
  the actual launchV4.tsx frame constants, plus real `cuts`/`payoff_at` (the V4
  entry predated the scored-to-the-cut system and had neither). Verified mix:
  mean −39.6 dB / max −19.0 dB against the reference's −37/−18; typing window
  peaks −19.5 dB.

This also banked most of Step 3's prerequisite: the desktop portal now renders at
arbitrary scale inside another surface.

---

## Step 3 — Multi-device scene (phone ↔ desktop)

**Why third:** the single biggest "wow" gap, and the reference's signature move —
but it's the most work, and it depends on Step 2's technique for rendering app
screens at arbitrary scale.

**The move:** phone chat and a full desktop app sit side-by-side; one action flows
across both (reference `ref_16.png` Calendar, `ref_28.png` PixelForge,
`ref_34.png` Finder). A **hand-drawn coral squiggle arrow** connects them: "I asked
on my phone" → "it happened on my desktop."

**Prerequisite — CONFIRMED AVAILABLE.** This needs a real MyBola desktop UI, and one
exists: `flutter/lib/portal/` has desktop layouts —
`portal/admin/academy/{bills,members,sessions,products}/*_content.dart`, plus
`portal/shell/` (nav/chrome) and `portal/charts/`. Recreate from that source; do not
invent an admin UI.

**Approach**

- New `src/shared/ui/desktop.tsx`: a `DesktopFrame` (browser/OS window chrome) as
  the generic counterpart to `PhoneFrame` — product-neutral, canvas colour passed in
  like `PhoneFrame` takes `canvas`.
- New `src/products/mybola/portalUi.tsx`: the MyBola admin portal screens recreated
  from `portal/` source. Product-specific, so it lives with the product — same
  reasoning that split `realui` into `shared/ui` + `products/mybola`.
- `Squiggle` in `src/shared/narration/primitives.tsx`: an SVG path with
  `strokeDasharray`/`strokeDashoffset` animated to draw on. Coral, narration layer
  (it lives *outside* both devices, so coral is allowed).

**Portrait framing (this is the hard part).** The reference stages phone+desktop
side-by-side in landscape. In 1080x1920 that won't fit at readable size. Options,
in preference order:
1. **Stacked**: desktop window upper, phone lower, squiggle running down between
   them. Uses portrait's vertical axis instead of fighting it.
2. **Scaled + cropped**: desktop large and partially out-of-frame (the reference
   itself crops its desktop off the right edge — see `ref_16`/`ref_28`), phone
   overlapping in front, bottom-left.
3. Camera moves between the two devices rather than showing both — weakest, loses
   the simultaneity that makes the shot work.

Decide this with a still before building the whole scene.

**Done when:** one clear action visibly crosses devices, both UIs are code-exact,
and nothing is too small to read on a phone screen.

---

## Step 4 — Simulated cursor on the desktop side

**Why fourth:** it's a direct extension of Step 3 and meaningless without it.

**The move:** a cursor moves across the desktop UI and drives it — menu click,
export flow — so the desktop half is *doing something*, not just sitting there.

**Approach**

- `Cursor` component in `shared/ui/desktop.tsx`: an arrow SVG whose position
  interpolates between waypoints with eased springs; a subtle scale-dip on click.
- Pair each click frame with the UI's own state change (menu opens, row highlights)
  so cause and effect line up. Reuse the existing `atFrame` convention that every
  chat primitive already uses — don't invent a second timing idiom.
- The existing `PhoneFrame` `dipFrames` prop is the precedent for "react at these
  frames"; follow it.

**Done when:** the cursor's clicks and the UI's reactions are frame-locked, and the
motion reads as human (eased, slightly imperfect) rather than linear.

---

## Step 5 — Per-shot spring tuning

**Why fifth:** pure refinement; only worth doing once the shots themselves are final
(Steps 1-4 change what's on screen).

**The move:** the reference is unhurried and each beat lands. Ours uses near-uniform
spring configs everywhere because tuning was impractical in the original sandbox —
`npm run studio` now makes it a live, hot-reloading loop.

**Approach**

- Open Studio, scrub each beat, tune `damping`/`stiffness` per shot rather than
  accepting the shared defaults in `RealBubble` (17/135), `Serif` (14/130), etc.
- Consider lengthening scenes. Ours is 46s vs the reference's 1:13 — some of their
  quality is simply *room to breathe*. Scene lengths are the constants at the top of
  `launchV4.tsx` (`S1`, `A`, `C1`, …).
- **If any scene length changes, update `duration` in `VIDEOS` in
  `products/mybola/audio/make_audio.py`** or the audio will end early — the exact
  bug already hit once (`DUR` was 34.4 for a 46.1s cut).

**Done when:** no beat feels rushed; sends and replies have space around them.

---

## Step 6 — Real Axiforma

**Why last:** blocked on licensing, and a pure swap that touches nothing structural.

**The move:** the app's real UI font is Axiforma; we ship Plus Jakarta Sans as a
stand-in. If licensed, drop the woff2 files in `public/fonts/` and update the
`PJS_FONTS` table + `UIFONT` in `src/shared/ui/theme.tsx`.

**Note:** this shifts glyph metrics slightly, so re-check any text that sits near a
wrap boundary (the omnibar hint, longer bubbles) after swapping.

---

## Carried-over bug — FIXED in Step 2

**SFX cue times were stale** (authored against the old 34.4s layout). Fixed
alongside Step 2 since that step moved the boundaries anyway: MyBolaV4's cue
table is now derived from the frame constants in `launchV4.tsx` (the derivation
is recorded as a comment above the entry), and the entry gained `cuts` +
`payoff_at` so the score lands chord changes on the film's actual scene cuts
like V8/Parent already did. **Recompute the whole entry whenever a scene length
changes.**

---

## Verification (every step)

```bash
cd remotion
npm run render:mybola-v4
ffmpeg -ss <t> -i out/MyBolaV4.mp4 -frames:v 1 frame.png   # then LOOK at it
```

- Check transitions at 2s / 7s / 15s / 30s / 44s, plus an in-phone chat frame.
- Compare against the reference frames in this repo's scratchpad (`ref_5.png` chat
  and texture, `ref_22.png` evidence bubble, `ref_16.png`/`ref_28.png`/`ref_34.png`
  multi-device, depth and squiggle). Re-extract any time with:
  `ffmpeg -ss <t> -i "Recording 2026-07-17 073006.mp4" -frames:v 1 ref_<t>.png`
- Design rules still hold: coral never inside the phone, phone never moves (camera
  zoom only), no emoji, no invented UI, copy in Bahasa Malaysia.
- **Renders are not bit-reproducible** — unchanged code re-rendered gives a
  different md5 and SSIM ~0.9999. Judge by frames, never hashes.
- If scene lengths moved, re-run `npm run audio:mybola-v4` and confirm audio still
  covers the video (`ffprobe` durations) at ~-21 dB (`volumedetect`).
