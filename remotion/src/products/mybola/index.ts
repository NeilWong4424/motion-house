import type { VideoDef } from "../../shared/engine/types";
import { mybolaParent } from "./videos/parentOnboarding";
import { mybolaV8 } from "./videos/launchV8";
import { mybolaV4 } from "./videos/launchV4";

// Every MyBola video. Add a new cut by creating videos/<name>.tsx that exports a
// VideoDef, then listing it here — the shared registry picks it up automatically.
export const videos: VideoDef[] = [mybolaParent, mybolaV8, mybolaV4];
