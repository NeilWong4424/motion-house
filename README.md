# Motion graphics studio

Text to motion graphic. You describe the video; **Claude Code is the studio** —
it researches the subject, forms its own creative direction, builds the film,
puts it through QC and a cold creative-director review, then delivers a finished
cut with a director's statement. You give notes on delivered work, like a client
with an agency — not approvals on palettes and beat sheets.

Built as code (Remotion), so every frame is version-controlled, diffable, and
re-renderable. Any style, any format — launch films, explainers, teasers, stings.
Commercial-grade output is the bar: Apple keynote, LoL Worlds explainer.

MyBola (a Malaysian football academy SaaS) is the first product in here — its
"warm editorial" look is **one design language among many**, not the house style.

## Make a video

```
claude
> /video
```

Give it the brief and let it work. It asks only for facts it can't research
(product claims, licensing) — everything creative is its call, defended in the
director's statement at delivery. Plain chat works too — "make me a 30s teaser
for X" runs the same flow. Give notes on the delivered cut; revisions are part
of the job.

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

Three ideas run the whole thing:

**1. A video is a `VideoDef` in a registry.** Each video exports
`defineVideo({ id, component, durationInFrames })`. Its product lists it in
`index.ts`, `shared/engine/registry.ts` collects every product's list, and
`Root.tsx` turns each entry into a Remotion composition. Nothing else needs editing.

**2. A design language is data.** Palette (by *role* — `accent`, not "coral"), type
specs, motion profile, depth. Scenes read from it, so the same scene code carries
any brand. Two videos on this engine should look like different studios made them.

**3. `shared/` is style-agnostic; `products/<name>/` owns the look.** Shared code
never assumes a palette, font, or format. Anything style-specific — MyBola's phone
staging, its app UI — lives under its product.

```
remotion/src/
  shared/
    engine/      VideoDef + registry + format presets
    design/      DesignLanguage type + font loader
    motion/      easing/springs, reveal kit, transitions  <- the craft layer
    ui/          generic app chrome (chat, status bar, WhatsApp)
    narration/   serif layer + legacy font loader
  products/
    mybola/
      design.ts    its DesignLanguage ("warm editorial")
      brand.ts     cream/ink/coral + wordmark, tagline
      appTheme.ts  app tokens (from the Flutter source)
      ui/          ITS device staging (PhoneFrame)
      videos/      one file per cut, each exporting a VideoDef
      audio/       per-video music + SFX synth
      index.ts     this product's video list
```

Formats: `PORTRAIT` (9:16), `LANDSCAPE` (16:9), `SQUARE`, `CINEMA` (21:9) — spread
one into `defineVideo`.

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

1. Add `src/products/<product>/videos/<name>.tsx`. Compose from `shared/motion`;
   read colours/fonts/timing from that product's `design.ts`.
2. Export a `VideoDef`: `defineVideo({ id: "MyBolaTeaser", component, durationInFrames })`.
   Ids allow letters/digits/`-` only — no underscores.
3. List it in that product's `index.ts`.
4. If it needs a score, add an entry to `VIDEOS` in `audio/make_audio.py`.

It now shows in Studio and renders via `npm run render MyBolaTeaser out/teaser.mp4`.

## Adding another product / design language

Create `src/products/<name>/` with its own `design.ts`, `videos/` and `index.ts`,
then import its `videos` into `shared/engine/registry.ts`. Nothing in other products
changes. Anything style-specific — device staging, app UI — lives in that folder.

Fonts: only families with woff2 in `remotion/public/fonts/` work (headless Chrome,
no network). Copy weights from `node_modules/@fontsource/<family>/files/` and name
them in the design language.

## Rules that matter (Claude Code reads these from remotion/CLAUDE.md)

- **Read `remotion/craft/motion-craft.md`** — the quality bar as concrete rules
- Never hardcode a hex or font in a scene; ask the design language
- Whenever a real product's UI is on screen, it must match that product's real
  source exactly — no invented cards
- No emoji in compositions (headless Chrome renders blank boxes)
- **Renders are not bit-reproducible** — the same unchanged code re-rendered gives
  a different md5 (SSIM ~0.9999). Judge changes by looking at frames, not hashes.
- MyBola-specific: two-layer rule (coral never inside the phone), phone never moves,
  copy in Bahasa Malaysia

## Docs

- `remotion/craft/motion-craft.md` — the universal craft bar: timing, type,
  colour, depth, camera, transitions, and the critique loop. Product-neutral.
- `remotion/src/products/mybola/NOTES.md` — MyBola's own reference analysis and
  polish log (an example of how each product keeps its specifics with itself)
- `.claude/skills/video/SKILL.md` — the `/video` studio workflow
- `.claude/agents/creative-director.md` — the cold-review agent
