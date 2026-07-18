# MyBola launch film — plan

## Context

MyBola (*"Akademi Anda, Cara Anda"* — a Malaysian sports-**academy** app, Flutter +
FastAPI) is entering **closed testing** and the owner wants a short **portrait
launch film** to take it to market. It must match the **Claude product-launch
style** (warm minimalism, prose-like pacing, the product doing real work on screen,
phone-in-hand + desktop framing) but rebuilt entirely in **MyBola's own brand and
language** — no Claude footage. The film's one message: **what it feels like to run
your academy through MyBola** — an owner's day, handled from the phone, in
**Bahasa Melayu**.

**Scope: academy business type ONLY.** No Fasiliti / facility-operator / tempahan
(booking) scene — those belong to the operator business type, which this film does
not cover. Every beat stays inside the academy world: members, sessions,
attendance, bills/fees, the shop, the admin AI, and the WhatsApp inbox.

The supplied `Recording 2026-07-17 073006.mp4` is the Claude reference film, used
for **style/rhythm only** (measured: ~1 framing / 4.5s, quiet mix ~−37 dB mean →
calm register). It does not appear in the cut.

### Key research findings that constrain the build
- **HARD RULE — every MyBola screen is replicated 1:1 from the real Flutter source.**
  Not "close" or "inspired by": the recreated widgets must match the actual source
  in geometry, spacing, radii, colour, and type scale, read straight from the files
  named in the research (e.g. `chat_content.dart`, `chat_omnibar/*.dart`,
  `inbox_thread_pane.dart`, `session_card.dart`, `*_chart.dart`, `app_theme.dart`).
  For scene 5 the customer-facing view replicates the **real WhatsApp app UI** 1:1
  (WhatsApp's own colours/layout), and the MyBola-side cut replicates
  `inbox_thread_pane.dart` 1:1. Any element that can't be traced to a source file
  does not go on screen. Verified by opening each source file while building the
  matching prop and diffing values, and by the frame-by-frame audit in step 5.
- **Two brand systems exist.** Decision (user): use the **app** tokens as source of
  truth (`core/app_theme.dart`), not the marketing site.
  - bg `#000000`, primary `#0091FF`, success `#30D158`, warning `#FF9230`,
    error `#FF4245`, info `#3CD3FE`, surface `#1C1C1E`, border `#1A1A1A`,
    tertiary `0x55FFFFFF` (dim). **Flat — no shadows** (house rule).
  - Type scale (Axiforma in-app): heading 20/w600, title 17/w500, body 16/w400,
    label 15/w500, hint 16/w400 dim, meta 13/w500 dim; cardText: displayHero
    52/w300, display 28/w600, title 20/w700.
- **Font licensing gap.** Axiforma has no woff2 in `remotion/public/fonts/`.
  Decision (user): **closest licensed match** — Inter for UI/body, a display face
  (Anton) for headlines. State the substitution in the director's statement.
- **Two distinct AI surfaces — both belong in the film:**
  - **Admin AI chat ("Pengurus Akademi")** — `mybola_chat_agent`, the owner-facing
    assistant inside the app. The owner types plain Malay commands; the agent reads
    academy data and *does the work* (issue bills, mark attendance, register
    members, `/undo`). Speaks Malay, matches the user's style, money always
    `RM x.xx`, ends every reply with exactly one natural follow-up. This is the
    beat the user explicitly asked to include (owner ↔ Pengurus Akademi AI).
  - **Customer WhatsApp AI (concierge)** — `mybola_inbox_agent`, auto-replies to
    customers on WhatsApp as "pasukan {academy}"; owner can flip **Auto-balas** off
    and reply as "Anda".
- **AI replies are runtime-generated, not canned.** On-screen copy must be built
  from the prompt *rules* + the few verbatim strings, never invented product facts.
  Quote-safe verbatim strings (use as-is):
  - Chat omnibar placeholder: **"Semua urusan bermula di sini..."**;
    processing: **"Pengurus sedang memproses permintaan anda"**.
  - Real admin command templates (`root_instruction.py`), e.g. owner types
    *"siapa belum bayar?"* → agent runs `/overdue`; *"kemaskini bil Ahmad bulan
    lepas"*; `/start` → grounded suggestions card (verbatim example line:
    *"4 bills overdue totalling RM320"*, *"No sessions next week"*). Billing
    statuses: **Belum Bayar → Dibayar → Dihantar**.
  - Real quick tips (`chat_tips.dart`), e.g. *"Tanya bahasa biasa: 'siapa belum
    bayar?'"*, *"Snap resit atau IC — saya baca terus…"*.
  - Inbox: **"Auto-balas"** switch, thread channel label **"WhatsApp"** (brand
    `#25D366`), reply placeholder **"Taip balasan…"**, bubble captions
    **"Pelanggan · h:mm"** / **"Pengurus Akademi · h:mm"** / **"Anda"**.
  - Concierge reply pattern (canonical test string): *"…RM150.00. Boleh bayar
    melalui pautan ini."*; payment link form `https://mybola-admin.com/payment/<id>`.
  - Receipt caption (auto-posted after real payment, PDF attached
    `resit-<invoice>.pdf`): **"Terima kasih! Pembayaran RM… anda telah diterima."**
    (drop the emoji — QC bans it in comps; render as text only).
  - Booking slot badges: **TERSEDIA** (green), **PENUH** (red), **TEMPAH
    SEKARANG** (primary); checkout **"Bayar RM…"**. Malay weekday abbrs
    `AHD ISN SEL RAB KHA JUM SAB`.
  - Dashboard metric labels (verbatim): **"Jumlah Tertunggak"**, **"Ahli Aktif"**,
    **"Bil Tertunggak"**, weekly sales **"RM …"** in green.
- **WhatsApp inbox is a real feature** (Meta channels; per-conversation
  `ai_enabled` = "Auto-balas"). AI speaks as "pasukan {academy}", labeled
  "Pengurus Akademi"; owner can flip Auto-balas off and reply as "Anda". This is
  the emotional core of the film.

## The video, screen by screen (the human draft)

*Read this to picture the finished film before any code. It's a ~58-second portrait
(9:16) film for phones, in Bahasa Melayu, no voiceover — just clean on-screen words
and a calm, warm music bed. The whole thing feels like a Claude launch film: black
canvas, one big idea at a time, lots of stillness, the app quietly doing real work.
Deep black background (`#000000`), one electric blue accent (`#0091FF`), small warm
"iOS" greens/oranges only where the app itself uses them. A single phone sits in the
centre; it never jumps around — the "camera" gently settles on it and holds while
things happen inside the screen.*

**Scene 1 — Cold open · "dari poket anda" (0–4s)**
Pure black. One line of big, confident type fades up and holds, centred:
> **Uruskan akademi anda — dari poket anda.**
Nothing else moves. It's the promise, stated plainly, the way Apple opens. Music
breathes in underneath. Cut.

**Scene 2 — Talking to your academy manager (the AI) (4–13s)** *(the beat you asked for)*
The phone appears, showing the MyBola admin screen — black UI, a glass "omnibar" at
the bottom with the real hint text **"Semua urusan bermula di sini..."**. We watch
the owner type, in plain Malay: **"siapa belum bayar?"**. The bar shows **"Pengurus
sedang memproses…"** with the little animated dots. Then the reply arrives in a
soft-blue bubble from **Pengurus Akademi** — a short list of overdue members with
**RM** amounts, ending with one friendly follow-up. A second command follows
(*"kemaskini bil Ahmad bulan lepas"*) and we see the bill actually change — the
point landing: *you talk to it like a person, it does the admin for you.* Feel:
calm, effortless, a little magical.

**Scene 3 — Send it anything (13–18s)**
Quick, clean beat. Around the chat bar, five small labelled icons arrive one after
another on a gentle stagger — the **exact** input kinds the app really accepts:
**teks · audio · video · gambar · PDF**. One line of type: **"Hantar apa sahaja."**
It reads as "this thing understands whatever you throw at it." (These five map 1:1
to the app's real `ALLOWED_MIME` set: image, PDF, audio, video — plus text.)

**Scene 4 — Import your whole roster from one PDF (18–24s)** *(payoff of scene 3)*
The owner drops a **PDF list of trainee members** into the chat — a spreadsheet-style
roster (name / IC / age rows, like an exported member list). The AI OCR-reads it and,
in one turn, **registers every trainee at once**: rows tick in as members with a
short confirmation summary ("Daftar 12 pelatih?" → done). This is the real product
behavior — the chat accepts PDF natively and the agent batches `register_member`
across many rows in a single turn (with the confirmation step). The feeling: *what
used to be an afternoon of data entry is one dropped file.* (Note: the app accepts
**PDF**, not live .xlsx/.csv — so the roster is shown as a PDF export of a member
table, which is truthful; no fake Excel-file upload.)

**Scene 5 — WhatsApp: the whole customer handled for you (23–39s)** *(the heart of the film)*
A soft transition (a brief dip to black) marks the chapter change. Now the phone
shows a **real WhatsApp chat** — replicated 1:1 from the actual WhatsApp app, from
the *customer's* side: the WhatsApp dark-chat look (doodle wallpaper, the green top
bar with contact name + avatar + call/video icons, incoming bubbles left in dark
grey, the customer's own bubbles right in WhatsApp green `#005C4B` with tick
receipts, the rounded input bar with the mic). This is what the customer sees when
they message the academy. We watch a real customer journey, all answered
automatically by the academy (the MyBola AI, but to the customer it's just the
academy replying instantly): a general question → *"Assalamualaikum, ada kelas
bola?"*, then the next session time, then signing the child up, then a **payment
link** (`mybola-admin.com/payment/…`), and finally a **PDF document bubble** in the
WhatsApp style (`resit-…pdf`) with the caption **"Terima kasih! Pembayaran RM…
anda telah diterima."**

Then the reveal of *how*: a quick cut to the **MyBola side** — the app's own Inbox
thread (replicated 1:1 from `inbox_thread_pane.dart`: contact over the green
WhatsApp glyph + label, the **"Auto-balas"** switch ON). The owner flips **Auto-balas
OFF** (the CupertinoSwitch animates from blue to grey), types one warm personal line
in **"Taip balasan…"**, and it sends — appearing back on the WhatsApp side as a
normal reply. The story of the film in two screens: *the AI carries the load in real
WhatsApp; you step in from MyBola when it matters.*

**Scene 6 — Answers in your customer's language (39–44s)**
Still on the WhatsApp idea. One line: **"Balas dalam bahasa pelanggan."** Beneath
it, a few short customer greetings appear in different scripts on a stagger — Malay,
English, Chinese, Tamil — each getting a natural reply. No "supported languages"
list (the app doesn't have one); it simply *answers people however they wrote*.

**Scene 7 — Sessions & attendance (44–49s)**
The academy's daily rhythm. A **session card** slides in — a big day number, the
weekday (**ISNIN**), a time badge (**8:00pm**), location. Then an attendance list:
member rows tick over to **green checkmarks** one by one (the app's signature
corner-rounding animation), with the counter reading **"12/15 PELATIH"**. Feel:
organised, in control.

**Scene 8 — The payoff: your academy at a glance (49–53s)**
The dashboard. A number counts down — **"Jumlah Tertunggak"** dropping as bills get
paid — and a **RM** weekly-sales figure ticks up in green. A small ranked bar chart
(**"Top 10 Ahli Tertunggak"**) draws in. This is the "running your business feels
good" moment — the reward for everything the app just did.

**Scene 9 — End card & the ask (53–58s)**
Back to black. The **MyBola** logo resolves, with the tagline **"Akademi Anda, Cara
Anda."** Then the call to action in the accent blue: **"Mohon Akses Awal"**, and a
small quiet line noting it's currently in **closed testing**. Music lands its final
note. End.

**Overall feel & design notes (for a human):** restrained and premium, not busy —
most of every second is stillness, with one clear thing to look at. Big type, one
weight, one blue accent used sparingly. Everything on screen is *the real MyBola* —
real screens, real Malay wording, real RM figures — so it reads as a genuine product,
not a mockup. The through-line the viewer should feel: *"I could run my whole academy
from this phone, and it would mostly run itself."*

## Reference / reuse (do not reinvent)
- Engine craft bar: `remotion/craft/motion-craft.md` + genre chapters
  `kinetic-type.md`, `delivery.md` (portrait safe areas), `sound-design.md`.
- Motion toolkit (`remotion/src/shared/motion/`): `reveal.tsx` (Rise, Stagger,
  TextReveal, MaskWipe, CountUp), `transitions.tsx` (FadeIn, DipTo, Push),
  `shot.tsx` (Camera/Shot — subject mounted once, camera moves), `type-kinetic.tsx`,
  `data.tsx` (Bar/Ring/LineChart for the dashboard beat), `logo.tsx` (Resolve).
- Engine types: `defineVideo` + `PORTRAIT` preset, `AudioBrief` — all in
  `shared/engine/types.ts`. Register via `shared/engine/registry.ts`.
- Design language shape: `shared/design/types.ts` (Palette by role, MotionProfile).

## Approach

Add a **new product** `remotion/src/products/mybola/` (engine untouched), then one
portrait `VideoDef`. Recreate MyBola UI **code-exact** from the real tokens above
as reusable prop components — the phone is mounted **once** above the scenes
(craft: subject never moves, camera does).

### Files to create
```
remotion/src/products/mybola/
  design.ts        DesignLanguage from app tokens (palette by role, Inter+Anton,
                   motion profile: enter "settle", ease easeOutQuart, stagger 3,
                   hold ~16 — the calm Claude register).
  NOTES.md         Brand rules, verbatim copy bank, code-exact UI targets, the
                   reference measurements, mix targets, font-substitution note.
  ui/              Code-exact MyBola chrome (prop components, read design.ts only):
    PhoneFrame.tsx     black device frame; subject mounted once.
    ChatOmnibar.tsx    glass bar + placeholder "Semua urusan bermula di sini..."
    ChatBubble.tsx     radius-morph 12/4 bubbles; primary@20% (incoming) /
                       secondary (outgoing); meta caption line.
    InboxThread.tsx    MyBola Inbox thread, 1:1 from inbox_thread_pane.dart: header
                       (contact + green WhatsApp glyph + label + "Auto-balas"
                       CupertinoSwitch + reset), shared bubbles, "Taip balasan…"
                       omnibar. Used for the "flip Auto-balas / reply as Anda" cut.
    WhatsAppChat.tsx   the REAL WhatsApp app UI, replicated 1:1: green top bar
                       (avatar, name, call/video/menu icons), doodle chat wallpaper,
                       incoming grey bubbles (left) + outgoing green #005C4B bubbles
                       (right) with tick receipts + timestamps, PDF/doc bubble tile,
                       rounded input bar with mic. The customer-facing scene 5 view.
    PdfRoster.tsx      spreadsheet-style trainee-member roster rendered as a PDF
                       document tile (name / IC / age rows) — the file dropped into
                       chat in scene 4.
    SessionCard.tsx    displayHero day number + weekday + time badge + detail strip.
    Attendance.tsx     session sheet: member rows, green check on attended
                       (radius-morph 4->16), "{n}/{max} PELATIH".
    Dashboard.tsx      MetricList + RankedBarChart/LineChart (reuse shared/data),
                       1:1 from *_chart.dart primitives.
    InputTypes.tsx     row of the 5 real accepted inputs (text/audio/video/image/
                       PDF, = ALLOWED_MIME) as labeled glyphs; feeds scene 4.
    Languages.tsx      "Balas dalam bahasa pelanggan" + example greetings in a few
                       scripts (Melayu / English / others) — no fixed-list claim.
  videos/
    launch.tsx       the film; composes ui/ + shared/motion; scene table in frames.
  index.ts         exports videos: [ ... ] for the registry.
```
### One-line engine edit
- `remotion/src/shared/engine/registry.ts` — import `mybola` videos and pass to
  `registerVideos()`. (The only touch outside the product.)

### The cut — PORTRAIT 9:16, 30fps, ~58s (~1740 frames)
One held framing per beat, ~5–7s each, hard cuts on the beat; `DipTo` only at the
one chapter break (into the WhatsApp core); calm easing throughout. Live content
inside a locked phone (phone mounted once, camera moves — never the prop). All copy
Bahasa Melayu. Academy world only — no Fasiliti.

Beat table (times = the human storyboard above; the storyboard is the single source
of truth for content — this table is the frame/component/transition map):

| # | Beat | Time | Component(s) | In-transition |
|---|---|---|---|---|
| 1 | Cold open — *"dari poket anda"* | 0–4s | type only | fade up |
| 2 | Owner ↔ **Pengurus Akademi** admin AI | 4–13s | PhoneFrame + ChatOmnibar + ChatBubble | cut |
| 3 | Any input (5 kinds = ALLOWED_MIME) | 13–18s | InputTypes | cut |
| 4 | Import roster from a **PDF** (bulk register) | 18–24s | ChatBubble + PdfRoster | cut |
| 5 | **WhatsApp core** (real WA UI) + Auto-balas → "Anda" | 24–39s | WhatsAppChat, then InboxThread | **DipTo** |
| 6 | *"Balas dalam bahasa pelanggan"* | 39–44s | Languages | cut |
| 7 | Sesi & kehadiran | 44–49s | SessionCard + Attendance | cut |
| 8 | Dashboard payoff (RM ↓/↑, ranked bars) | 49–53s | Dashboard | cut |
| 9 | End card + CTA *"Mohon Akses Awal"* | 53–58s | logo/Resolve | cut |

(Times are targets; final frame counts get set from the scene table during build and
fed to the audio brief's beats. `DipTo` used once — into the WhatsApp core.)

### Audio
Declare an `AudioBrief` on the VideoDef (calm, warm, felt-piano/soft-synth bed,
one payoff at the dashboard/end-card turn, mix bed low ~−21 dB per craft). Emit the
prompt (`npm run audio:prompt`), generate a track 3rd-party, align payoff, mux.
Text-only narration (user decision) — no VO track.

### Specialist agents (per SKILL.md stages)
- `art-director` — author/validate `design.ts` against app tokens.
- `creative-director` + `motion-lead` — cold review the rendered cut.
- `sound-designer` — write the music-gen prompt + align/mux.

## Verification
1. `cd remotion && npm run qc` — **0 errors** (no emoji/arrows/tofu glyphs; watch
   hardcoded-hex warnings — all colour must come from `design.ts`).
2. `npx remotion compositions src/index.ts` — confirm the new id registers.
3. `npm run render <Id> out/mybola-launch.mp4`.
4. Extract frames at every cut **and mid-reveal** (`ffmpeg -ss <t> -frames:v 1`);
   check against the craft checklist (one focal point, holds after landings, type
   big, accent sparing). Fix, re-render, look again.
5. **1:1 replication audit** — open each real Flutter source file beside the frame
   and diff: colours, radii, spacing, type sizes/weights, and copy must match the
   source (not approximate). WhatsApp scene checked against the real WhatsApp app
   look; MyBola inbox cut checked against `inbox_thread_pane.dart`. Every on-screen
   string traces to a verbatim source in NOTES.md or a rule-faithful reconstruction;
   no invented product facts; the five input kinds match `ALLOWED_MIME` exactly
   (image/PDF/audio/video + text — no .xlsx).
6. Cold review (creative-director + motion-lead), then master per `delivery.md`
   (9:16 safe areas), mux audio, verify loudness.
7. Deliver mp4 path + director's statement (one message, look & references,
   font substitution stated, 2–3 things still to improve).

## Open decisions already made (do not re-ask)
Footage = recreate in-engine, **1:1 with the real Flutter source (hard rule)**;
**scope = academy only (no Fasiliti)**; brand = app tokens; fonts = Inter+Anton
substitute; language = Malay; narration = on-screen text + music; must include the
**owner ↔ Pengurus Akademi admin-AI** beat; a **languages scene** = "AI replies in
the customer's language" (no fixed list); an **inputs scene** = text/audio/video/
image/PDF (= real `ALLOWED_MIME`) as two half-beats: icon row → **import a PDF
trainee roster** (bulk register, OCR — the app accepts PDF natively; NOT live
.xlsx/.csv, so shown as a PDF export); WhatsApp core = **real WhatsApp app UI 1:1**
for the customer view + a cut to the MyBola inbox (`inbox_thread_pane.dart` 1:1) for
the **Auto-balas** flip to "Anda"; full journey (inquiry → sessions → registration →
payment link → PDF receipt); CTA = "Mohon Akses Awal".
