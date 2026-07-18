import type { VideoDef } from "../../shared/engine/types";
import { worldcupHypeVideo } from "./videos/hype";

// worldcup2026hype — the broadcast-energy answer to the 2026 World Cup, its own
// product. Add a cut by creating videos/<name>.tsx that exports a VideoDef, then
// listing it here.
export const videos: VideoDef[] = [worldcupHypeVideo];
