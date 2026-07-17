import { defineVideo } from "../../../shared/engine/types";
import { LaunchVideo, TOTAL_FRAMES } from "../../../legacy/LaunchVideo";

// v3 — the original cut. Superseded by launchV4 (v7) but kept renderable.
// It still runs on the legacy cream theme + components pair under src/legacy/,
// which predate the shared/ primitives; left as-is rather than ported.
export const mybolaLaunch = defineVideo({
  id: "MyBolaLaunch",
  component: LaunchVideo,
  durationInFrames: TOTAL_FRAMES,
});
