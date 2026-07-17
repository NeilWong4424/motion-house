import { useState } from "react";
import { continueRender, delayRender, staticFile } from "remotion";
import type { DesignLanguage, FontSpec } from "./types";
import { fontsOf } from "./types";

// =============================================================================
// Font loading — driven by whatever a design language declares.
// =============================================================================
// Remotion renders in headless Chrome with no network, so fonts must be local
// woff2 files under public/fonts/, loaded via FontFace before the first frame is
// captured. delayRender holds the render until they're ready; without it, frames
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

const loadSpecs = async (specs: FontSpec[]): Promise<void> => {
  await Promise.all(
    specs.flatMap((spec) =>
      Object.entries(spec.weights).map(async ([weight, file]) => {
        const face = new FontFace(spec.family, `url(${staticFile(`fonts/${file}`)})`, { weight });
        document.fonts.add(await face.load());
      })
    )
  );
};

/**
 * Load an explicit set of font specs. Idempotent across a render: each family is
 * fetched once, and later callers reuse the cached faces.
 */
export const useFontSpecs = (specs: FontSpec[]): void => {
  const pending = specs.filter((s) => !loaded.has(keyOf(s)));
  const [handle] = useState(() => (pending.length ? delayRender(`fonts:${pending.map(keyOf).join("|")}`) : null));
  if (pending.length && handle !== null) {
    pending.forEach((s) => loaded.add(keyOf(s)));
    loadSpecs(pending)
      .then(() => continueRender(handle))
      .catch((err) => {
        // Surface the failure instead of silently rendering the fallback face.
        pending.forEach((s) => loaded.delete(keyOf(s)));
        throw err;
      });
  }
};

/** Load every font a design language declares. Call once at the top of a video. */
export const useDesignFonts = (design: DesignLanguage): void => {
  useFontSpecs(fontsOf(design));
};
