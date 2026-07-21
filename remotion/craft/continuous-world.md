# Continuous world — one space, a moving camera, objects that persist

Most films in this studio are built scene-by-scene: mount a scene, hold a frame,
cut, mount the next. `motion-craft.md` tunes that register to the Apple/Claude
bar — held frames, ~1 cut per 5–7s, two or three framings for a whole film. That
is the right default and it is not what this chapter is about.

This chapter is the OTHER register: the film is **one persistent world**, and the
story is told by **moving a single camera through it while objects transform in
place** — never by cutting between separate scenes. The reference bar here is Arc
Browser's product films, Family (the wallet app), and Rauno Freiberg / Emil
Kowalski spatial-UI work: an overview that *expands* into a detail, a card that
*becomes* a page, a dashboard the camera *flies into*. Nothing disappears.
Everything transforms.

Read `motion-craft.md` first — every timing, type, colour and audio law still
holds. This chapter changes exactly one thing: **the unit of composition.** Not
"scenes you glue together" but "one world the camera navigates."

---

## When to reach for this register (and when NOT to)

This register is expensive to build and easy to make nauseating. It earns its
cost only when **the story itself is spatial** — when the message is about how
parts of a product relate, overview-to-detail, or navigating a structure.

| Use continuous-world when… | Stay scene-by-scene when… |
|---|---|
| Showing how a product's parts nest (dashboard → item → detail → sub-detail). | The film is big-type / kinetic (`kinetic-type.md`). Held frames + cuts win. |
| The hook is "watch this open up / fly in / expand." | It's a data film (`data-motion.md`) — numbers arrive into held frames. |
| Overview-to-detail is the actual narrative. | It's an explainer/VO cut — the words carry it; a moving camera fights them. |
| The reference is Arc / Family / spatial UI. | The reference is an Apple keynote — that IS the held-frame register. |

If you cannot name the spatial relationship the camera move *reveals*, you do not
want this register. A camera that flies for no reason is the same sin as a
transition that spins for no reason — decorative motion. Default to
`motion-craft.md`'s held frames unless the story is genuinely a space.

---

## The one idea that carries this register

**There are no scenes. There is one world and one camera.**

Everything that ever appears on screen is a node in a single tree that is mounted
for the WHOLE film. A node never unmounts at a beat boundary. It enters by moving
in from off-camera or by transforming out of another node; it leaves by moving
off or by becoming the next thing. The camera — one transform over the entire
world — is the only thing that "cuts."

Corollary, and it supersedes the scene-register default: **`motion-craft.md`'s
"two or three framings for a whole film" and "one static framing per scene" do
NOT apply here.** Their intent — *confidence is holding; the move is
punctuation* — still governs absolutely. But here you express it as **one
continuous camera path with decisive holds at each waypoint**, not as a small set
of hard cuts. Continuous ≠ constantly moving. Arc's films hold far more than
people remember: the camera parks on a waypoint, content lives inside the held
frame, and only on the story beat does the camera travel — fast out, slow in — to
the next waypoint.

---

## The structural model

Three parts replace the `<Sequence>` stack.

### 1. One world, mounted once

A single component renders every object the film will ever show, positioned in
one shared coordinate space (composition pixels, or a larger virtual canvas the
camera pans across). It is mounted for the full `durationInFrames`. There is no
`<Sequence from=…>` per scene; sequences, if used at all, only gate a node's
*entrance/exit within the world*, never a whole "scene."

### 2. Objects with persistent identity + a geometry track

Every object is a node with:

- **A stable identity** — the same React `key` for its entire life. This is the
  law that makes persistence real: React keeps the same DOM node, so a CSS
  transition or frame-driven interpolation carries it smoothly instead of
  unmounting one thing and mounting another (which snaps).
- **A geometry track** — its `{cx, top, w, h, radius, opacity, font}` as a
  function of the global frame, keyed across the WHOLE timeline. Reuse
  `morph.tsx`'s `MorphRect` + `lerpRect` for the shape; drive the progress off
  the global `useCurrentFrame()`, not a scene-local clock.

A "shared-element transition" in this register is not `MorphInto` dissolving into
a frozen copy — it is simply the same node's geometry track moving from state A to
state B. No dissolve, no frozen next-scene, because there is no next scene. (Keep
`MorphInto` for the scene-stack register, where the two sides really are separate
components — see below.)

### 3. The camera as a waypoint track

Mount ONE `<Camera>` (`shared/motion/shot.tsx`) over the whole world for the whole
film. Replace the per-scene framing with a **waypoint table**: named camera
positions `{x, y, scale}` the camera holds at, and the frame ranges over which it
travels between them. `Shot` already interpolates framings with `via: "cut" |
"move"` — the shift is to feed it ONE list spanning the entire film, so the same
camera is continuous end to end. A "scene change" becomes a camera waypoint, and
its transition type is a property of the move (hold-then-ease), not a remount.

```
World (mounted 0 → END)
  Camera(waypointTrack)                 // one lens, whole film
    Node "dashboard"  geometry(frame)   // stable key, keyed across full timeline
    Node "card-3"     geometry(frame)   // becomes the "player" node — same key
    Node "stat-panel" geometry(frame)
    …every object the film ever shows…
```

---

## The laws of this register

Everything in `motion-craft.md` still holds. These are the additions.

- **Stable keys or it snaps.** An object that persists across a beat MUST keep one
  React key for its whole life. Remounting under a new key is the #1 way a
  "continuous" film secretly cuts. If you find yourself writing a second copy of
  an object for "the next part," stop — it's the same node, move it.
- **The camera path must be eye-trackable.** Every waypoint must be reachable from
  the previous one by a move the eye can follow. No teleports the viewer can't
  trace (that's just a hard cut wearing a camera costume — if you want a cut,
  choose a cut honestly and use the scene register). Zoom, pan, and orbit are
  trackable; a jump from deep-detail-A to deep-detail-B across the canvas is not.
- **Hold, then move — the move is still punctuation.** Park the camera and let
  content live. Travel only on the story beat. A film where the camera never
  stops has no stillness, so nothing lands (the core `motion-craft.md` law,
  unchanged). Budget: expect long holds and a handful of decisive travels, not a
  perpetual drift.
- **Fast out, slow in — on the camera too.** A camera move is `easeInOutQuint`
  (symmetric A-to-B) or `easeOutExpo` for an arrival that should feel like it
  clicks into place. Never linear; a linear camera is the drone-flythrough tell.
- **One transform origin for the whole world.** Every node is positioned in the
  same space with the same origin convention. `Camera` scales about a point by
  translating that point to centre — so a node's `{cx, top}` must mean the same
  thing at every waypoint. Mixing absolute-from-top-left and flex-centred nodes
  offsets everything the moment the camera scales.
- **Transform on the beat, resolve off it.** When an object becomes another
  object, start the geometry move ON the musical/story beat and let it glide to
  rest after (`morph.tsx`'s discipline, applied continuously). The eye reads the
  transformation as the same match-on-action a cut hides behind.
- **Depth is the camera's friend here.** Since the camera moves through space,
  gentle parallax between fore/back layers (`depth` 0.85 / 1.15, no more) sells
  the world as dimensional. Overdo it and it's a PowerPoint fly-through.
- **Nausea is a real failure mode.** Continuous zoom + rotate + pan at once is
  motion sickness, not motion design. One camera verb at a time (mostly): zoom OR
  pan OR orbit. Combine only when the combination itself means something.

---

## Worked example — dashboard → tournament → player → stats

The manifesto move, in this register. One world, four waypoints, objects that
persist. Frames illustrative @ 30fps.

**World:** a single canvas holding the dashboard, and — nested inside the
dashboard's "Tournaments" card at their real small size — the tournament bracket,
which itself contains player cards, one of which contains the stat panel. Every
object exists from frame 0; the camera reveals them by flying in. Nothing mounts
late except by moving into view.

| Frames | Camera waypoint | What the eye sees | The move |
|---|---|---|---|
| 0–70 | `dashboard` — full, scale 1 | The whole dashboard, live: a number counts, a row updates. | **Hold.** Establish the world. Content moves, camera doesn't. |
| 70–100 | → `tournament` — centre on the Tournaments card, scale ~2.4 | Camera flies *into* the card; the card's contents resolve from thumbnail into a full bracket as it fills the frame. | **Move** (`easeInOutQuint`, ~30f). Same node `key="tournaments"` — its geometry track scales up; children fade from summary to detail on the same progress. |
| 100–170 | `tournament` | The bracket, held. A match result flips in. | **Hold.** Let the detail live. |
| 170–195 | → `player` — centre on one player card, scale ~3.0 | One bracket seat *expands* into a full player profile — same node `key="player-danish"`, its rect growing from seat to full card, its inner text cross-fading summary→profile. | **Move / shared-element.** No cut, no dissolve: the seat IS the profile, grown. |
| 195–250 | `player` | The profile, held. Avatar, name, role. | **Hold.** |
| 250–275 | → `stats` — the profile's mini stat-strip expands to fill | The stat strip *unfolds* into a full stats panel; bars count up (`CountUp`) as they arrive at the new scale. | **Move / shared-element**, same `key="stats"`. |
| 275–330 | `stats` | Stats panel, held; the payoff number lands. | **Hold to the payoff beat.** Wire this frame to the `AudioBrief` payoff. |

Notes that make it real, not a slideshow:

- **Four objects, four stable keys, zero remounts.** `tournaments`, `player-danish`,
  `stats` each keep one key from frame 0 to END. They start tiny/nested and simply
  grow into frame as the camera arrives. That is the whole trick.
- **The camera never teleports.** Each waypoint is a zoom-in from the last —
  eye-trackable throughout. The viewer always knows where they are because they
  watched the camera get there.
- **Holds outnumber moves ~2:1 in time.** 70+70+55+55 held vs 30+25+25 moving.
  Confidence is holding — the register changed, the law didn't.
- **Content lives inside every held frame.** A counting number, a flipping result,
  arriving bars. Static camera, live content (`motion-craft.md`).
- **One verb per move.** Every travel here is a zoom-in. No simultaneous rotate.

---

## Verify it's actually continuous (don't eyeball it)

The failure mode is a "continuous" film that secretly remounts and snaps. Prove it
doesn't:

- **No dead/snap frame at any waypoint join** — same brightness-flat check as
  `motion-craft.md`'s seam test, run across every camera move, not just cuts:
  `ffmpeg -i out/<Id>.mp4 -vf "select='between(n,<A>,<B>)',signalstats,metadata=print:key=lavfi.signalstats.YAVG" -f null -`
  (flat YAVG through a move = no blink; a spike = something remounted).
- **Trace one object across a transform** — extract the frame before and after a
  shared-element move and confirm the object is continuous, not two different
  boxes: the same `key` should mean the same DOM node moved, so the PSNR of the
  object's region should degrade *smoothly* across the move, never jump.
- **Watch it at 0.25× and ask: could I have cut here instead?** If a "camera move"
  could be replaced by a hard cut with no loss, it wasn't a continuous move — it
  was a cut in disguise, and the scene register would be simpler and better. The
  continuous move must *reveal a spatial relationship* a cut would hide.

---

## Fast checklist (in addition to `motion-craft.md`'s)

- [ ] One world, mounted for the whole film — no `<Sequence>`-per-scene stack
- [ ] Every persistent object keeps ONE React key for its whole life
- [ ] One `<Camera>` over the whole film, driven by a waypoint track
- [ ] Every camera move is eye-trackable from the previous waypoint (no teleports)
- [ ] Holds outweigh moves in total time; the move lands on the story beat
- [ ] One camera verb per move (zoom OR pan OR orbit), unless the combo means something
- [ ] Shared-element = same node's geometry track, not a dissolve into a copy
- [ ] Every camera move reveals a spatial relationship a cut couldn't
- [ ] No snap/blink through any move (YAVG flat across it)
