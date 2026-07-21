# MyBola v2 — product notes (multi-device continuous-world launch)

Standalone from `products/mybola`. Same real product, a **separate package** — no
imports cross between the two. Engine doctrine lives in `remotion/craft/`; this
file is the code-exact source of truth for v2.

## The concept — staged-composition register (craft/staged-composition.md)
Modelled on the Cowork reference, measured frame-by-frame: a rhythm of COMPOSED
beats that hard-cut between "conversation" (phone full-frame) and "watch the work"
(phone anchor + one desktop, composed with depth + soft shadows on a stage wash,
bleeding off-frame). NOT a camera flown across a canvas, and NO zoom-out reveal.

Surfaces:
- **Phone — Pengurus Akademi admin chat** (MyBola dark UI, omnibar + bubbles).
- **Laptop — full admin dashboard** (landscape: academy rail | 236px sidebar |
  metric cards, Top-10 ranked bars, upcoming session).
- **Phone — WhatsApp customer side** (real WhatsApp colours; Auto-balas flips).

## The film
Portrait 9:16, 1780f / ~59s @ 30fps, Bahasa Melayu, on-screen product + music.
`id = MyBolaV2Launch`.

Beats (hard cuts between; life = slow ≤2% push + screen content, per
`ui/world.tsx` `DeviceLayer`):
1. [0–440] **Phone full** — admin chat: "siapa belum bayar?" → dues → reminders.
2. [440–820] **Phone small + laptop** — the answer on the dashboard (metric cards
   load on the AnimatedSwitcher curve, values count, bars grow on the chart curve).
3. [820–1120] **Phone full** — WhatsApp: customer helped, Auto-balas flips to "Anda".
4. [1120–1360] **Composed hero** — phone foreground-left + laptop right, both
   shadowed, bleeding off-frame, held.
5. [1360–1540] **End card** — MyBola wordmark. No zoom-out reveal.

Device staging: soft ambient shadow on the device bodies (`drop-shadow`) over a
near-black radial stage wash (`MB.stageHi`→`stageLo`) so the shadows read on the
pure-black brand canvas.

## In-screen transitions FOLLOW THE APP'S CODE (not arbitrary reveals)
Read from the real Flutter source and reproduced in `ui/surfaces.tsx`:
- **AnimatedSwitcher** content swap — 300ms (9f), switchIn `Curves.easeOutQuart`,
  Slide+Fade (`portal/shell/home_screen.dart:373`). → `swIn()`, used for every
  chat/WhatsApp message arrival and the dashboard content load.
- **AnimatedOpacity** screen fades — 600ms easeIn (`portal/chat/chat_content.dart:169`).
- **House curve** `Curves.fastEaseInToSlowEaseOut`, 600ms (sidebar / business_rail /
  page_dismiss_bar / button) — the app's signature settle.
- **Chart** grow/count — 400ms easeOut (`portal/charts/line_chart.dart:124`). →
  dashboard values count + bars grow.

## Continuous-world invariants (verify, not just "looks nice")
- One `World` (`ui/world.tsx`), mounted for the whole film. No per-scene remount.
- Every device is one `WorldObject` with a stable key; devices never unmount.
- One camera (`useCamera(CAM)`) over the whole film; "scenes" are waypoints.
- Holds outweigh moves in time. Every camera move is a pan/zoom across the canvas
  the eye can track between two physical devices — no teleports.

## Tokens (real app — core/app_theme.dart, as `MB`)
bg `#000000` · primary `#0091FF` · success `#30D158` · warning `#FF9230` ·
surface `#1C1C1E` · border `#1A1A1A` · tertiary `rgba(255,255,255,.333)`.
WhatsApp: header `#1F2C34`, bg `#0B141A`, outgoing `#005C4B`, green `#25D366`.
**Flat, no shadow.** Type 1:1 with `class text`/`class cardText` (see `tokens.ts`).
Currency `rm()` → `RM1,234.56`.

## Copy — verbatim (from real source)
Omnibar placeholder "Semua urusan bermula di sini..."; processing "Pengurus sedang
memproses permintaan anda"; captions `{sender} · h:mm` (Anda / Pengurus Akademi);
dashboard labels "Jumlah Tertunggak", "Ahli Aktif", "Sales Minggu Ini", "Top 10
Ahli Tertunggak"; page list Ringkasan/Ahli/Bil/Sesi/Inbox; toggle "Auto-balas";
end card "MyBola" / "Akademi Anda, Cara Anda." / CTA "Mohon Akses Awal".

## Font substitution (state at delivery)
Axiforma (licensed) → Inter (UI/body) + Anton (display headline), reusing shared
`public/fonts/`. Re-check wrap-boundary text after render.

## Reconstruction rule
AI replies are runtime-generated (Gemini) in the real app; on-screen lines are
rule-faithful reconstructions from canonical patterns. Never invent product facts.

## Audio
Warm calm bed; the payoff is the owner taking over the customer chat end-to-end
(frame 1266), resolving into the end card. SFX: send tap, a soft whoosh under each
camera fly-between, Auto-balas switch-click. See the `audio` brief on the `VideoDef`.
