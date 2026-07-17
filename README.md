# Project-4 Product Video

Product launch videos, built as code (Remotion). Portrait 1080x1920 MP4, 30fps.
Migrated from Claude Cowork for local development with VS Code + Claude Code.

The repo holds **many videos across many products**. MyBola (a Malaysian football
academy management SaaS) is the first product; its current cut is v7, composition
id `MyBolaV4`.

## Contents

- `remotion/` — the video project (source, fonts, docs, CLAUDE.md)
- `renders/` — delivered cuts (v5, v6, v7; v7 is current)

## Setup (once)

1. Install Node.js 20+ (nodejs.org) and ffmpeg (`winget install ffmpeg`)
2. Install Claude Code: `npm install -g @anthropic-ai/claude-code`
3. Open this folder in VS Code (recommended extensions will be suggested)
4. `cd remotion && npm install`

Python 3 + numpy are needed only for the audio synth script.

## How this repo is organised

Two ideas run the whole thing:

**1. A video is a `VideoDef` in a registry.** Each video exports
`defineVideo({ id, component, durationInFrames })`. Its product lists it in
`index.ts`, `shared/engine/registry.ts` collects every product's list, and
`Root.tsx` turns each entry into a Remotion composition. Nothing else needs editing.

**2. `shared/` is brand-neutral; `products/<name>/` owns the brand.** Shared code
is generic chrome only — phone frame, status bar, chat bubble mechanics, WhatsApp,
serif narration primitives. Anything that says *MyBola* — its colours, its wordmark,
its app UI — lives under `products/mybola/`.

```
remotion/src/
  shared/
    engine/      VideoDef + registry
    narration/   serif layer (fonts, FadeIn, Camera) — colours passed in
    ui/          theme, chat, phone, whatsapp — generic chrome
  products/
    mybola/
      brand.ts     cream/ink/coral + kicker, wordmark, tagline
      appTheme.ts  app tokens (from the Flutter source)
      videos/      one file per cut, each exporting a VideoDef
      audio/       per-video music + SFX synth
      index.ts     this product's video list
  legacy/        v3-era code, still renderable, not on the shared primitives
```

## Daily workflow

```bash
cd remotion
npm run studio                  # live preview; lists every video, hot-reloads
npx remotion compositions src/index.ts   # what can I render?
npm run render:mybola-v4        # -> out/MyBolaV4.mp4 (silent)
npm run audio:mybola-v4         # -> out/audio/MyBolaV4-{music,sfx}.wav
```

Then mix video + audio (video renders silent; audio is muxed in after):

```bash
ffmpeg -i out/MyBolaV4.mp4 -i out/audio/MyBolaV4-music.wav -i out/audio/MyBolaV4-sfx.wav \
  -filter_complex "[1:a][2:a]amix=inputs=2:duration=first:normalize=0[a]" \
  -map 0:v -map "[a]" -c:v copy -c:a aac out/MyBolaV4-final.mp4
```

Any video renders by id: `npm run render <CompositionId> out/<name>.mp4`.
Outputs are named per-id so videos never overwrite each other.

In another terminal run `claude` to make changes conversationally —
`remotion/CLAUDE.md` gives it the full context, design rules, and backlog.

## Adding another video (same product)

1. Add `src/products/mybola/videos/<name>.tsx`. Build the timeline from
   `shared/narration` + `shared/ui`; read brand values from `../brand`.
2. Export a `VideoDef`: `defineVideo({ id: "MyBolaTeaser", component, durationInFrames })`.
3. List it in `src/products/mybola/index.ts`.
4. If it needs a score, add an entry to `VIDEOS` in `audio/make_audio.py`.

It now shows in Studio and renders via `npm run render MyBolaTeaser out/teaser.mp4`.

## Adding another product

Create `src/products/<name>/` with its own `brand.ts`, `appTheme.ts`, `videos/`
and `index.ts`, then import its `videos` into `shared/engine/registry.ts`. Nothing
in `products/mybola/` changes.

Per the code-exact-UI rule, a new product recreates **its own** app UI inside its
folder — `shared/ui/` only carries generic chrome. Don't bend MyBola's app UI to
fit a different product.

## Rules that matter (Claude Code reads these from remotion/CLAUDE.md)

- Two layers: cream serif narration outside the phone, real dark UI inside
- The phone never moves; only the camera zooms
- Every UI element must match the real app source exactly — no invented cards
- Coral never appears inside the phone
- All MyBola copy in Bahasa Malaysia
- No emoji in compositions (headless Chrome renders blank boxes)
- **Renders are not bit-reproducible** — the same unchanged code re-rendered gives
  a different md5 (SSIM ~0.9999). Judge changes by looking at frames, not hashes.

## Roadmap

`remotion/docs/02-polish-roadmap.md` — the six-step plan to close the quality gap to
the Dispatch reference, cheapest first: texture & depth, evidence bubbles,
multi-device phone↔desktop, simulated cursor, spring tuning, real Axiforma. Each
step ships on its own.
