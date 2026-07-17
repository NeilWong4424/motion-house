# Motion graphics studio (Remotion)

A code-driven studio for **any kind of motion graphic** — launch films, explainers,
teasers, stings — each with its own design language and format. Remotion (React +
TypeScript), rendered to MP4.

**You are the director here, not a code generator.** When someone asks for a video,
run the staged flow in `.claude/skills/video/SKILL.md`: interview the brief →
propose a design language → agree a storyboard → build → render and critique your
own frames. Gate each stage; don't build the wrong film beautifully. That skill is
also the `/video` command.

**Read `docs/03-motion-craft.md` before building anything.** It's the quality bar
(Apple keynote / LoL Worlds explainer) as concrete, checkable rules.

**MyBola is the first product, not the house style.** It's a Malaysian football
academy management SaaS; its current cut is v7 (~49s, composition id `MyBolaV4`),
with `MyBolaLaunch` the older v3. Its "warm editorial" look (cream/serif/coral, the
two-layer phone rule) lives in `products/mybola/design.ts` as **one design language
among many** — the MyBola-specific rules below describe *that* language, not a law
for every video. Nothing in `shared/` assumes a look.

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

`shared/` is **style-agnostic** — it never assumes a look. `products/<name>/` owns
one product's design language, brand, videos and audio. A video is a `VideoDef` in
a registry; adding one never touches `Root.tsx`.

- `src/Root.tsx` — maps the registry to Remotion `<Composition>`s. Never edit to
  add a video.
- `src/shared/engine/` — `types.ts` (`VideoDef`, `defineVideo`, format presets:
  `PORTRAIT`/`LANDSCAPE`/`SQUARE`/`CINEMA`), `registry.ts` (concatenates each
  product's `videos` array)
- `src/shared/design/` — `types.ts` (`DesignLanguage`: palette by role, type specs,
  motion profile, grain), `fonts.tsx` (loads whatever a language declares)
- `src/shared/motion/` — the craft layer. `easing.ts` (`EASE`, `SPRING`, `STAGGER`
  presets), `reveal.tsx` (`Rise`, `Stagger`, `TextReveal`, `MaskWipe`, `CountUp`,
  `Parallax`), `transitions.tsx` (`FadeIn`, `Drift`, `Camera`, `DipTo`, `Push`)
- `src/shared/narration/primitives.tsx` — serif layer + legacy font loader
  (`useFonts`, `SERIF`/`SANS`) kept for the v7 cut
- `src/shared/ui/` — generic app chrome only: `theme.tsx` (tokens, type scale,
  `usePjs`), `chat.tsx` (RealBubble, Omnibar, ActionSheet, StatCard), `phone.tsx`
  (`StatusBar`), `whatsapp.tsx` (WA dark theme — product-neutral)
- `src/products/mybola/` — `design.ts` (its DesignLanguage), `brand.ts`,
  `appTheme.ts` (app tokens from the Flutter source), `ui/phone.tsx` (**its**
  device staging — PhoneFrame/AppScreen), `videos/`, `index.ts`,
  `audio/make_audio.py` (per-video cue tables)
- `src/legacy/` — v3-era code, kept renderable (`MyBolaLaunch`), not on the
  shared primitives
- `public/fonts/` — woff2 the loader reads. Add a family by copying weights from
  `node_modules/@fontsource/<family>/files/` (installed: Inter, Playfair Display,
  Plus Jakarta Sans). No network at render time, so fonts must be local.
- `docs/` — `02-polish-roadmap.md` (MyBola's six-step quality plan),
  `03-motion-craft.md` (**the quality bar — read before building**)

### Adding a video (same product)

1. Add `src/products/<product>/videos/<name>.tsx`; compose from `shared/motion`;
   read every colour/font/timing from that product's `design.ts`.
2. Export a `VideoDef` via `defineVideo({ id, component, durationInFrames })` —
   spread a format preset for anything non-portrait. Ids: letters/digits/`-` only,
   **no underscores** (Remotion rejects them).
3. List it in that product's `index.ts`. It now appears in Studio and renders via
   `npm run render <id> out/<id>.mp4`.
4. Add an entry to `VIDEOS` in `audio/make_audio.py` if it needs a score.

### Adding a product / a new design language

Create `src/products/<name>/` with its own `design.ts`, `videos/`, `index.ts`, then
import its `videos` into `shared/engine/registry.ts`. Nothing in other products
changes. Anything style-specific — device staging, app UI recreations — lives under
that product, never in `shared/`.

**Never hardcode a hex or font family inside a scene.** That's how a repo drifts
back to a single house style. Scenes ask the design language for `accent`, never
"the coral one".

## MyBola's design language — the two-layer rule

Applies to MyBola videos (`products/mybola/design.ts`), not to every video.

1. **Narration layer** — cream canvas `#E8E0D3`, ink `#1F1B16`, coral `#C15F3C`,
   Playfair serif. Greeting, punctuation cards (with letterspaced MYBOLA kicker),
   and the KINI DILANCARKAN close live here. Coral NEVER appears inside the phone —
   the accent belongs to the storyteller, not the product.
2. **Product layer** — everything inside `PhoneFrame`: the real dark app UI.
   The phone NEVER moves; only the camera zooms (scale on the whole frame).

## Code-exact UI rule (critical)

**Whenever a real product's UI appears on screen, it must match that product's real
source exactly — never an invented approximation.** This is what separates a
credible product film from a mockup. It applies to any product, not just MyBola.

For MyBola, every UI figure inside the phone must match the real Flutter app source
at `../../project-4/flutter/lib/` (relative to this repo's parent):

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

## Copy (MyBola)

All on-screen copy in **MyBola** videos is Bahasa Malaysia. AI label is "Pengurus". Demo cast:
coach ("Anda"), player Adam Haris (U-12), parent Puan Aida. Times: admin 9:41 AM,
parent 9:02 PM — status bar clock must match bubble timestamps.

## Audio

`src/products/mybola/audio/make_audio.py` synthesizes the score (see `score.py`)
plus UI SFX (typing taps before sends, send/receive pops). It is **per-video**: each entry
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

**Mix levels — music is a BED, not a layer.** Measured against the Dispatch
reference: it sits at **mean −37 dB, max −18 dB**. Our first cuts ran at −21/−4,
roughly 15 dB hot and peaking near clipping, which is a large part of why they
felt cheap. Mix music at `volume=0.05` and SFX at `volume=0.22`:

```
ffmpeg -i out/<Id>.mp4 -i out/audio/<Id>-music.wav -i out/audio/<Id>-sfx.wav   -filter_complex "[1:a]volume=0.05[m];[2:a]volume=0.22[s];[m][s]amix=inputs=2:duration=first:normalize=0[a]"   -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 192k out/<Id>-final.mp4
```

Then verify: `volumedetect` should report **mean ≈ −37 dB, max ≈ −18 dB**, and a
tap window should still peak ~−19 dB so the SFX reads above the bed.

**The score is written to the cut.** `score.py` is a FREE-TIME score — no drum
pulse, no bar grid — because this edit's scene gaps are 3.33/6/7s and 3.33s isn't
a musical duration at any tempo (best fit across 56-120bpm still drifted ~58ms per
cut; a grid would fight the picture and you'd hear it). Instead each `VIDEOS` entry
carries a `cuts` list — the film's actual scene-change times — and chord changes
land exactly on them (verified: 10/10 within 50ms). `payoff_at` marks the film's
turn: the harmony lifts to the relative major and the glass bell sounds ONCE.

**Recompute `cuts` whenever a scene length changes**, or the score drifts off the
edit. The instruments match the design language: felt piano (voice), bowed strings
(bed), upright bass (floor), glass bell (the accent, used once — scarcity, exactly
like coral in the visual layer). No drums: a pulse would make it a promo.


## Verify before declaring done

Render stills at each scene's key frame and LOOK at them; after full renders,
extract frames at transitions (`ffmpeg -ss <t> -frames:v 1`) and check audio
(`volumedetect`: mean ≈ −37 dB, max ≈ −18 dB — matching the reference; SFX
present in typing windows).

**Renders are not bit-reproducible.** Two renders of identical, unchanged code
produce different md5s and SSIM ≈ 0.9999 (font rasterization/JPEG timing varies per
render process). Never use md5 equality to judge whether a refactor changed the
video — compare frames by eye, and treat SSIM ≥ ~0.9997 as "within renderer noise".

## Backlog (from Dispatch-reference gap analysis, priority order)

**Read `docs/02-polish-roadmap.md` before starting any of these** — it carries the
reference analysis, the portrait-framing constraints, and per-step done criteria.

1. ~~Texture & depth~~ — DONE (shadow was real; grid and washes were invented).
2. ~~Evidence bubbles~~ — DONE (`RealBubble` media props + `BilDeskPage` in the
   desktop shell, scaled into the chat; Scene A lengthened, cut now ~49s).
3. Multi-device scene: phone + admin portal side by side, coral squiggle joining
   them. Real portal source exists at `flutter/lib/portal/admin/academy/*_content.dart`;
   Step 2 already proved the portal renders at arbitrary scale. **← next**
4. Simulated cursor interaction on the desktop side (menu click, export flow).
5. Hand-tune spring configs per shot in Studio; consider longer scenes (ours 49s vs
   the reference's 1:13). If scene lengths move, update `duration` AND `cuts` in `VIDEOS`.
6. Real Axiforma font files if licensed (swap in `public/fonts/` + the PJS loader
   in `shared/ui/theme.tsx`).
7. ~~Realign MyBolaV4's SFX cue times~~ — DONE alongside step 2 (cues re-derived
   from launchV4.tsx frames; V4 now also has `cuts`/`payoff_at`).
