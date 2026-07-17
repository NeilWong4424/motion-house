// QC gate — enforces the craft rules that used to be prose in CLAUDE.md.
// Run: npm run qc   (exit 1 on any ERROR; warnings don't block)
//
// ERROR   risky Unicode glyphs (emoji, dingbats, arrows) in composition code —
//         headless Chrome renders them as tofu boxes. Use an SVG instead
//         (see WACheck in shared/ui/whatsapp.tsx). Comments are ignored.
// WARNING hardcoded hex colours inside a scene file (products/*/videos/) —
//         scenes should read colour from their design language / brand / theme.
import { readdirSync, readFileSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const SRC = join(fileURLToPath(new URL(".", import.meta.url)), "..", "src");

// Emoji + pictographs, dingbats (✓ ✗ ❤), misc symbols, arrows, VS-16.
const RISKY = /[←-⇿⌀-➿⬀-⯿️\u{1F000}-\u{1FAFF}]/u;
const HEX = /#[0-9a-fA-F]{3,8}\b/g;

const walk = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = join(dir, e.name);
    if (e.isDirectory()) return walk(p);
    return /\.(ts|tsx)$/.test(e.name) ? [p] : [];
  });

// Strip // and /* */ comments so glyphs in prose comments don't trip the gate.
// Naive (doesn't parse strings), which errs toward false negatives on lines
// containing "//" — acceptable for a lint this small.
const stripComments = (line, state) => {
  let out = "";
  let i = 0;
  while (i < line.length) {
    if (state.block) {
      const end = line.indexOf("*/", i);
      if (end === -1) return out;
      state.block = false;
      i = end + 2;
    } else if (line.startsWith("/*", i)) {
      state.block = true;
      i += 2;
    } else if (line.startsWith("//", i)) {
      return out;
    } else {
      out += line[i++];
    }
  }
  return out;
};

const errors = [];
const warnings = [];

for (const file of walk(SRC)) {
  const rel = relative(join(SRC, ".."), file).split(sep).join("/");
  const lines = readFileSync(file, "utf8").split("\n");
  const state = { block: false };
  const isScene = /\/videos\/[^/]+\.tsx$/.test("/" + rel);
  lines.forEach((raw, idx) => {
    const code = stripComments(raw, state);
    const glyph = code.match(RISKY);
    if (glyph) {
      errors.push(
        `${rel}:${idx + 1}  risky glyph "${glyph[0]}" (U+${glyph[0].codePointAt(0).toString(16).toUpperCase()}) — renders as tofu in headless Chrome; use an SVG`,
      );
    }
    if (isScene) {
      for (const m of code.match(HEX) ?? []) {
        // Pure white/black are icon-fill neutrals, not brand colours.
        if (/^#(f{3}|f{6}|0{3}|0{6})$/i.test(m)) continue;
        warnings.push(`${rel}:${idx + 1}  hardcoded ${m} in a scene — read it from the design language instead`);
      }
    }
  });
}

for (const w of warnings) console.log(`WARN   ${w}`);
for (const e of errors) console.log(`ERROR  ${e}`);
console.log(
  `\nqc: ${errors.length} error(s), ${warnings.length} warning(s) across src/`,
);
process.exit(errors.length ? 1 : 0);
