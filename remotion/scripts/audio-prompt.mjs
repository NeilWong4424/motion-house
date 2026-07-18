// Emit a music-generation prompt from a video's audio brief.
//
//   node scripts/audio-prompt.mjs <brief-module.ts>            # print to stdout
//   node scripts/audio-prompt.mjs <brief-module.ts> --out p.md # write to a file
//   node scripts/audio-prompt.mjs <brief.json>                 # JSON brief input
//
// The engine is a pure library: this CLI does NOT know about products or a
// registry. You point it at a source of a VideoDef (or a bare AudioBrief +
// duration) and it runs the shared prompt engine (src/shared/engine/audio-prompt.ts).
//
// A .ts/.tsx module must default-export, or export `video`/`videoDef`, a VideoDef;
// a .json file is read as either a full VideoDef or { durationInFrames, fps, id,
// audio } shape. The prompt is fed to a 3rd-party AI music generator; the returned
// track is aligned separately (see the engine's ALIGNMENT PLAN output).
//
// TS is bundled on the fly with esbuild (already a Remotion dep) so there's no
// build step and the TS engine stays the single source of truth.
import { build } from "esbuild";
import {
  mkdtempSync,
  writeFileSync,
  rmSync,
  readFileSync,
  existsSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve, extname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const ENGINE = join(ROOT, "src/shared/engine/audio-prompt.ts");

const args = process.argv.slice(2);
const outIdx = args.indexOf("--out");
const outPath = outIdx >= 0 ? args[outIdx + 1] : null;
// the positional source arg: not a flag, and not the value consumed by --out
const src = args.find((a, i) => !a.startsWith("--") && i !== (outIdx >= 0 ? outIdx + 1 : -1));

if (!src) {
  console.error(
    "usage: node scripts/audio-prompt.mjs <brief.ts|brief.json> [--out PROMPT.md]",
  );
  process.exit(2);
}
const srcPath = resolve(src);
if (!existsSync(srcPath)) {
  console.error(`no such file: ${srcPath}`);
  process.exit(1);
}

const prompt = await run(srcPath);
if (outPath) {
  writeFileSync(resolve(outPath), prompt);
  console.error(`wrote ${resolve(outPath)}`);
} else {
  process.stdout.write(prompt);
}

// ---------------------------------------------------------------------------
async function run(file) {
  if (extname(file) === ".json") {
    const video = normalizeJson(JSON.parse(readFileSync(file, "utf8")));
    return await bundleAndBuild(inlineEntry(video));
  }
  // A TS/TSX module exporting a VideoDef (default, or `video`/`videoDef`).
  return await bundleAndBuild(moduleEntry(file));
}

// A VideoDef needs a React component; the engine never touches it, so a JSON
// brief supplies a stub so the type is satisfied at runtime.
function normalizeJson(o) {
  const v = o.audio ? o : { audio: o.brief ?? o }; // allow bare brief or {audio}
  return {
    id: o.id ?? "Untitled",
    durationInFrames: o.durationInFrames ?? o.frames ?? mustHave(o, "durationInFrames"),
    fps: o.fps ?? 30,
    audio: v.audio,
  };
}
function mustHave(o, k) {
  console.error(`JSON brief is missing "${k}"`);
  process.exit(1);
}

function inlineEntry(video) {
  return `
import { buildPrompt } from ${JSON.stringify(rel(ENGINE))};
const video = ${JSON.stringify(video)};
export const prompt = buildPrompt(video);
`;
}

function moduleEntry(file) {
  return `
import { buildPrompt } from ${JSON.stringify(rel(ENGINE))};
import * as mod from ${JSON.stringify(rel(file))};
const video = mod.default ?? mod.video ?? mod.videoDef;
if (!video) { console.error("module must export a VideoDef (default, or 'video'/'videoDef')"); process.exit(1); }
export const prompt = buildPrompt(video);
`;
}

// esbuild import specifiers are resolved against ROOT; use POSIX-relative paths
// (not file:// URLs — esbuild won't resolve those when the path contains spaces).
function rel(abs) {
  const r = abs.startsWith(ROOT) ? "./" + abs.slice(ROOT.length + 1) : abs;
  return r.split("\\").join("/");
}

async function bundleAndBuild(entry) {
  const tmp = mkdtempSync(join(tmpdir(), "audio-prompt-"));
  const outfile = join(tmp, "bundle.mjs");
  try {
    await build({
      stdin: { contents: entry, resolveDir: ROOT, loader: "ts" },
      bundle: true,
      format: "esm",
      platform: "node",
      outfile,
      jsx: "automatic",
      logLevel: "silent",
      // The engine is pure; a VideoDef's component may import React/Remotion — mark
      // them external so we don't drag the renderer into a data-only bundle.
      external: ["react", "react/jsx-runtime", "remotion", "@remotion/*"],
    });
    const mod = await import(pathToFileURL(outfile).href);
    return mod.prompt;
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
}
