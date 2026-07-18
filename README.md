# Motion engine — a white-label motion-graphics studio

A **product-neutral engine** for building commercial-grade motion graphics as code
(Remotion). It ships with **no brand, no look, and no videos** — you add a *product*
(one design language + its videos) on top, and the engine turns it into rendered
film. Any style, any format: launch films, explainers, teasers, stings.

Because it's code, every frame is version-controlled, diffable, and re-renderable.
The quality bar is commercial: Apple keynote, LoL Worlds explainer.

> **Fresh bake.** Clone it and it boots empty — the studio opens on a single
> `EmptyEngine` placeholder until you register a video. Nothing about any past
> client is baked in.

## What's in the box

`remotion/src/shared/` **is the engine** — style-agnostic primitives, no brand:

```
remotion/src/
  index.ts               registers the Remotion root
  Root.tsx               renders registered videos (or the EmptyEngine placeholder)
  shared/
    engine/
      types.ts           VideoDef, defineVideo, format presets, AudioBrief
      registry.ts        registerVideos() / allVideos / findVideo() — empty by default
      audio-prompt.ts    a video's audio brief -> a music-generation prompt (genre-agnostic)
    design/
      types.ts           DesignLanguage (palette by ROLE, type, motion profile)
      fonts.tsx          loads whatever a design language declares
    motion/              the craft layer: easing/springs, reveal, transitions,
                         shot (virtual camera), graphic, logo, data, type-kinetic
    narration/           text primitives
  scripts/
    audio-prompt.mjs     CLI: brief -> music-gen prompt
    qc.mjs               QC gate (banned glyphs, hardcoded hex)
  craft/                 product-neutral studio doctrine (the quality bar)
```

There is **no `products/` in the engine** — a product is something *you* add
(below) and register. The engine never changes to accept one.

## Setup (once)

1. Node.js 20+ and ffmpeg (`winget install ffmpeg`)
2. `cd remotion && npm install`
3. (optional, for making videos with Claude Code) `npm install -g @anthropic-ai/claude-code`

## Boot it empty

```bash
cd remotion
npm run studio                          # opens on the EmptyEngine placeholder
npx remotion compositions src/index.ts  # lists EmptyEngine until you register a video
```

## Add a product (your brand's videos)

A product lives **outside the engine**, e.g. `src/products/<name>/`, and owns one
identity. Nothing in `shared/` changes.

1. **A design language** — `design.ts` exporting a `DesignLanguage`: palette by
   *role* (`accent`, never `"coral"`), type specs, motion profile. Scenes read from
   it, so the same scene code carries any brand.
2. **Videos** — `videos/<name>.tsx`, each composed from `shared/motion` and reading
   colour/font/timing from the design language. Export a `VideoDef`:
   `defineVideo({ id: "AcmeTeaser", component, durationInFrames, ...LANDSCAPE })`.
   Ids: letters/digits/`-` only (no underscores). Optionally attach an `audio` brief.
3. **Register** — in an entry your studio loads, call
   `registerVideos(myVideos)`. They now appear in the studio and render by id.

Formats: `PORTRAIT` (9:16), `LANDSCAPE` (16:9), `SQUARE`, `CINEMA` (21:9) — spread
one into `defineVideo`.

## Render

```bash
npm run render <CompositionId> out/<name>.mp4   # any registered video, by id
npm run still  <CompositionId> out/frame.png -- --frame=N
npm run qc                                       # run before every delivered render
```

## Audio — generated, then aligned to the cut

The engine does **not** synthesize music. It writes a precise **music-generation
prompt** from a video's `audio` brief; you generate the track in a 3rd-party AI tool
(ElevenLabs / DaVinci / Suno / Udio), then align it to the cut.

```bash
node scripts/audio-prompt.mjs <brief.ts|brief.json> [--out PROMPT.md]
# or: npm run audio:prompt <brief.ts|brief.json>
```

The engine is **genre-agnostic** — the sound comes entirely from the brief
(`beat.sound` > `brief.roleText[role]` > a bare fallback), so calm piano, sports
EDM, trap, ambient, corporate all work with zero engine edits. The paste-ready
prompt is kept under 4000 chars. Its **alignment plan** gives the exact frame the
generated track's payoff must land on.

> Alignment + mux (shifting the generated track's payoff onto the frame, then
> muxing with ffmpeg) is a per-product step — see `remotion/CLAUDE.md`, Audio.

## Make a video with Claude Code (optional)

```
cd remotion && claude
> /video
```

Give the brief; it researches, forms a creative direction, builds, runs QC + a cold
creative-director review, and delivers a cut with a director's statement.
`remotion/CLAUDE.md` gives it the full engine context and craft rules.

## Rules that matter

- **Read `remotion/craft/motion-craft.md`** — the quality bar as concrete rules.
- `shared/` never assumes a palette, font, or format — a product owns its look.
- Never hardcode a hex or font in a scene; ask the design language (`npm run qc`
  warns on hardcoded hex).
- No emoji/dingbats/arrows in compositions — headless Chrome renders tofu boxes
  (`npm run qc` errors on these).
- **Renders are not bit-reproducible** — the same code re-rendered gives a
  different md5 (SSIM ~0.9999). Judge changes by looking at frames, not hashes.

## Docs

- `remotion/CLAUDE.md` — engine architecture, commands, the full audio pipeline
- `remotion/craft/motion-craft.md` — the universal craft bar (product-neutral)
- `.claude/skills/video/SKILL.md` — the `/video` studio workflow
- `.claude/agents/` — the review + sound-design agents
