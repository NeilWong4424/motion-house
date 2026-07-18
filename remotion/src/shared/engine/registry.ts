import type { VideoDef } from "./types";

// The engine ships NO videos of its own — it is a pure, product-agnostic library.
// A consumer registers its own `VideoDef`s (from wherever they live) at startup:
//
//   import { registerVideos } from "shared/engine/registry";
//   import { videos as mine } from "./my-videos";
//   registerVideos(mine);
//
// Root.tsx reads `allVideos` to build the Remotion <Composition>s. With nothing
// registered, the studio is simply empty — the engine still builds and runs.
const _videos: VideoDef[] = [];

/** Register videos so they appear in the studio and can be rendered. */
export function registerVideos(...defs: (VideoDef | VideoDef[])[]): void {
  for (const d of defs) {
    if (Array.isArray(d)) _videos.push(...d);
    else _videos.push(d);
  }
}

/** Every registered video. Empty until a consumer calls registerVideos(). */
export const allVideos: VideoDef[] = _videos;

/** Look up a registered video by composition id. */
export function findVideo(id: string): VideoDef | undefined {
  return _videos.find((v) => v.id === id);
}
