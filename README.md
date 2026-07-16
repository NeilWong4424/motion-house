# Project-4 Product Video

MyBola launch video, built as code (Remotion). Migrated from Claude Cowork for
local development with VS Code + Claude Code.

## Contents

- `remotion/` — the video project (source, fonts, audio synth script, CLAUDE.md)
- `renders/` — delivered cuts (v5, v6, v7; v7 is current)

## Setup (once)

1. Install Node.js 20+ (nodejs.org) and ffmpeg (winget install ffmpeg)
2. Install Claude Code: `npm install -g @anthropic-ai/claude-code`
3. Open this folder in VS Code (recommended extensions will be suggested)
4. `cd remotion && npm install`

## Daily workflow

- `npm run studio` — opens Remotion Studio in the browser: scrub the timeline,
  changes hot-reload as Claude Code edits the source
- In another terminal: `claude` — direct changes conversationally; CLAUDE.md
  gives it the full project context, design rules, and backlog
- `npm run render` — final MP4 to `remotion/out/`
- Audio: `python remotion/make_audio.py` then mix (command in CLAUDE.md)

## Rules that matter (Claude Code reads these from remotion/CLAUDE.md)

- Two layers: cream serif narration outside the phone, real dark UI inside
- The phone never moves; only the camera zooms
- Every UI element must match the Flutter app source exactly — no invented cards
- All copy in Bahasa Malaysia
