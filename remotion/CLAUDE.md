# MyBola Product Video (Remotion)

Code-driven launch video for MyBola — a Malaysian football academy management SaaS
(AI admin assistant + AI parent inbox). Built with Remotion (React + TypeScript),
rendered to portrait 1080x1920 MP4. Current cut: v7 (~46s), composition id `MyBolaV4`.

## Commands

- `npm run studio` — live preview (primary dev loop; hot-reloads on save)
- `npm run render` — full render to `out/mybola.mp4`
- `npm run still -- --frame=N` — single frame PNG for quick checks
- Audio: `python make_audio.py` synthesizes music/SFX WAVs; mix with ffmpeg
  `amix` (see Audio section below)

## Architecture

- `src/Root.tsx` — registers compositions (`MyBolaLaunch` = old v3, `MyBolaV4` = current)
- `src/LaunchVideoV4.tsx` — current timeline: scene lengths, chapter frames, all copy
- `src/realui.tsx` — REAL MyBola UI recreated from the Flutter app source, plus
  WhatsApp UI, PhoneFrame device mockup, StatusBar
- `src/components.tsx` — serif/brand layer (fonts loader, HeroText, legacy v3 comps)
- `src/theme.ts` — legacy cream theme tokens (v1–v3)
- `public/fonts/` — Playfair Display (serif narration), Plus Jakarta Sans (UI stand-in
  for Axiforma), Inter

## Design system — two-layer rule (critical)

1. **Narration layer** — cream canvas `#E8E0D3`, ink `#1F1B16`, coral `#C15F3C`,
   Playfair serif. Greeting, punctuation cards (with letterspaced MYBOLA kicker),
   and the KINI DILANCARKAN close live here. Coral NEVER appears inside the phone.
2. **Product layer** — everything inside `PhoneFrame`: the real dark app UI.
   The phone NEVER moves; only the camera zooms (scale on the whole frame).

## Code-exact UI rule (critical)

Every UI figure inside the phone must match the real Flutter app source at
`../../project-4/flutter/lib/` (relative to this repo's parent):

- Tokens: `lib/core/app_theme.dart` — primary #0091FF, secondary #1C1C1E,
  border #1A1A1A, success #30D158, error #FF4245, tertiary 33% white.
  Text roles: body 16/400, title 17/500, label 15/500, meta 13/500 tertiary.
- Bubbles: `lib/widgets/media/message_bubble.dart` — AI = primary @20% alpha,
  corners 12/12/4(bl)/12; user = secondary, 12/12/12/4(br); padding 10;
  caption "Pengurus · h:mm a" in meta below.
- Omnibar: `lib/portal/chat/chat_omnibar/chat_omnibar.dart` — GlassShell
  (radius 16, blur, margin 10), row: attach, mic, slash-chip 15x15, field
  (hint "Semua urusan bermula di sini...", processing "Pengurus sedang memproses
  permintaan anda…"), send 32x32 arrow-RIGHT (blue when text present).
- Action sheet: `lib/portal/chat/chat_omnibar/chat_action_card.dart` —
  ActionSummaryCard (title/subtitle/field rows) + numbered DesktopButtons
  (h28, radius 6, "1. Kemaskini" primary, "2. Padam" error, "0. Batal dan
  kembali" secondary). Transcript dims to 0.2 behind it.
- Scale: 390pt logical width → 1080px content = 2.7x (`SC` in realui.tsx).
- No emoji in compositions (headless Chrome renders blank boxes). No invented
  UI cards — if it doesn't exist in the Flutter source, it doesn't go in the video.
- WhatsApp scene: exact WA dark theme (bg #0B141A, bar #202C33, out #005C4B,
  ticks #53BDEB, send circle #00A884).

## Copy

All on-screen copy is Bahasa Malaysia. AI label is "Pengurus". Demo cast:
coach ("Anda"), player Adam Haris (U-12), parent Puan Aida. Times: admin 9:41 AM,
parent 9:02 PM — status bar clock must match bubble timestamps.

## Audio

`make_audio.py` synthesizes: chord-pad score with chord changes locked to scene
boundary frames (update the frame table there when scene lengths change), bass
pulse during conversations, riser+impact at every cut, typing taps before user
sends, send/receive pops, music ducking under typing windows. Mix:
`ffmpeg -i silent.mp4 -i music.wav -i sfx.wav -filter_complex "[1:a][2:a]amix=inputs=2:duration=first:normalize=0[a]" -map 0:v -map "[a]" -c:v copy -c:a aac out.mp4`

## Verify before declaring done

Render stills at each scene's key frame and LOOK at them; after full renders,
extract frames at transitions (`ffmpeg -ss <t> -frames:v 1`) and check audio
(`volumedetect`: mean ≈ −20 to −23 dB; SFX present in typing windows).

## Backlog (from Dispatch-reference gap analysis, priority order)

1. Texture & depth: subtle grid/paper texture behind chat, soft gradient washes,
   larger diffuse phone shadow.
2. Evidence bubbles: AI sends an image message showing a real app screen
   (bills list / attendance view) inside the chat.
3. Multi-device scene: phone chat + laptop mockup with admin portal side by
   side, one action flowing across both.
4. Simulated cursor interaction on the desktop side (menu click, export flow).
5. Hand-tune spring configs per shot in Studio (was impractical in sandbox).
6. Real Axiforma font files if licensed (swap in public/fonts + realui.tsx).
