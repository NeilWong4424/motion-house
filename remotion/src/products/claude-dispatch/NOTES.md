# Claude "Dispatch" — Reference Analysis (measured)

Reference: `Recording 2026-07-17 073006.mp4`. All facts here are **measured** from full-res frames via ffmpeg — not invented. This is the code-exact source of truth for the replica.

## ⚠️ Key facts about the source (revised after reading ALL 1091 frames)

The recording is a **screen-capture of the film playing in a web video player**, exported/played at **2× speed**:
- Player chrome shows timecode **`1:11 / 1:13`** at the end → the film's real-time length is ~**73 s**, but this capture is **36 s** = **2× speed**.
- Reading every frame confirms the capture is the **COMPLETE film**, start to end: it opens on the title (f0) and ends on the fully-bloomed Claude logo held to f1090. Nothing is missing — earlier "partial capture" worry was wrong.
- The outer rounded border + bottom player bar (play/scrubber/CC/fullscreen) are **capture artifacts** — do NOT reproduce them.

**Timing consequence for a 1:1:** every frame count below is in **recording frames @30fps (2×)**. For the real-time master, **double them** (e.g. an 8-frame handoff here ≈ 16 frames @1×). Decide per deliverable which timeline to match. All content/copy/layout below is authoritative either way.

## Format (of the capture)

| | |
|---|---|
| Resolution | 1348×754 (has ~12px player border; film content ~1324×730) |
| fps | 30 |
| Frames | 1091 (36.35s) |
| Codec | H.264 Main, yuv420p |

## Palette (measured, clean reads)

```
bg          #e1d7cb   warm bone/oat — constant ground, whole film
accent      #c67462   terracotta/rust — user chat bubbles + squiggle connector
squiggle    #c67462   same rust, hand-drawn stroke
logoMark    #cf6e5a   Claude sunburst (slightly warmer rust)
ink         #1c1a17   near-black — display serif + "Claude" wordmark
chatIn      #ffffff   assistant/system bubbles (white, soft shadow)
chatInGrey  ~#ececec  older/system bubbles
onlineDot   #3fae5a   "Online" status dot (greenish)
finderDesk  #bcd2c8   macOS desktop wallpaper (soft teal-green with faint lines)
```

## Typography (measured)

- **Display serif** (title + copy-lines): high-contrast transitional/Scotch serif. NOT Playfair — closer to **Tiempos / Canela / GT Sectra**. Ball terminals, moderate contrast. Likely Anthropic's brand serif (Copernicus / Tiempos). → ship **Playfair Display** or **GT-Sectra substitute** and STATE the substitution. Examples: "Reach your desktop from your pocket", "Like when the deck is on your laptop, but you aren't".
- **UI / chat sans**: humanist grotesque — **Styrene / GT-America** feel (Anthropic brand sans). NOT Inter (Inter is more geometric). Ship **Inter as substitute** and note the metric shift, OR source the real face. Used in all chat, app chrome.
- Chat bubbles: ~28–32px radius, generous padding (~24px), 3-line wraps.

## The squiggle (the signature element)

A hand-drawn **rust connector** between phone (left) and desktop (right). Confirmed **animated stroke reveal**: at f≈240 (t=8.0) it's a short arc; at f≈210 (t=7.0) it's the full double-loop curl. It draws on via stroke-dashoffset each time a desk beat opens, ~15–20 frames. Shape: a curl-loop-curl, like a cursive connector. Reproduce as an SVG path with `stroke-dasharray` reveal.

## Beat table (frame-accurate, from scene-score peaks @30fps)

| Beat | Frames | Time | Content (measured, exact copy) |
|---|---|---|---|
| Title | 0–95 | 0–3.2s | Serif "Reach your desktop / from your pocket" + "RESEARCH PREVIEW" pill; phone slides in with "Get desktop app link" / "Pair with your desktop" buttons |
| V1 line | 95–101 | 3.2s | "Like when the deck is on your laptop, but you aren't" |
| V1 chat | 101–193 | 3.4–6.4s | Bubble: "I'm running late to an appointment. Can you export my pitch deck as a PDF and attach it to my 2 PM invite?" |
| V1 desk | 193–418 | 6.4–13.9s | **macOS PowerPoint** — menu File▸**Export** highlighted, slide "Northgate Digital Strategy / Driving Traffic Growth & Maximizing Revenue Conversion", 7-slide thumbnail rail. → **Finder** save sheet: Desktop, files `Northgate_Pitch_v3.pdf` (Today 12:10 PM, selected), `Northgate_Pitch_v3.pptx` (9:47 AM), `Northgate_Pitch_v2.pptx`, `brand-assets-final.zip`, `Screenshot 2026-03-18 at 4.31 PM`, `Q1-numbers.xlsx`. Cancel / **Open** (blue). → phone confirms |
| V2 line | 418–442 | 13.9s | "Or when it's time to check the build, but you're on the train" |
| V2 chat | 442–491 | 14.7–16.4s | "Start the dev server, screenshot the library page, and send it to me before the demo at 3PM. Please!" |
| V2 desk | 491–732 | 16.4–24.4s | **Claude browser** on `127.0.0.1:62026/library` — **Cueform** music-library app, "Library · 12 collections · 247 total tracks", 4-col preset-card grid (Thriller S2, Brand Launch…), track list (Fractured Horizon, Descent Into Chaos…). Phone replies: "On it — starting a code task…", "App's running — found the library page.", "22 preset cards in a 4-column grid under \"Cueform/Library\". Now getting the screenshot!" |
| V3 line | 732–758 | 24.4s | "Or when there are 150 photos to process, but you have dinner plans" |
| V3 chat | 758–805 | 25.3–26.8s | "Can you batch process all the shop photos on my desktop? Size them as 1200px PNGs and add the white logo bottom-right. Ran out of time to do it myself" |
| V3 desk | 805–1035 | 26.8–34.5s | **iMac** running **PixelForge** (Photoshop-like): pottery-bowl photo, Layers panel (001–010, dimensions/sizes), **Batch Export** green button, Properties W 2546 / H 2667 / RGB 8-bit. → Finder folder of exported PNGs. Phone confirms "New folder on your desktop" |
| End | 1036–1091 | 34.5–36.4s | ✳ **Claude** sunburst blooms from a dot + wordmark writes on; logo lockup holds to end (frame-by-frame confirmed this is the true end card, not a seek artifact) |

## Transitions — read FRAME-BY-FRAME from every-frame extraction (definitive)

All 1091 frames were extracted and the transition windows read as consecutive-frame strips. This is how each transition actually moves — not inferred from scene-scores.

### A. Copy-line → chat  (HARD CUT, verified f412–426)
The serif copy-line holds **perfectly static** (zero motion for its whole hold), then **snaps instantly** to the rust chat bubble, which also holds static. No dissolve, no slide. One frame it's the line, next frame it's the bubble. Serif text does a short rise-in only at the *start* of its card (~8–10f), not at the cut.

### B. Phone-full chat → desk  (COORDINATED SLIDE, verified f150–178)
NOT a cut. Over ~10–14 frames:
1. Phone (full-frame) **scales down** to ~40% and **slides left** to its anchor position.
2. The desktop surface **slides in from the right edge** simultaneously, scaling up from off-frame.
3. The **squiggle draws on** in the gap between them.
All three are time-locked — an eased move (ease-in-out, ~0.4–0.5s). This is the film's signature move.

### C. Desk-entry app build-up  (IN-APP ANIMATION, verified f190–226 V1, f800–832 V3)
Once the desktop is anchored, the app content animates **natively inside the window**, not via cuts:
- **V1 PowerPoint**: window scales/pushes in → **File menu drops down** → menu items highlight → **Export dialog springs up** center (~90%→100% scale) settling to the PDF sheet. ~30f total.
- **V3 iMac/PixelForge**: desktop opens as a **scattered photo cloud** → app chrome loads dark → the **150-photo grid populates/fills in progressively** over many frames.
This is why these stretches read as low scene-scores — continuous animation, not edits.

### D. The squiggle  (STROKE-DRAW + CYCLE, verified f196–240, f800–832)
An animated rust stroke, **drawn on via stroke-dashoffset** each time a desk beat opens (~15f), held, then it **resets/redraws** — visible cycling short-arc→full-curl→short across a beat. Shape: **left curl → dip → right double-loop** (cursive connector). Reproduce as an SVG path with a `strokeDasharray`/`strokeDashoffset` reveal driven by frame.

### E. Chat scroll  (verified f150–166)
Within a phone-full beat, older messages are already present and the transcript **scrolls up** as new bubbles settle in at the bottom (spring-up + fade, ~6f each), plus small reaction glyphs appear under bubbles.

### F. Beat→beat between vignettes  (HARD CUT)
Scene scores 0.19–0.33 (strongest f248, 0.33). Desk → next copy-line is an instant cut.

### Composition / depth
Desktop windows **bleed off the right + bottom frame edge**, rounded corners, soft drop shadow. Phone floats with its own soft shadow. Depth staging, both devices on the bg plane.

### ⚠️ 2× speed note
User reports the source film is exported/played at **2× speed**, so the real film is ~73s of content. That means every transition duration measured here in *recording frames* corresponds to **2× as many frames in the real-time master** (a 12-frame handoff here = ~24 frames at 1×). When building at true 1× timing, **double the frame-durations** given above (or build at the recording's compressed timing if matching THIS file). Confirm which timeline the deliverable targets.

## Layout (measured, at 1348×754)

- **Phone**: left third, centered vertically, ~x=90–265, full-height ~200–560px tall in desk beats; **full-frame** in chat beats.
- **Desktop window**: right ~60%, top-anchored (~y=95), bleeds off right + bottom edge.
- **Squiggle**: center gap, ~x=380–470, y≈370.
- **Copy-lines / title**: centered.

## Build implications

- Format: **LANDSCAPE** 16:9 (build 1920×1080; strip the player chrome — do NOT reproduce the scrubber/border, that's capture artifact).
- Duration for THIS replica: 1091f/36.4s (first half only). Full film = 73s if master obtained.
- Fonts + real UIs are Anthropic brand assets — treat as a study/replica, substitute licensed faces and state it.
- The three desktop apps (PowerPoint, Cueform browser, PixelForge) are **fictional/demo UIs** in the film — recreate them as shown, they don't need to match a real product beyond the recording.

## FRAME-BY-FRAME LOG — every frame read (all 1091, recording frames @30fps/2×)

The whole film was extracted to individual frames and read as contiguous 48-frame strips (no gaps). This is the shot list. Cut frames are exact (±1). "hold" = zero motion. Times shown are recording-time; ×2 for real-time.

| Frames | What happens (motion, not just content) |
|---|---|
| 0–5 | Empty bg; "RESEARCH PREVIEW" pill top-center only. |
| **6–13** | Serif title reveal: "Reach your desktop" rises, then "from your pocket" (line 2, lighter) staggered in. |
| 14–37 | Title holds static. |
| **38–46** | Pairing panel **rises up from bottom** (phone+laptop illustration, "Get desktop app link" / "Pair with your desktop"); settles. Tiny squiggle appears between mini-devices. |
| 47–56 | Panel holds; mini-squiggle wiggles. |
| **CUT @57** | HARD CUT → V1 copy-line "Like when the deck is on your laptop, but you aren't" (line2 fades +1f). |
| 58–97 | Copy-line holds static. |
| **CUT @98** | HARD CUT → hero rust bubble (full-screen, centered): "I'm running late to an appointment. Can you export my pitch deck as a PDF and attach it to my 2 PM invite?" |
| 99–132 | Hero bubble holds. |
| **133–143** | **Hero→phone MORPH**: "12:04 PM" timestamp fades in, Dispatch phone chrome materializes around the bubble; bubble becomes an in-chat message; context bubble ("Downloads folder — signed contract-v3.pdf…") + "Sure thing — pulling up the deck now" appear. |
| 144–167 | Phone-full chat; messages settle, chat scrolls slightly, 👍 reaction ~f166. |
| **168–175** | **HANDOFF (signature move)**: phone scales down + slides left; Finder/desktop (teal-green) slides in from right; squiggle starts drawing. ~8 frames, eased. |
| 176–199 | Two-device locked (phone L / squiggle / laptop R). Laptop scales up; Northgate deck loads; squiggle draws in fully. |
| **200–213** | In-app: **PowerPoint File menu drops down**; "Export…" highlighted. |
| **214–221** | In-app: **Export dialog springs up** center (~90%→100%): Northgate_Pitch_v3 / Where Desktop / Format PDF / Cancel·Export. |
| 222–247 | Dialog holds; squiggle cycles (draws, resets). |
| **CUT @248** | HARD CUT (strongest, score 0.33) → **macOS Finder** browse view (file list, Northgate_Pitch_v3.pdf selected blue, Cancel/Open). |
| 249–271 | Finder holds; squiggle cycles. |
| **~272** | Softer transition → **Calendar** week grid (pink/green event blocks) bleeds in over Finder. |
| 273–327 | Two-device: phone L / Calendar R holds; event popover appears ~f285. |
| **328–331** | **RETURN HANDOFF**: Calendar slides right-out, phone scales up + slides back to center. |
| 332–378 | Phone-full confirm chat: "Attached the PDF to your 2 PM invite. Grabbed the version you edited at 9:47 this morning, exported full quality. You're good to go." Scrolls as lines arrive. |
| **CUT @379** | HARD CUT → V2 copy-line "Or when it's time to check the build, but you're on the train". |
| 380–426 | Copy-line holds static. |
| **CUT @427** | HARD CUT → hero bubble "Start the dev server, screenshot the library page, and send it to me before the demo at 3PM. Please!" |
| 428–434 | Hero bubble holds. |
| **435–447** | Hero→phone MORPH (identical to V1): "3:09 PM", phone chrome in; "On it — starting a code task…" appears. |
| 448–489 | Phone-full chat; "App's running — found the library page." settles; reaction ~f475. |
| **490–495** | HANDOFF: phone L, **blue Claude-browser** window slides in R; squiggle draws. |
| 496–519 | Two-device: in-app **terminal/code panel** (black, "Claude Code" green header, dev-server logs stream), then **Cueform Library** dark page renders in browser. |
| 520–575 | Two-device hold: phone L / Cueform "Library" (247 tracks, 4-col preset grid) R; squiggle cycles. |
| **~576** | Shifts to **phone-forward two-device** (phone LARGE-left, laptop small-right): confirm chat "22 preset cards in a 4-column grid under \"Cueform/Library\". Now getting the screenshot!" |
| 576–710 | Phone-forward confirm beat; screenshot preview in chat; "Rendering looks clean with new brand. Header is a 4-column grid…" settles. |
| **CUT @711** | HARD CUT → V3 copy-line "Or when there are 150 photos to process, but you have dinner plans". |
| 712–~757 | Copy-line holds static. |
| **CUT @~758** | HARD CUT → hero bubble "Can you batch process all the shop photos on my desktop? Size them as 1200px PNGs and add the white logo bottom-right. Ran out of time to do it myself" |
| ~759–~805 | Hero holds → MORPH to phone; "Found them — starting the batch now. I'll ping you when it's done." |
| **806–815** | HANDOFF: phone L, **iMac** slides in R with a **scattered photo cloud** on lavender desktop; PixelForge opens dark. |
| 816–959 | Two-device: **PixelForge** (photo editor) — 150-photo **grid populates progressively**, pottery-bowl hero photo, Layers 001–010, Batch Export (green), Properties W2546/H2667/RGB. Squiggle cycles. |
| 960–991 | In-app: **Finder save dialog** over PixelForge → **Finder folder** of exported PNGs (blue-selected row). |
| **992–1000** | RETURN HANDOFF: iMac slides right-out, phone slides back (phone-forward two-device). |
| 1001–1035 | Phone-forward confirm on **lavender-wave desktop bg**: "Done! 150 photos added to a new folder on your desktop…" |
| **CUT @1036** | CUT to empty bg with a tiny rust **dot** center (sunburst seed). |
| **1037–1044** | **Claude sunburst BLOOMS** from the dot (rays grow outward, scale-in). |
| **~1044–1050** | **"Claude" wordmark writes/fades in** beside the mark ("Cla"→"Claude"). |
| 1050–1090 | Full ✳ Claude logo lockup holds to end. |

### Transition inventory (distinct types, all frame-verified)
1. **Serif reveal** (title, ~7f rise/stagger) — start of title only.
2. **Panel rise from bottom** (pairing card, ~8f).
3. **HARD CUT** — line↔hero-bubble↔next-line, and desk→Finder. Instant. Frames: 57, 98, 248, 379, 427, 711, ~758, 1036.
4. **Hero-bubble → phone MORPH** — timestamp fades + phone chrome materializes around the held bubble (~10f). At f133, f435, ~f760.
5. **HANDOFF (signature)** — phone scale-down+slide-left ⟷ desktop slide-in-right + squiggle draw, ~8f eased. Forward at f168/490/806; reverse at f328/992/~576.
6. **Squiggle** — stroke-dashoffset draw (~15f), holds, resets/redraws each desk beat. Shape: left-curl→dip→right-double-loop.
7. **In-app native animation** — menu drop (f200), dialog spring (f214), terminal stream, grid populate (f816+). Content moves *inside* the window; no cut.
8. **Soft dissolve** — Finder→Calendar (~f272) is softer than the hard cuts.
9. **Logo bloom** — dot→sunburst rays scale-in (~7f) + wordmark write-on.
10. **Composition variants** — desk-forward (desktop big, phone anchor) vs phone-forward (phone big, desktop small); the film alternates them.

*Measured with ffprobe/ffmpeg, all 1091 frames read as contiguous strips. Raw scene-score data in `../../../Recording-2026-07-17-analysis.md`. Cut frames ±1 (2× recording timeline).*
