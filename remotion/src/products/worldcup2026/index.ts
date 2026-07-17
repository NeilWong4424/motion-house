import type { VideoDef } from "../../shared/engine/types";
import { worldcupFormat } from "./videos/format";

// Every World Cup 2026 video. Add a cut by creating videos/<name>.tsx that
// exports a VideoDef, then listing it here.
export const videos: VideoDef[] = [worldcupFormat];
