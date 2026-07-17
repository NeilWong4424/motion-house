# Motion craft — how to make it look expensive

The engine can render anything. This doc is the difference between output that
looks like a template and output that looks like it cost money. Read it before
building a video; check against it before declaring one done.

**The calibration bar:** Apple product launches (restraint, weight, enormous type,
long holds) and League of Legends Worlds format explainers (energy, rhythm,
confident graphic shapes). Both are premium. Neither is busy.

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
  "the coral one". That's what makes a scene reusable across brands.
- **One accent, used rarely.** An accent used everywhere is just a second body
  colour. Its power is scarcity — see MyBola's rule that coral never enters the
  phone.
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

**A scene is not one static wide take.** The single biggest quality gap in a demo
film is showing one unbroken 10-second wide shot while something slowly drifts.
Real product films cut *within* a scene: establish wide → cut in on the thing being
typed → hold on the result → pull back. Use `<Shot>` (`shared/motion/shot.tsx`) to
write that breakdown as a shot list.

- **The subject NEVER moves. The camera moves.** If your device mockup is scaling,
  that's a prop animating itself. It reads as cheap — and if each scene mounts its
  own copy, the zoom resets at every cut and the device visibly *pumps* smaller.
  That exact bug shipped here for months behind a comment claiming the opposite.
- **Cut, don't drift.** A cut is free; a move costs time. Most beats want a cut to
  a new framing, not a slow crawl toward it. Reserve `via: "move"` for moments
  where the travel itself means something (a reveal landing, a payoff).
- **Mind the subject's edges.** Punching past the point where the device leaves
  frame stops reading as "an app on a phone" and becomes a bare UI — you lose the
  two-layer premise. For a 902px phone in a 1080px frame the limit is 1080/902 =
  **1.19**, so gentle punches (~1.15) are the whole useful range. If you need a
  harder punch, **stage the subject smaller first** — never crop it away.
- **Push-ins are slow.** If the zoom is noticeable frame to frame, it's too fast.
- **Parallax is subtle.** `depth` 0.85 or 1.15. Beyond that it's a PowerPoint effect.

---

## Transitions

- **Pick one or two per video.** Six transition types is a showreel, not a film.
- **Hard cuts are underrated.** Cut on the beat and the edit disappears. Most
  transitions between beats of the same idea should be cuts.
- **`DipTo` for chapter breaks** — a real structural pause, not decoration.
- **`Push` for narrative direction** — left = forward, right = back. Be consistent.
- Cross-dissolves say "time passed". Don't use one just because a cut felt abrupt.

---

## Audio

Audio isn't decoration — it's half the perceived production value.

- Music defines pacing. Cut to it; don't lay it under afterwards.
- Mean level ≈ −20 to −23 dB (`volumedetect`). Louder is not better.
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
- [ ] Audio covers full length, ≈ −21 dB, SFX on-frame
- [ ] Frames actually looked at, including mid-motion
