import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";
import type { DesignLanguage, FontSpec } from "./types";
import { fontsOf } from "./types";

// =============================================================================
// Font loading — driven by whatever a design language declares.
// =============================================================================
// Remotion renders in headless Chrome with no network, so fonts must be local
// woff2 files under public/fonts/, loaded before the first frame is captured.
// `@remotion/fonts` loadFont() registers the FontFace AND holds the render
// (delayRender/continueRender) until it's ready — without that gate, frames
// render in the fallback face.
//
// Adding a family:
//   1. Find it in node_modules/@fontsource/<family>/files/ (installed:
//      inter, playfair-display, plus-jakarta-sans) — or drop in any woff2.
//      Fontsource names them <family>-latin-<weight>-normal.woff2.
//   2. Copy the weights you need into public/fonts/ with a short name.
//   3. Reference those filenames in the FontSpec's `weights` map.
// Only load weights you actually use — every file blocks the render.

const loaded = new Set<string>();

const keyOf = (spec: FontSpec): string =>
  `${spec.family}:${Object.keys(spec.weights).sort().join(",")}`;

/**
 * Load an explicit set of font specs. Idempotent across a render: each family is
 * loaded once (dedup by family+weights), and later callers reuse the cached
 * faces. loadFont() self-gates the render via delayRender, so no manual handle
 * bookkeeping is needed here.
 */
export const useFontSpecs = (specs: FontSpec[]): void => {
  for (const spec of specs) {
    const key = keyOf(spec);
    if (loaded.has(key)) continue;
    loaded.add(key);
    for (const [weight, file] of Object.entries(spec.weights)) {
      loadFont({
        family: spec.family,
        url: staticFile(`fonts/${file}`),
        weight,
      }).catch((err) => {
        // Surface the failure instead of silently rendering the fallback face,
        // and allow a retry on the next render pass.
        loaded.delete(key);
        throw err;
      });
    }
  }
};

/** Load every font a design language declares. Call once at the top of a video. */
export const useDesignFonts = (design: DesignLanguage): void => {
  useFontSpecs(fontsOf(design));
};
