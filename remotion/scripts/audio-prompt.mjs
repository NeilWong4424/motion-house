// Emit a music-generation prompt for a composition id.
//
//   npm run audio:prompt <CompositionId> [-- --write]
//
// Reads the video's declarative `audio` brief from the registry and runs the
// shared prompt engine (src/shared/engine/audio-prompt.ts). Prints the prompt to
// stdout; with --write, saves it to that product's audio/PROMPT.md.
//
// We do NOT synthesize audio locally. This prompt is fed to a 3rd-party AI music
// generator (ElevenLabs / DaVinci / Suno / Udio); the returned track is aligned
// onto the cut by the product's make_audio.py --align.
//
// TS is bundled on the fly with esbuild (already a Remotion dep) so there's no
// build step and the TS engine stays the single source of truth.
import { build } from "esbuild";
import {
  mkdtempSync,
  writeFileSync,
  mkdirSync,
  rmSync,
  readdirSync,
  readFileSync,
  statSync,
  existsSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const args = process.argv.slice(2);
const write = args.includes("--write");
const id = args.find((a) => !a.startsWith("--"));

if (!id) {
  console.error("usage: npm run audio:prompt <CompositionId> [-- --write]");
  process.exit(2);
}

// Entry that pulls the registry + engine and resolves the requested video.
// Import specifiers are relative to resolveDir (ROOT) — not file:// URLs, which
// esbuild won't resolve when the path contains spaces.
const entry = `
import { allVideos } from "./src/shared/engine/registry.ts";
import { buildPrompt } from "./src/shared/engine/audio-prompt.ts";
const id = ${JSON.stringify(id)};
const v = allVideos.find((x) => x.id === id);
if (!v) { console.error("no composition with id " + id + "; known: " + allVideos.map(x=>x.id).join(", ")); process.exit(1); }
if (!v.audio) { console.error("composition " + id + " has no audio brief (silent/SFX-only cut)"); process.exit(1); }
export const prompt = buildPrompt(v);
`;

const tmp = mkdtempSync(join(tmpdir(), "audio-prompt-"));
const outfile = join(tmp, "bundle.mjs");
try {
  await build({
    stdin: { contents: entry, resolveDir: ROOT, loader: "ts" },
    bundle: true,
    format: "esm",
    platform: "node",
    outfile,
    // React/Remotion get imported transitively by the video components; we only
    // read data, so stub the heavy render-time deps to keep the bundle cheap.
    jsx: "automatic",
    logLevel: "silent",
  });
  const mod = await import(pathToFileURL(outfile).href);
  const prompt = mod.prompt;

  if (write) {
    // Product dir is derived from the id's product folder convention:
    // src/products/<slug>/audio/PROMPT.md. We locate it by scanning products.
    const dir = findProductAudioDir(id);
    mkdirSync(dir, { recursive: true });
    const dest = join(dir, "PROMPT.md");
    writeFileSync(dest, prompt);
    console.error(`wrote ${dest}`);
  } else {
    process.stdout.write(prompt);
  }
} finally {
  rmSync(tmp, { recursive: true, force: true });
}

// Find which product owns this composition id, returning its audio/ dir.
function findProductAudioDir(compId) {
  const productsDir = join(ROOT, "src/products");
  for (const p of readdirSync(productsDir)) {
    const dir = join(productsDir, p);
    if (!statSync(dir).isDirectory()) continue;
    // cheap check: does any file under this product declare the id?
    if (grepDir(dir, compId)) return join(dir, "audio");
  }
  throw new Error(`could not locate product owning composition ${compId}`);
}

function grepDir(dir, needle) {
  for (const e of readdirSync(dir)) {
    const full = join(dir, e);
    if (statSync(full).isDirectory()) {
      if (grepDir(full, needle)) return true;
    } else if (/\.(ts|tsx)$/.test(e)) {
      if (readFileSync(full, "utf8").includes(`"${needle}"`)) return true;
    }
  }
  return false;
}
