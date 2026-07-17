# Product Videos (Remotion)

Code-driven product launch videos. Remotion (React + TypeScript), rendered to
portrait 1080x1920 MP4 at 30fps.

This repo holds **many videos across many products** — see Architecture below.
The first (and so far only) product is **MyBola**, a Malaysian football academy
management SaaS (AI admin assistant + AI parent inbox). Its current cut is v7
(~46s), composition id `MyBolaV4`; `MyBolaLaunch` is the older v3.

Most rules below (two-layer design, code-exact UI, copy) were written for MyBola
and describe the house style. A second product keeps the structural rules and
brings its own brand, app UI, and copy language.

## Commands

- `npm run studio` — live preview (primary dev loop; hot-reloads on save)
- `npm run render <CompositionId> out/<name>.mp4` — render any video by id
- `npm run render:mybola-v4` — render the current cut to `out/MyBolaV4.mp4`
- `npm run still <CompositionId> out/frame.png -- --frame=N` — single frame check
  (note the `--` before `--frame`, so npm passes the flag through)
- `npx remotion compositions src/index.ts` — list every registered video
- Audio: `npm run audio:mybola-v4` → `out/audio/MyBolaV4-{music,sfx}.wav`;
  mix with ffmpeg `amix` (see Audio section below)

## Architecture

The repo is multi-video and multi-product: `shared/` holds the engine and
brand-neutral primitives, `products/<name>/` holds one product's brand, app theme,
videos, and audio.

- `src/Root.tsx` — maps the registry to Remotion `<Composition>`s. Never edit to
  add a video.
- `src/shared/engine/` — `types.ts` (`VideoDef`, `defineVideo`), `registry.ts`
  (concatenates each product's `videos` array)
- `src/shared/narration/primitives.tsx` — serif layer: fonts loader, `FadeIn`,
  `Drift`, `Camera`, `SERIF`/`SANS`. Brand-neutral: colours/copy passed in.
- `src/shared/ui/` — `theme.tsx` (app tokens, type scale, `usePjs`),
  `chat.tsx` (RealBubble, Omnibar, ActionSheet, StatCard), `phone.tsx`
  (PhoneFrame, AppScreen, StatusBar), `whatsapp.tsx` (WA dark theme — product-neutral)
- `src/products/mybola/` — `brand.ts` (cream/ink/coral + kicker/wordmark/tagline),
  `appTheme.ts` (app tokens from the Flutter source), `videos/` (one file per cut,
  each exporting a `VideoDef`), `index.ts` (the product's video list),
  `audio/make_audio.py` (per-video cue tables)
- `src/legacy/` — v3-era `LaunchVideo.tsx` + `components.tsx` + `theme.ts`, kept
  renderable (`MyBolaLaunch`) but not built on the shared primitives
- `public/fonts/` — Playfair Display (serif narration), Plus Jakarta Sans (UI stand-in
  for Axiforma), Inter
- `docs/` — roadmap docs (`02-polish-roadmap.md` = the six-step quality plan)

### Adding a video (same product)

1. Add `src/products/mybola/videos/<name>.tsx`; build the timeline from
   `shared/narration` + `shared/ui`; read brand values from `../brand`.
2. Export a `VideoDef` via `defineVideo({ id, component, durationInFrames })`.
3. List it in `src/products/mybola/index.ts`. It now appears in Studio and renders
   via `npm run render <id> out/<id>.mp4`.
4. Add an entry to `VIDEOS` in `audio/make_audio.py` if it needs a score.

### Adding a product

Create `src/products/<name>/` with its own `brand.ts`, `appTheme.ts`, `videos/`,
`index.ts`, then import its `videos` into `shared/engine/registry.ts`. Nothing in
`products/mybola/` changes. Per the code-exact-UI rule, that product recreates its
OWN app UI under its folder — `shared/ui/` only carries generic chrome
(phone frame, status bar, bubble mechanics, WhatsApp).

## Design system — two-layer rule (critical)

1. **Narration layer** — cream canvas `#E8E0D3`, ink `#1F1B16`, coral `#C15F3C`,
   Playfair serif. Greeting, punctuation cards (with letterspaced MYBOLA kicker),
   and the KINI DILANCARKAN close live here. Coral NEVER appears inside the phone.
2. **Product layer** — everything inside `PhoneFrame`: the real dark app UI.
   The phone NEVER moves; only the camera zooms (scale on the whole frame).

## Code-exact UI rule (critical)

Every UI figure inside the phone must match the real Flutter app source at
`../../project-4/flutter/lib/` (relative to this repo's parent):

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
- No emoji in compositions (headless Chrome renders blank boxes). No invented
  UI cards — if it doesn't exist in the Flutter source, it doesn't go in the video.
- WhatsApp scene: exact WA dark theme (bg #0B141A, bar #202C33, out #005C4B,
  ticks #53BDEB, send circle #00A884).

## Copy

All on-screen copy is Bahasa Malaysia. AI label is "Pengurus". Demo cast:
coach ("Anda"), player Adam Haris (U-12), parent Puan Aida. Times: admin 9:41 AM,
parent 9:02 PM — status bar clock must match bubble timestamps.

## Audio

`src/products/mybola/audio/make_audio.py` synthesizes a chord-pad score plus UI
SFX (typing taps before sends, send/receive pops). It is **per-video**: each entry
in its `VIDEOS` dict carries that cut's `duration` and cue table, so a new video
adds a dict entry rather than editing the synthesis code.

```
npm run audio:mybola-v4        # -> out/audio/MyBolaV4-{music,sfx}.wav
ffmpeg -i out/MyBolaV4.mp4 -i out/audio/MyBolaV4-music.wav -i out/audio/MyBolaV4-sfx.wav \
  -filter_complex "[1:a][2:a]amix=inputs=2:duration=first:normalize=0[a]" \
  -map 0:v -map "[a]" -c:v copy -c:a aac out/MyBolaV4-final.mp4
```

`duration` must cover the full cut — audio shorter than the video silently ends
early (`amix duration=first` follows the first audio input).

**Known gap:** MyBolaV4's typing/pop cue times still match the older 34.4s layout,
not v7's 46.1s scene boundaries, so they no longer land on their sends. The music
bed is correct. Realigning the cues is a tracked follow-up (see `docs/`).

## Verify before declaring done

Render stills at each scene's key frame and LOOK at them; after full renders,
extract frames at transitions (`ffmpeg -ss <t> -frames:v 1`) and check audio
(`volumedetect`: mean ≈ −20 to −23 dB; SFX present in typing windows).

**Renders are not bit-reproducible.** Two renders of identical, unchanged code
produce different md5s and SSIM ≈ 0.9999 (font rasterization/JPEG timing varies per
render process). Never use md5 equality to judge whether a refactor changed the
video — compare frames by eye, and treat SSIM ≥ ~0.9997 as "within renderer noise".

## Backlog (from Dispatch-reference gap analysis, priority order)

**Read `docs/02-polish-roadmap.md` before starting any of these** — it carries the
reference analysis, the portrait-framing constraints, and per-step done criteria.

1. Texture & depth: grid behind chat, gradient washes, bigger soft shadow. **← next**
2. Evidence bubbles: AI sends a real app screen (bills list / attendance) in chat.
3. Multi-device scene: phone + admin portal side by side, coral squiggle joining
   them. Real portal source exists at `flutter/lib/portal/admin/academy/*_content.dart`.
4. Simulated cursor interaction on the desktop side (menu click, export flow).
5. Hand-tune spring configs per shot in Studio; consider longer scenes (ours 46s vs
   the reference's 1:13). If scene lengths move, update `duration` in `VIDEOS`.
6. Real Axiforma font files if licensed (swap in `public/fonts/` + the PJS loader
   in `shared/ui/theme.tsx`).
7. Realign MyBolaV4's SFX cue times to v7's scene boundaries (see Audio above).
