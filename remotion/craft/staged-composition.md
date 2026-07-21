# Staged composition — phone anchor + one device, composed with depth

A third register, alongside `motion-craft.md`'s held-frame default and
`continuous-world.md`'s flown camera. This is the **product-demo** register: the
film is a rhythm of deliberately COMPOSED beats, each framing at most two real
devices (a phone anchor + one desktop) with depth, hard-cutting between
"conversation" and "watch the work." The reference bar is the Claude Cowork
"reach your desktop from your pocket" film.

Read `motion-craft.md` first — every timing/type/colour/audio law still holds.
This chapter changes the same one thing the other registers do: the **unit of
composition**. Here the unit is a **staged two-device frame**, cut between.

---

## When to reach for this register

Use it when the story is "a person talks to an assistant, and work happens on
their computer" — a chat surface plus one app doing the task. It is the natural
register for an AI-product demo where the proof is *the real UI doing real work*.

| Use staged-composition when… | Use another register when… |
|---|---|
| The film is chat ↔ app: a phone conversation and a desktop doing the task. | Pure big-type/kinetic → `kinetic-type.md`. |
| You want the reference's "phone + desktop" look, hard-cut, ending on a logo. | The story is one spatial structure to fly through → `continuous-world.md`. |
| The product has 1–2 real surfaces (a chat, an app) to show truthfully. | A single held device demo is enough → `motion-craft.md` held-frame. |

---

## The model (measured off the reference — do this yourself)

**Before building, extract the reference film frame-by-frame and read it.** Do not
work from memory of it. `ffmpeg -i ref.mp4 -vf fps=1 ref_%02d.png`, then LOOK at
every frame and record, in the product's `NOTES.md`, the numbers below. The whole
register lives in these measurements:

- **Two devices max on screen.** A phone is the constant anchor; the second device
  (the desktop app) changes per beat. Never three-plus devices scattered — that
  reads as a void with toys in it.
- **Depth, not a flat row.** Foreground device larger and in front (higher z, its
  soft shadow over the other); background device smaller. They **overlap** and
  **bleed off the frame edges** — bleed is what removes dead space. A device fully
  inside frame with margin all round is the amateur tell.
- **Soft ambient shadow on the device bodies.** These are devices floating in a
  scene, not the product's own UI — a large, soft, low-opacity drop shadow
  (`drop-shadow(0 44px 90px rgba(0,0,0,.6))`-ish) is what makes them sit in space.
  (This does NOT violate a product's "flat UI" rule — that rule governs the app
  *inside* the screen, not the device body in the scene.)
- **A stage, not pure black/white.** A barely-there radial wash behind the devices
  so the shadows read (a near-black centre falling off to black; or the
  reference's warm paper). Pure `#000` kills the shadow.
- **The rhythm is two kinds of beat, alternating:**
  1. **Conversation** — the phone FULL-FRAME (bleeds top/bottom), the chat playing.
  2. **Watch the work** — phone small (anchor, foreground) + the desktop app large
     behind it, the app doing the task.
  Cut between them. Measure the reference's cut cadence (it holds each beat several
  seconds) and match it — this is not a fast-cutting register.
- **Hard cuts between beats, life within them.** Beats HARD-CUT (a 2–3 frame
  cut-in at most, never a slow cross-dissolve). Within a held beat, life comes from
  a very slow push (≤2% over the beat) plus the screen content changing — never
  from the devices sliding around.
- **End composed, then logo.** Close on a composed two-device hero (both devices,
  held, beautiful) then a clean logo card. Do NOT end on a zoom-out that reveals a
  scattered map of devices — a pull-back must be a composed frame or it is cut.

---

## In-screen motion FOLLOWS THE APP'S OWN CODE

The devices are bounded screens — their content may change while the frame holds
(screens do that). But those in-screen changes must **replicate the real app's
transitions**, read from its source, not invented reveals. For a Flutter app,
grep the source for its transition vocabulary and reproduce the exact curve +
duration:

- `AnimatedSwitcher` content swap → new content slide+fades in on the app's
  switch-in curve over its real duration.
- `AnimatedOpacity` → fades on its curve/duration.
- The app's house curve (e.g. `fastEaseInToSlowEaseOut`) → element settles.
- Chart animation curve/duration → count-ups and bar-grows.

Record the measured curves+durations in the product's `NOTES.md` and cite the
source file:line. A screen that transitions the way the real app transitions is
what separates a credible product film from a mockup that merely looks like it.

---

## The laws of this register

Everything in `motion-craft.md` still holds. These are the additions.

- **Two devices, composed with depth, bleeding off-frame.** If a beat has three
  devices, or two devices sitting in a flat row with margins, it's wrong.
- **The phone is the anchor; keep its content continuous.** Drive each screen from
  the global frame so history is consistent across a cut, even as a device leaves
  and re-enters frame.
- **Cut between beats; do not fly.** This register cuts. If you want a continuous
  camera through a space, you're in the wrong register (`continuous-world.md`).
- **Soft device shadow + stage wash, always.** Without them the devices are flat
  stickers on a void.
- **Every beat is deliberately framed.** Positions/scales are art-directed to a
  balanced composition (one focal device, the other supporting), not dropped
  arbitrarily. Render the beat's key frame and LOOK before moving on.
- **Screens move like the real app.** In-screen transitions use the app's measured
  curves+durations, cited to source.
- **End composed.** Hero frame → logo. No scattered pull-back.

---

## Worked example — an AI-assistant product (MyBola v2 shape)

One phone (the assistant chat), one laptop (the app dashboard). ~50s, portrait.

| Beat | Composition | Content (app-transition timed) |
|---|---|---|
| 1 Conversation | Phone FULL-frame, soft shadow, slow push | Owner asks; the AI reply slides in (AnimatedSwitcher curve). |
| 2 Watch the work | Laptop large behind + phone small foreground lower-left, both shadowed, overlapping | The answer becomes the dashboard — cards load (switch-in), values count, bars grow (chart curve). |
| 3 Conversation | Phone FULL-frame (the customer surface) | WhatsApp thread plays; Auto-balas toggles on the house curve; owner takes over. |
| 4 Hero | Phone foreground-left + laptop right, bleeding off-frame, both shadowed, held | Composed beauty shot; nothing moves but a 2% push. |
| End | Logo card | Wordmark resolves; hold. |

Beats 1&3 are conversation (phone full); 2&4 are two-device compositions. Hard
cuts between. Ends composed → logo. No fly-through, no zoom-out reveal.

---

## Fast checklist (plus `motion-craft.md`'s)

- [ ] Reference measured frame-by-frame; numbers in the product's `NOTES.md`
- [ ] ≤ 2 devices per beat, composed with depth (foreground larger, overlap, bleed)
- [ ] Soft ambient shadow on device bodies + a stage wash so shadows read
- [ ] Alternating rhythm: phone-full conversation ↔ phone+desktop work
- [ ] Hard cuts between beats; life = slow push + screen content, not sliding devices
- [ ] In-screen transitions replicate the app's real curves+durations (cited to source)
- [ ] Ends on a composed hero → logo; no scattered zoom-out
- [ ] Every beat's key frame rendered and looked at
