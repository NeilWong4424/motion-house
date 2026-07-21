# Motion craft — how to make it look expensive

The engine can render anything. This doc is the difference between output that
looks like a template and output that looks like it cost money. Read it before
building a video; check against it before declaring one done. **This is the
universal core — the flagship.** Genre chapters in this folder deepen it for a
specific kind of film; read the one that matches what you're building:

- `continuous-world.md` — one world + a moving camera + objects that persist
  (the Arc/Family spatial register; changes the *unit of composition* from
  "scenes you glue" to "one world the camera navigates")
- `staged-composition.md` — composed two-device beats (phone anchor + one
  desktop), depth + soft shadows, hard cuts between conversation and watch-the-work
  (the Cowork product-demo register)
- `kinetic-type.md` — title sequences, big-type films (type as motion)
- `data-motion.md` — numbers and charts that arrive
- `broadcast-energy.md` — the high-energy / esports register (rhythm, shapes)
- `logo-resolve.md` — how a brand mark lands at the close
- `sound-design.md` — score and mix (the sound-designer agent's bar)
- `delivery.md` — mastering per platform (safe areas, aspect, captions)

Each is product-neutral doctrine; per-film numbers live in a product's `NOTES.md`.

**The calibration bar:** Apple product launches (restraint, weight, enormous type,
long holds), League of Legends Worlds format explainers (energy, rhythm, confident
graphic shapes), and Claude product launch films (warm minimalism, the product doing
real work on screen, prose-like pacing). All three are premium. None of them is busy.

---

## The one idea that carries everything

**Amateur motion animates things. Professional motion directs attention.**

Every shot should have exactly one thing you're meant to look at, and the motion
should deliver your eye to it and then get out of the way. If two things move for
the same reason at the same time, one of them is wrong.

Corollary: **most of a premium video is stillness.** The move is the punctuation,
not the sentence. If nothing is ever still, nothing ever lands.

---

## Timing

| Rule | Why |
|---|---|
| **Nothing linear.** Use `EASE.*` or `SPRING.*`, never a raw `interpolate` with no easing. | Nothing in the physical world starts or stops instantly. Linear reads as cheap instantly, even to people who can't say why. |
| **Fast out, slow in.** Cover most of the distance early, glide to rest. | This is the entire "expensive" feeling. `easeOutExpo` is the extreme version; `easeOutQuart` the everyday one. |
| **Stagger 2–4 frames.** `STAGGER.normal` = 3. | Below 2 items look simultaneous; above ~6 the viewer waits and the shot drags. |
| **Entrances 12–20 frames.** | Under 10 feels twitchy; over 24 feels sluggish. |
| **Hold after landing.** 10–20 frames of stillness before the cut. | Premium work is confident enough to wait. Cutting the instant motion stops is the single most common tell of amateur work. |
| **Travel short.** 20–40px at 1080p. | Long travel can't be fast AND smooth. Short + fast + eased beats long + slow. |

**Rhythm:** vary shot lengths. Three shots of identical duration read as a slideshow.
Long, long, short, long is a rhythm; long, long, long is a metronome.

---

## Type

Type *is* the graphic in most motion graphics. Treat it as image, not text.

- **Set it big.** If your display type is under ~60px at 1080p, it's a caption, not
  a headline. Apple sets type enormous and lets it breathe.
- **One weight jump, not three.** Display 600 + body 400 is a system. Adding 300,
  500 and 700 is noise.
- **`TextReveal by="char"` only on 1–3 words.** Per-character on a sentence is
  unreadable and screams "template". `by="line"` is the safe default; `by="word"`
  for short phrases.
- **Never centre long copy.** Centred text is for 1–2 lines. Beyond that, left-align.
- **Let it sit.** Type needs to be readable *after* it stops moving — that's when
  people actually read it. Hold ≥ 1 second per line of copy.

---

## Colour

- **Palette by role, not by name.** Ask the design language for `accent`, never
  the specific hue. That's what makes a scene reusable across brands.
- **One accent, used rarely.** An accent used everywhere is just a second body
  colour. Its power is scarcity — the strongest design languages reserve the
  accent for one layer (e.g. the storyteller, never the product) so it always
  means something when it appears.
- **Contrast is hierarchy.** `fg` for the thing that matters, `muted` for support.
  If everything is full-contrast, nothing is important.
- **Dark ≠ premium.** A dark palette with flat lighting looks cheaper than a light
  one with real depth. Depth comes from `grain`, not from `#000`.

---

## Depth

Flat is a choice, not a default. `grain` on the design language controls it:

- **texture** ~0.02–0.04 — a barely-there grid/paper behind content. If you can
  see it, it's too strong.
- **vignette** ~0.2–0.4 — pulls the eye centre.
- **shadow** — floating objects need a *large, soft, low-opacity* shadow, not a
  small dark one. A tight shadow reads as a sticker; a diffuse one reads as space.

Gradient washes beat flat fills for backgrounds — but keep them within a few
percent of the base colour. The viewer should feel the depth, not see the gradient.

---

## Camera (运镜) and shot breakdown (分镜)

> **Two registers.** This section is the *held-frame* register (Apple/Claude bar):
> the film is a set of scenes, mostly static framings, joined by cuts. There is a
> second register — one persistent world navigated by a single continuous camera,
> objects transforming in place instead of scenes cutting (the Arc/Family look).
> If the story is genuinely spatial (overview→detail, "watch this expand"), read
> `continuous-world.md` — it supersedes the "one static framing per scene" and
> "two or three framings per film" defaults below with its own discipline. The
> restraint intent (*confidence is holding*) is identical in both; only the unit
> of composition differs. Everything else on this page holds in both.

**A scene is not one static wide take.** The single biggest quality gap in a demo
film is showing one unbroken 10-second wide shot while something slowly drifts.
Real product films cut *within* a scene: establish wide → cut in on the thing being
typed → hold on the result → pull back. Use `<Shot>` (`shared/motion/shot.tsx`) to
write that breakdown as a shot list.

- **The subject NEVER moves. The camera moves.** If a mockup or device is
  scaling, that's a prop animating itself. It reads as cheap — and if each scene
  mounts its own copy, the zoom resets at every cut and the subject visibly
  *pumps* smaller between scenes. Mount the subject once, above the scenes.
- **分镜 is NOT "more shots". Confidence is holding.** The best product films
  hold a locked frame and let the *content* change inside it — a dialog opens, a
  window swaps, a cursor moves — rather than punching in. A useful discipline:
  measure your reference and count its cuts and its distinct framings. Premium
  work tends toward **~1 cut per 5–7s and only two or three framings for a whole
  film**; adding 3–4 punch-ins per scene reads as choppy, not premium. Default to
  ONE static framing per scene, held 5–8s, and let the content carry the beat.
  (Record the numbers you measured in the *product's* notes, not here.)
- **Cut, don't drift.** When you do change framing, a cut is free; a move costs
  time. Reserve `via: "move"` for the one or two moments where the travel itself
  means something (a reveal landing, a payoff).
- **A held frame is not a dead frame.** A held camera over live content — something
  always arriving, typing, or updating — has *more* real visual change than a
  slow drift over a static layout. Static camera, live content.
- **Mind the subject's edges.** Punching past the point where a framed subject
  (a device, a window) leaves frame stops reading as "an app on a phone" and
  becomes a bare UI — you lose the staging premise. The punch-in ceiling is
  `frame_size / subject_size`: a subject filling most of the frame leaves almost
  no room, so gentle punches are the whole useful range. If you need a harder
  punch, **stage the subject smaller first** — never crop it away.
- **Push-ins are slow.** If the zoom is noticeable frame to frame, it's too fast.
- **Parallax is subtle.** `depth` 0.85 or 1.15. Beyond that it's a PowerPoint effect.

---

## Transitions

**The golden-standard test is that the viewer never notices the transition.** If
they think "nice transition," it already failed the top bar. A transition is not
an effect — it is the *answer* to the question the viewer is silently asking:
"how does this next thing relate to what I was just looking at?" There are only
three honest answers, and each has its move:

1. **"This IS that, transformed" → a continuity morph (match-cut).** The strongest
   transition there is. The on-screen element doesn't cut away — it *becomes* the
   next thing (a headline shrinks into a card; a bubble lands as the first chat
   message). Use `shared/motion/morph.tsx` (`MorphInto`, `lerpRect`).
2. **"Now, something different" → a hard cut, or a `DipTo` at a chapter break.**
   When the scenes aren't the same object, don't fake continuity — cut. Dip
   through black only at a real structural change, and rarely (once or twice a film).
3. **"Meanwhile / and also" → a `Push`.** Directional: left = forward, right = back.
   Weaker for story; fine for parallel lists.

### The priority order (Walter Murch's rule — memorise it)

Emotion (51%) **>** story **>** rhythm **>** eye-trace **>** screen position **>**
spatial continuity. Read it twice: *emotion outranks everything, and technical
continuity is LAST.* Cut on the feeling and the beat first; clean up the geometry
after. Amateurs build it backwards — they nail the pixel seam and hope feeling
shows up.

### The laws every transition obeys

- **Motivated, not decorative.** Every transition needs a reason tied to meaning.
  A spin/glitch/whip that means nothing is the fastest tell of cheap work.
- **Keep one anchor across the seam (eye-trace).** Know where the viewer's eyes
  are before the cut; put the important thing in the next shot at that same spot,
  so the eye never has to re-hunt. A morph keeps the anchor literally; a cut should
  respect it.
- **Cut/morph ON action, not in stillness.** Movement hides the join (2001's
  bone → spaceship). A morph is just a match-cut with the in-between frames drawn.
- **NO DEAD FRAME.** The worst transition error is a moment where the screen is
  briefly bare, black, or ambiguous — the eye reads any gap as a mistake. A morph
  from a separate `<Sequence>` that remounts, or a montage that mounts one frame
  late, causes a one-frame blink. Fix by keeping the transition ONE continuous
  component and by underlapping the next scene so it is already painting.
- **END STATE == NEXT SCENE'S START STATE, to the pixel.** This is the law that
  separates "clean" from "golden." If the transition lands "close," the eye
  catches the snap. Do NOT hand-build a copy of the next scene to land on — its
  layout WILL drift (wrong line-height, an uncounted wrap, a forgotten bezel
  offset). Instead **dissolve into the REAL next-scene component frozen at its
  first frame** (`MorphInto`'s `next`), so end == start by construction. Verify it
  (see below) — do not eyeball it.
- **Same coordinate space both sides.** The transition and the next scene must
  place their shared subject IDENTICALLY (same origin, same transform-origin,
  same scale, bezel/padding accounted for). A phone positioned absolute-from-
  top-left in the transition and flex-centred in the next scene will offset EVERY
  element. Share one positioning wrapper.
- **Pace it to the story, not the clock.** A calm, editorial film lets the change
  feel like the film *deciding* to move on — hold the outgoing state a beat before
  it transforms. A fast demo can cut harder. Match transition speed to register.
- **Sound turns the corner with picture (J-cut).** Land the visual change on a
  musical beat, and let the next scene's audio arrive a few frames BEFORE its
  picture — you hear it coming, so the change feels anticipated, not abrupt. A
  transition mixed as an afterthought never reaches the bar. Wire the transition
  frame to a `beat` in the `AudioBrief`.

### Restraint

- **One transition vocabulary per film** (two or three moves, used consistently)
  plus ONE signature moment. Six transition types is a showreel, not a film.
  Consistency reads as authored; variety reads as a template.
- **Hard cuts are underrated.** Cut on the beat and the edit disappears. Most
  transitions between beats of the same idea should be plain cuts.
- Cross-dissolves say "time passed." Don't use one just because a cut felt abrupt.

### Verify the seam (do not eyeball it)

For any morph/continuity cut, prove end == start with the rendered mp4:

```
# extract the last transition frame and the first next-scene frame
ffmpeg -y -i out/<Id>.mp4 -vf "select=eq(n\,<LAST>)"  -frames:v 1 a.png
ffmpeg -y -i out/<Id>.mp4 -vf "select=eq(n\,<FIRST>)" -frames:v 1 b.png
# amplified difference — anything that lights up (except elements that LEGIT
# change, e.g. an omnibar starting to type) is drift to fix
ffmpeg -y -i a.png -i b.png -filter_complex "blend=all_mode=difference,eq=contrast=8" diff.png
# PSNR: >40 dB = matched; ~21 dB = visible drift; ~69 dB = pixel-identical
ffmpeg -i a.png -i b.png -lavfi psnr -f null -
```

Also scan brightness across the seam — a dip/spike is a blink:
`ffmpeg -i out/<Id>.mp4 -vf "select='between(n,<A>,<B>)',signalstats,metadata=print:key=lavfi.signalstats.YAVG" -f null -`
(flat YAVG across the cut = no blink).

---

## Audio

Audio isn't decoration — it's half the perceived production value.

- Music defines pacing. Cut to it; don't lay it under afterwards.
- **Music is a bed, not a layer.** Premium films keep the music *far* below where
  an amateur mix puts it — a bed sits low with generous headroom, never near
  clipping. A hot mix (loud, peaking) is one of the fastest tells of cheap work.
  Measure your reference's loudness with `volumedetect`, set your bed and SFX to
  match it, and record the exact targets in the *product's* audio notes — the
  numbers are per-film, the principle is universal.
- **Synthesized music has a ceiling.** A four-chord sine pad is filler and sounds
  like it. If you must synthesize, compose properly: a real progression with
  voice leading, struck timbres with inharmonic partials, an arrangement that
  lifts at the film's turn. Licensed production music beats the best synthesis —
  if it exists, use it.
- SFX must land **on** the frame of the event, not near it. A pop 3 frames late
  reads as broken.
- The score should cover the full cut — audio ending early is worse than no audio.

---

## The critique loop (non-negotiable)

You cannot judge motion from code. **Render, extract frames, and look.**

1. `npm run render <Id> out/<name>.mp4`
2. Extract frames at every transition and mid-reveal:
   `ffmpeg -ss <t> -i out/<name>.mp4 -frames:v 1 frame.png`
3. **Look at them.** Then ask, honestly:
   - Is there exactly one focal point?
   - Is the composition balanced, or is everything clustered with dead space?
   - Would this look at home next to the reference bar, or does it look like a template?
   - Is any of it moving for no reason?
4. Fix, re-render, look again.

**Check mid-flight frames, not just settled ones.** A reveal that looks fine at rest
can be broken in motion — and a frame taken 8 frames after a dip peak will make a
working transition look absent. Sample the frame the effect actually peaks on.

**Measure the reference; don't eyeball it.** When you set a target from a reference
film — shadow depth, cut rate, mix loudness, a colour — take the number off the
actual pixels/audio, don't trust what you think you saw in a compressed recording.
Eyeballing invents things that aren't there: a "grid texture" that measures as JPEG
noise, a "gradient wash" over a field that measures perfectly flat. Every
per-reference number you rely on is a hypothesis until you've measured it — and it
belongs in the *product's* notes, not in this doc.

**Renders are not bit-reproducible.** The same unchanged code gives a different md5
and SSIM ≈0.9999 per render. Judge by eye; treat SSIM ≥ ~0.9997 as renderer noise,
never as evidence something changed.

---

## Fast quality checklist

- [ ] One focal point per shot
- [ ] Nothing linear
- [ ] Staggers 2–4 frames
- [ ] Holds after every landing
- [ ] Display type big; one weight jump
- [ ] Accent used sparingly
- [ ] Composition balanced (no top-heavy clusters over dead space)
- [ ] One or two transition types, used consistently
- [ ] Every transition motivated by story; one anchor held across each seam
- [ ] No dead/black/bare frame at any cut (brightness flat across the seam)
- [ ] Continuity morphs: last transition frame == next scene's first frame
      (PSNR-verified, not eyeballed)
- [ ] Audio covers full length, ≈ −21 dB, SFX on-frame
- [ ] Frames actually looked at, including mid-motion
