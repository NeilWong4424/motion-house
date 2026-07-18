# Delivery — mastering a film for where it plays

A genre chapter, and the /video skill's final mastering step. A film isn't done
when it renders — a house delivers the right master for each destination. Read
`motion-craft.md` first for the quality bar; this is about getting that quality
out the door correctly.

## The one idea

**One film, many masters.** The cut is designed once, then mastered per platform.
A Reel, a YouTube hero, and a feed post are the same film in different frames —
and a film that ignores its destination's constraints (safe areas, aspect,
captions) looks amateur no matter how good the animation is.

## Format & aspect

- **Design for the primary destination first.** Social feed → `PORTRAIT` (9:16);
  web hero / YouTube → `LANDSCAPE` (16:9); feed post → `SQUARE`; title banner →
  `CINEMA` (21:9). The format presets are in `shared/engine/types.ts`.
- **Adapt, don't just crop.** Re-mastering to another aspect means re-framing —
  move type into the new safe area, re-centre the subject — not letterboxing or a
  blind centre-crop that cuts off content.
- **Keep the master lossless.** Render the delivery master with the config's
  quality settings (PNG intermediates, BT.709, low CRF). Platform re-encodes are
  lossy; don't hand them an already-degraded file.

## Safe areas

- **Keep the essential inside the safe zone.** Social platforms overlay UI (top
  status, bottom caption/CTA, right-side action rail). Keep type and the subject
  clear of those bands — roughly the outer ~12% on a vertical feed video.
- **Title-safe vs action-safe.** Text stays further in than graphics. When in
  doubt, pull type toward centre.

## Captions & accessibility

- **Caption the speech.** Most feed video plays muted — if the film relies on VO,
  it needs burned-in or track captions or the message is lost.
- **Contrast for legibility.** Caption text needs a scrim or outline to stay
  readable over any frame.

## Sign-off checklist

- [ ] Correct aspect/format for each destination, re-framed (not cropped)
- [ ] Essential content inside safe areas for each platform
- [ ] Master rendered at full quality; audio muxed and loudness verified
- [ ] Captions present if the film carries speech
- [ ] File named per destination so masters don't overwrite each other

## Reference bar

How an agency ships: a campaign arrives as a labelled set of masters (16:9, 9:16,
1:1, captioned/clean), each correctly framed for its platform — not one file the
client has to crop themselves.
