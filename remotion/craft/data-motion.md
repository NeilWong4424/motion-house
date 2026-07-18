# Data motion — numbers and charts that arrive

A genre chapter. Read `motion-craft.md` first. For films where a number or a
chart is the message. Primitives: `shared/motion/data.tsx` (+ `CountUp` in
reveal.tsx). For colour-by-series and chart colour, use the repo's `dataviz`
skill — it owns the palette system; this chapter owns the *motion*.

## The one idea

**Animate the number honestly.** A bar grows to its true value once and holds. It
does not overshoot the real figure for drama, bounce past it, or keep pulsing. The
moment a data animation lies for effect, a numerate viewer stops trusting the
film — and the whole point of showing data was trust.

## Rules

- **The number is the subject; the chart is support.** The axis, gridlines, and
  track are muted and thin. If the grid competes with the data, invert the weight.
- **One value arrives at a time, or a tight stagger.** A row of bars staggered
  3–4 frames reads as "the data assembling." All at once reads as a static image
  that happened to fade in.
- **Reveal pace = reading pace.** `CountUp` and `Bar`/`Ring` grow over ~20–32
  frames — long enough to register the change, short enough not to drag. A number
  that ticks for 3 seconds is showing off.
- **Ease out, not linear.** A value decelerating into its final figure feels
  measured; a linear crawl feels mechanical. (The one exception: `Ticker`, a
  continuous marquee, which legitimately uses a constant rate.)
- **Land, then label.** Let the bar reach its value, THEN bring the label/figure —
  cause before effect. Don't animate the number and the bar out of sync.
- **Hold the finished chart.** The viewer reads a chart after it settles. Give it
  a full beat before the cut.

## Reference bar

Broadcast election graphics; sports stat overlays; a well-made financial explainer.
The good ones make the number the hero and the chrome invisible.
