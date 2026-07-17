# Phase 2 — Texture & depth (backlog #1)

Status: **queued, not started.** Written during the Phase 1 restructure so it
survives; gets its own plan when we start it.

## Why

The user shared `Recording 2026-07-17 073006.mp4` — a screen-recording of
Anthropic's **"Dispatch"** launch video (the "Dispatch-reference" this backlog was
always pointing at) — as the quality bar. Frame-by-frame analysis against our v7:

**The gap is staging & polish, not style.** We already match the design language:
cream canvas, editorial serif headlines, coral accent, phone floating in a warm
frame, two-layer narration/product rule. What the reference has that we don't:

1. **Texture & depth** — a faint grid/graph-paper texture behind the chat, soft
   warm gradient washes rising from the phone, a larger diffuse phone shadow.
   Ours is flatter: solid cream, harder edges.
2. **Evidence bubbles** — the AI replies with a real embedded app screenshot inside
   a chat bubble (theirs shows a "Cueform/Library" screen). Ours only describes
   results in text.
3. **Multi-device staging** — phone chat + a full desktop app side-by-side, joined
   by a hand-drawn squiggle arrow; one action flows across both devices. This is
   their signature move and the single biggest visual gap. We have none.
4. Illustrated spot art in hero moments, per-shot spring tuning, unhurried pacing.

**Decisions locked:** keep **PORTRAIT** 1080x1920 (theirs is landscape web-hero;
ours targets social/Reels — adopt their look and staging, not their orientation).
Work the backlog **one by one**, cheapest-highest-payoff first.

## Phase 2 scope — backlog #1 only

Additive styling on existing surfaces. No timeline, copy, scene, or frame-timing
changes: the video's *content* stays identical, only its richness changes. This one
step lifts every existing scene at once.

Target surfaces (post-restructure paths):

- `src/shared/ui/phone.tsx` → `PhoneFrame`. Already has the seeds: a white radial
  glow and a small 620x60 shadow ellipse.
- `src/shared/ui/phone.tsx` → `AppScreen`: the dark full-bleed chat canvas — where
  the **grid texture** belongs (the reference's grid sits *inside* the phone,
  behind the chat).
- `src/products/mybola/videos/launchV4.tsx` → `ChatShell`: only if layer order
  needs adjusting so texture sits behind bubbles.

Changes:

1. **Bigger, softer phone shadow.** Replace the single 620x60 ellipse with a
   layered drop shadow: a wider, more-diffuse ellipse beneath + a soft ambient
   `box-shadow` on the phone body. Warm-tinted `rgba(31,27,22,…)`, low opacity,
   large blur — the reference's grounded, floating-but-anchored look.
2. **Gradient washes.** 1-2 soft low-alpha warm blooms in the cream field around
   the phone, above the existing white radial glow, rising from the bottom. Coral
   stays OUT of the phone — these live in the narration layer only.
3. **Grid texture behind chat.** Faint graph-paper grid as the backmost layer
   inside `AppScreen`, behind bubbles/omnibar: CSS `repeating-linear-gradient` in
   both axes, white at ~2-4% alpha over the dark canvas, ~40-48px cells. Optionally
   a gentle vignette so it fades at the edges. Pure CSS — no asset, renders
   identically headless.
4. **Keep it subtle.** The reference textures are barely-there. Tune alphas low and
   verify on extracted frames, not in code.

Because `PhoneFrame`/`AppScreen` are now shared, this styling lands once and
benefits every future product/video — which is why the restructure went first.

## Verification

- `npm run render:mybola-v4`, then extract frames at the usual transition
  timestamps (2s greeting, 15s card, 30s WA, 44s close) **plus** an in-phone chat
  frame (~6-8s, Scene A) where the grid should show. LOOK at them.
- Compare against the Dispatch reference frames (scratchpad: `ref_5.png` chat,
  `ref_28.png`/`ref_34.png` depth) — moved toward that depth without overdoing it.
- Narration frames must be unchanged except the added cream-field wash; coral still
  absent inside the phone; phone still doesn't move (camera-only zoom).
- Renderer note: separate render processes are NOT bit-identical (SSIM ~0.9999
  run-to-run even from unchanged code). Judge by eye + SSIM order-of-magnitude, not
  md5.

## Later phases

- **#2 Evidence bubbles** — AI sends an embedded real app screenshot. Needs a real
  MyBola app screen to show (confirm which screen + whether a source render exists).
- **#3/#4 Multi-device + squiggle** — phone↔desktop staging with the connecting
  arrow and simulated cursor. Needs a real MyBola desktop/admin-portal UI to
  recreate honestly per the code-exact-UI rule — confirm one exists in
  `flutter/lib/` before planning.
- **#5** per-shot spring tuning in Studio. **#6** real Axiforma if licensed.
- **SFX re-timing** (carried over): `products/mybola/audio/make_audio.py` cue times
  still match the old 34.4s layout, not v7's 46.1s boundaries.

## Reference frames

Extracted from the Dispatch recording into the session scratchpad:
`ref_1.png` (illustrated hero), `ref_5.png` (chat + texture + gradient),
`ref_16.png` (phone + Calendar + squiggle), `ref_22.png` (evidence bubble),
`ref_28.png` (phone + PixelForge), `ref_34.png` (phone + Finder, depth).
Re-extract with `ffmpeg -ss <t> -i "Recording 2026-07-17 073006.mp4" -frames:v 1`.
