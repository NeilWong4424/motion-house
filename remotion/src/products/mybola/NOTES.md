# MyBola — product notes (launch film)

Product-specific facts for the MyBola launch cut. Engine doctrine lives in
`remotion/craft/`; this file is the code-exact source of truth for THIS product.

## What MyBola is
"MyBola — Akademi Anda, Cara Anda" (Your Academy, Your Way). A Malaysian sports-
**academy** app (Flutter + FastAPI). Currently in **closed testing**. This film
covers the **academy** business type only — no Fasiliti / operator / booking.

## The film
Portrait 9:16, ~58s, 30fps, Bahasa Melayu, on-screen text + music (no VO).
Style reference: Claude product-launch films (warm minimalism, product doing real
work on screen, prose-like pacing). No Claude footage appears — reference only.
Measured off the reference recording: ~1 framing / 4.5s, quiet mix (mean −37 dB).

## HARD RULE — 1:1 replication
Every MyBola screen is replicated 1:1 from the real Flutter source. Values below are
read from those files; do not approximate. Source files:
- Theme: `flutter/lib/core/app_theme.dart`
- Admin chat: `flutter/lib/portal/chat/{chat_content,chat_omnibar/*,chat_tips}.dart`
- Inbox: `flutter/lib/portal/admin/shared/inbox/view/inbox_thread_pane.dart` + siblings
- Sessions: `flutter/lib/portal/user/akademi/card/session_card.dart` + sheet
- Charts: `flutter/lib/portal/charts/{line_chart,ranked_bar_chart,metric_list}.dart`
- Channels: `flutter/lib/domain/models/shared/conversation/conversation_enums.dart`
- Accepted inputs: `mybola_backend/app/conversation/media.py` (`ALLOWED_MIME`)

## Tokens (app_theme.dart → design.ts `MYBOLA`)
bg `#000000` · primary `#0091FF` · success `#30D158` · warning `#FF9230` ·
error `#FF4245` · info `#3CD3FE` · surface/secondary `#1C1C1E` · border `#1A1A1A` ·
tertiary `rgba(255,255,255,.333)` · hover `rgba(255,255,255,.125)`. **Flat, no shadow.**

Type scale (Axiforma in-app → Inter substitute here), px / weight / letter-spacing:
heading 20/600/+0.38 · title 17/500/−0.43 · body 16/400/−0.31 · label 15/500/−0.23 ·
hint 16/400/−0.31 (dim) · meta 13/500/−0.08 (dim). cardText: displayHero 52/300/−1.0 ·
display 28/600/−0.5 · title 20/700/0 · titleSm 16/600/+0.1.
Currency: `formatRmCurrency` → `RM1,234.56` (RM prefix, no space, 2 decimals).
Signature selection animation: radius morphs 4 ↔ 16 when a row/chip selects.

## Font substitution (state at delivery)
App uses **Axiforma** (licensed; no woff2 in engine). Substituted: **Inter** for all
UI/body, **Anton** for the big display headline. Metrics differ slightly; re-check
any wrap-boundary text after render.

## Copy bank — VERBATIM (quote-safe, from source)
- Chat omnibar placeholder: **"Semua urusan bermula di sini..."**
- Chat processing (full-page): **"Pengurus sedang memproses permintaan anda"** + dots
- Quick tips (`chat_tips.dart`), e.g.:
  - *"Tanya bahasa biasa: 'berapa ahli tamat tempoh bulan depan?' atau 'siapa belum bayar?'"*
  - *"Snap resit atau IC - saya baca terus dan isi borang ahli atau bil tanpa taip manual."*
  - *"Mula hari dengan /start - saya beri ringkasan bil tertunggak, sesi akan datang..."*
- Bubble captions: customer **"Pelanggan"**, AI **"Pengurus Akademi"**, human **"Anda"** (`{sender} · h:mm`).
- Inbox thread: **"Auto-balas"** switch (on = AI auto-replies); reset dialog **"Set Semula AI"**.
- Inbox reply placeholder: **"Taip balasan…"**
- Channel: **WhatsApp**, brand `#25D366`.
- Concierge reply pattern (canonical test string): *"…RM150.00. Boleh bayar melalui pautan ini."*
- Payment link form: `https://mybola-admin.com/payment/<id>`
- Receipt (auto-posted after real payment; PDF `resit-<invoice>.pdf`):
  **"Terima kasih! Pembayaran RM… anda telah diterima."** (drop the ✅ — QC bans emoji)
- Auto-reply failure apology: *"Maaf, kami menghadapi gangguan teknikal buat seketika..."*
- Billing statuses: **Belum Bayar → Dibayar → Dihantar**.
- Attendance counter: **"{n}/{max} PELATIH"**; weekday **ISNIN** etc.; time badge **8:00pm**.
- Dashboard metric labels: **"Jumlah Tertunggak"**, **"Ahli Aktif"**, **"Bil Tertunggak"**;
  weekly sales rows **"RM …"** in green (`color.success`).
- Ranked bar subtitle: **"Top 10 Ahli Tertunggak"**.
- Malay weekday abbrs: `AHD ISN SEL RAB KHA JUM SAB`.

## Accepted inputs (scene 3/4) — `ALLOWED_MIME`, exact
image (jpg/png/webp) · **application/pdf** · audio (ogg/mp3/m4a/wav) · video (mp4/mov).
Plus text. **No .xlsx / .csv** — so the trainee roster in scene 4 is shown as a **PDF**
export of a member table, not a live Excel file. The admin agent OCR-reads a document
and batches `register_member` across many rows in one turn (with a confirmation step)
— that's the real basis for the "import roster from a PDF" beat.

## Two AI surfaces (do not conflate)
- **Admin AI = "Pengurus Akademi"** (`mybola_chat_agent`): owner types plain Malay,
  it reads academy data and *acts* (issue bills, mark attendance, register, `/undo`).
  Speaks Malay, matches user style, money always `RM x.xx`, ends with one follow-up.
- **Customer WhatsApp AI = concierge** (`mybola_inbox_agent`): auto-replies to
  customers as "pasukan {academy}"; never calls itself AI/bot. Owner flips
  **Auto-balas** off to reply as "Anda".

## Reconstruction rule
AI replies are runtime-generated (Gemini), not canned. On-screen AI lines that
aren't in the verbatim list above are rule-faithful reconstructions built strictly
from the prompt rules + the canonical patterns. Never invent product facts (prices,
member names beyond generic examples, features that don't exist).

## Audio / mix targets
Calm warm bed (felt piano + soft synth pad), one payoff at the dashboard→end-card
turn. Bed low, generous headroom — target ~ −21 dB integrated (per craft). SFX (soft
taps on send/switch) on-frame, peaking above the bed in their windows.
