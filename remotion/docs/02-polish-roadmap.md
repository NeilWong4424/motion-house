# Phase 2 — Polish roadmap: closing the gap to the Dispatch reference

Status: **planned, not started.** Six steps, ordered cheapest-highest-payoff first.
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

## Step 2 — Evidence bubbles

**Why second:** medium effort, strong credibility boost. "Show, don't tell" is a big
part of why the reference reads as a product demo rather than a mockup.

**The move:** the AI's reply includes a real app screen as an image inside the chat
bubble (reference `ref_22.png`: a "Cueform/Library" screenshot inline in chat).

**Approach**

- Add an `ImageBubble` (or extend `RealBubble`) in `src/shared/ui/chat.tsx` — a
  media body with the app's bubble tint/corner language. `FileChip` and `WADoc` are
  the existing precedents for media bodies; match their construction.
- The screen shown must be **real UI, recreated in code** per the code-exact-UI
  rule — not a screenshot file, not an invented card. Good candidates that already
  exist in the Flutter source:
  - `portal/admin/academy/bills/bills_content.dart` — the bills list, pairs with
    Scene A's "28 bil dihantar"
  - `portal/admin/academy/sessions/sessions_content.dart` — attendance, pairs with
    Scene B's "22/24 hadir"
- Render that screen small inside the bubble (the existing `SC` scale trick and
  `transform: scale()` on a full-width subtree is the established pattern — see
  `PhoneFrame`'s inner 1080-wide scaled container).

**Watch out:** this adds content to a scene whose frame budget is already tuned.
Either give the bubble its own beat or lengthen the scene — don't cram it.

**Done when:** the evidence bubble reads as the real app at a glance, and the scene
still breathes.

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

## Carried-over bug (independent of these steps)

**SFX cue times are stale.** `products/mybola/audio/make_audio.py` → `VIDEOS`
→ `MyBolaV4` → `typing`/`pops` timestamps were authored against the older 34.4s
layout and were never realigned to v7's 46.1s scene boundaries, so taps and pops no
longer land on their sends. The music bed is correct (`duration: 46.2`). Fix by
deriving cue times from the scene-boundary frame constants in `launchV4.tsx` rather
than hand-typing seconds. Worth doing alongside Step 5, since that step may move the
boundaries anyway.

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
