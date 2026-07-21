# Motion graphics studio (Remotion)

A code-driven studio for **any kind of motion graphic** — launch films, explainers,
teasers, stings — each with its own design language and format. Remotion (React +
TypeScript), rendered to MP4.

**You are the studio here, not a code generator.** When someone asks for a video,
run the agency flow in `.claude/skills/video/SKILL.md`: absorb the brief →
research the subject and references → form ONE creative direction → build →
QC + cold review (the creative-director agent) → deliver a finished cut with a
director's statement. Decide creative questions yourself; ask the user only for
unknowable facts (product claims, licensing). That skill is also the `/video`
command.

**Read `craft/motion-craft.md` before building anything.** It's the quality bar
(Apple keynote / LoL Worlds explainer) as concrete, checkable rules.

**No product's look is the house style.** Each product owns its design language
in `products/<name>/design.ts` and documents its brand rules, copy, and
code-exact UI targets in its own `products/<name>/NOTES.md`. Nothing in `shared/`
assumes a look. **The engine ships with NO products** — it boots empty (an
`EmptyEngine` placeholder) until a consumer registers a video. A product is added
outside the engine and registered via `registerVideos()`; the engine never changes
to accept one.

## Commands

- `npm run studio` — live preview (primary dev loop; hot-reloads on save)
- `npm run qc` — QC gate: errors on tofu-risk glyphs (emoji/dingbats/arrows) in
  code, warns on hardcoded hex in scene files. Run before every render you
  intend to deliver; fix errors, don't suppress them.
- `npm run render <CompositionId> out/<name>.mp4` — render any video by id
- `npm run still <CompositionId> out/frame.png -- --frame=N` — single frame check
  (note the `--` before `--frame`, so npm passes the flag through)
- `npx remotion compositions src/index.ts` — list every registered video
- `node scripts/audio-prompt.mjs <brief.ts|brief.json> [--out PROMPT.md]` — emit
  the music-generation prompt for a video's `audio` brief (also `npm run
  audio:prompt`). The engine is a pure, genre-agnostic library. Feed the prompt to
  a 3rd-party AI generator; see the Audio section below.
- Audio align: find the generated track's biggest-energy moment and shift it onto
  the cut's `payoff` frame; mux music + any SFX with ffmpeg `amix` (see Audio
  section below).
- A product may add its own convenience scripts to `package.json` (e.g.
  `render:acme-teaser`) — `npm run` lists them. The engine ships none.

## Architecture

`shared/` is **style-agnostic** — it never assumes a look. `products/<name>/` owns
one product's design language, brand, videos and audio. A video is a `VideoDef` in
a registry; adding one never touches `Root.tsx`.

- `src/Root.tsx` — maps the registry to Remotion `<Composition>`s. Never edit to
  add a video.
- `src/shared/engine/` — `types.ts` (`VideoDef`, `defineVideo`, format presets:
  `PORTRAIT`/`LANDSCAPE`/`SQUARE`/`CINEMA`, and the declarative `AudioBrief`),
  `registry.ts` (concatenates each product's `videos` array), `audio-prompt.ts`
  (style-agnostic: a video's `audio` brief + frames → a music-generation prompt)
- `src/shared/design/` — `types.ts` (`DesignLanguage`: palette by role, type specs,
  motion profile, grain), `fonts.tsx` (loads whatever a language declares)
- `src/shared/motion/` — the craft layer. `easing.ts` (`EASE`, `SPRING`, `STAGGER`
  presets), `reveal.tsx` (`Rise`, `Stagger`, `TextReveal`, `MaskWipe`, `CountUp`,
  `Parallax`), `transitions.tsx` (`FadeIn`, `Drift`, `Camera`, `DipTo`, `Push`)
- `src/shared/narration/primitives.tsx` — serif layer + legacy font loader
  (`useFonts`, `SERIF`/`SANS`)
- **App-UI chrome (chat apps, device frames, third-party UIs) is NOT in the
  engine.** It is a product's own identity — a white-label engine ships primitives
  (motion, design language, prompt), not a pre-built app look. A product provides
  its own `ui/` under `src/products/<name>/`.
- `src/products/<name>/` (product-owned, not part of the engine) — a `design.ts`
  (its `DesignLanguage`), any brand tokens, its own `ui/` staging, `videos/`,
  `index.ts`, and its audio brief(s) + alignment. Nothing here lives in `shared/`.
- `public/fonts/` — woff2 the loader reads. Add a family by copying weights from
  `node_modules/@fontsource/<family>/files/` (installed: Inter, Playfair Display,
  Plus Jakarta Sans). No network at render time, so fonts must be local.
- `craft/` — **product-neutral studio doctrine only.** `motion-craft.md` (the
  universal flagship — read before building) plus genre chapters:
  `continuous-world` (one world + a moving camera, the Arc/Family spatial register),
  `staged-composition` (composed two-device beats, the Cowork product-demo register),
  `kinetic-type`, `data-motion`, `broadcast-energy`, `logo-resolve`, `sound-design`,
  `delivery`.
  Product-specific analysis (a product's reference film, measured numbers, polish
  log) lives in that product's own `NOTES.md`, never here.

### Adding a video (same product)

1. Add `src/products/<product>/videos/<name>.tsx`; compose from `shared/motion`;
   read every colour/font/timing from that product's `design.ts`.
2. Export a `VideoDef` via `defineVideo({ id, component, durationInFrames })` —
   spread a format preset for anything non-portrait. Ids: letters/digits/`-` only,
   **no underscores** (Remotion rejects them).
3. List it in that product's `index.ts`. It now appears in Studio and renders via
   `npm run render <id> out/<id>.mp4`.
4. If it needs a score: declare an `audio` brief on the `VideoDef` (beats in
   frames + style/hook), run `node scripts/audio-prompt.mjs <brief> --out
   PROMPT.md`, generate the track from that prompt, then align its payoff onto the
   cut's frame (a product-side align/mux step) and mux.

### Adding a product / a new design language

Create `src/products/<name>/` with its own `design.ts`, `videos/`, `index.ts`, then
import its `videos` into `shared/engine/registry.ts`. Nothing in other products
changes. Anything style-specific — device staging, app UI recreations — lives under
that product, never in `shared/`.

**Never hardcode a hex or font family inside a scene.** That's how a repo drifts
back to a single house style. Scenes ask the design language for `accent`, never
the specific hue. The `npm run qc` gate warns on hardcoded hex in scene files.

## Code-exact UI rule (critical, universal)

**Whenever a real product's UI appears on screen, it must match that product's real
source exactly — never an invented approximation.** This is what separates a
credible product film from a mockup, and it applies to every product.

- No invented UI cards — if it doesn't exist in the real source, it doesn't go in
  the video.
- No emoji in compositions (headless Chrome renders blank boxes) — the `npm run qc`
  gate enforces this.
- Each product records its exact tokens, component geometry, and copy targets in
  its own `NOTES.md` (e.g. an app's design-source figures live in
  `products/<name>/NOTES.md`). Read that before recreating its UI.

## Audio

**Music is GENERATED by a 3rd-party AI tool (ElevenLabs / DaVinci / Suno / Udio),
not synthesized locally** — synthesis has a ceiling we hit. The engine's job is the
two ends around the generator:

1. **The prompt.** A video declares an optional `audio` brief on its `VideoDef`
   (`shared/engine/types.ts` — `AudioBrief`: style, instrumentation, tempo/key,
   hook, and the cut's `beats` in frames with roles: intro/build/riser/payoff/
   sustain/outro, plus optional per-beat `sound` text). **The engine is
   genre-agnostic — it bakes in NO register.** What each beat sounds like comes
   from the brief (`beat.sound` > `brief.roleText[role]` > a bare fallback), so
   any genre works with zero engine edits. The shared prompt engine
   (`shared/engine/audio-prompt.ts`) turns the brief + real frame timings into a
   tool-agnostic prompt (paste block kept under 4000 chars) + an alignment plan:
   `node scripts/audio-prompt.mjs <brief.ts|brief.json> [--out PROMPT.md]` (also
   `npm run audio:prompt`). The engine is a **pure library** — it knows nothing
   about products or a registry; you pass it a `VideoDef` from wherever.
2. **Alignment + SFX.** The user generates a track from the prompt; an alignment
   step finds its biggest-energy moment and time-shifts it onto the cut's `payoff`
   frame (never pitch-shifts), padding/trimming to cover the full cut. Any SFX are
   synthesized and muxed alongside.

The mux mechanics below are universal; a product's cue tables and measured mix
targets live in its `NOTES.md`. A video with no `audio` brief simply has no
generated score (silent or SFX-only).

Mux music + SFX onto the silent video. **Music is a BED, not a layer** — mix it
low with generous headroom (a hot mix peaking near clipping is a fast tell of
cheap work). `-c:v copy` keeps the render's video untouched (this is the only
encode); the music/SFX `volume` values and the loudness you verify to are
per-product (record them in the product's notes):

```
ffmpeg -i out/<Id>.mp4 -i out/audio/<Id>-music.wav -i out/audio/<Id>-sfx.wav \
  -filter_complex "[1:a]volume=<m>[m];[2:a]volume=<s>[s];[m][s]amix=inputs=2:duration=first:normalize=0[a]" \
  -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 192k out/<Id>-final.mp4
```

- The score must cover the **full cut** — `amix duration=first` follows the first
  audio input, so audio shorter than the video silently ends early.
- Verify with `volumedetect` against the product's targets; a SFX (tap) window
  should still peak above the music bed.
- SFX must land **on** the event frame, not near it (a pop 3 frames late reads as
  broken).

## Verify before declaring done

`remotion.config.ts` carries the master settings deliberately — PNG intermediate
frames (lossless into the encoder), BT.709 colour, CRF 16. Renders are slower;
never trade these back for speed on a delivered cut.

Run `npm run qc` first. Then, for any cut headed to the user, get a cold review:
launch the **creative-director** agent (`.claude/agents/creative-director.md`)
with the composition id and mp4 path — it extracts frames it didn't make and
judges them against the craft doc. The builder critiquing its own frames is the
floor, not the bar.

Render stills at each scene's key frame and LOOK at them; after full renders,
extract frames at transitions (`ffmpeg -ss <t> -frames:v 1`) and check audio
(`volumedetect` against the product's mix targets; SFX present in cue windows).

**Renders are not bit-reproducible.** Two renders of identical, unchanged code
produce different md5s and SSIM ≈ 0.9999 (font rasterization/encode timing varies per
render process). Never use md5 equality to judge whether a refactor changed the
video — compare frames by eye, and treat SSIM ≥ ~0.9997 as "within renderer noise".

## Per-product backlogs

Product polish plans live with their product, not here — a product's reference
analysis, remaining steps, and done criteria go in its own
`src/products/<name>/NOTES.md`. This file stays product-neutral engine doctrine.

## Money-gated deliverables (budget, not code)

Two things separate this from a top house that no amount of code closes — they
are budget decisions, flagged here so they're funded deliberately, not
discovered late:

- **Licensed / commissioned music.** Synthesis has a ceiling (see
  `craft/sound-design.md`); a real score is the biggest audible upgrade. The
  sound-designer agent will flag when a cut is hitting that ceiling.
- **Licensed brand fonts.** When a brand's true typeface needs a license, we ship
  a substitute (a fact to state, not hide). To swap in the real face: drop woff2
  in `public/fonts/` and update the loader — the swap shifts glyph metrics, so
  re-check any text near a wrap boundary after.
