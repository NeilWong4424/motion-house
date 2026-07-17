import type { VideoDef } from "../../shared/engine/types";
import { mybolaV4 } from "./videos/launchV4";
import { mybolaLaunch } from "./videos/launchV3";

// Every MyBola video. Add a new cut by creating videos/<name>.tsx that exports a
// VideoDef, then listing it here — the shared registry picks it up automatically.
export const videos: VideoDef[] = [mybolaV4, mybolaLaunch];
