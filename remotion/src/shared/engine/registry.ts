import { videos as mybola } from "../../products/mybola";
import { videos as worldcup2026 } from "../../products/worldcup2026";
import { videos as worldcup2026hype } from "../../products/worldcup2026hype";
import { videos as kitchensink } from "../../products/kitchensink";
import type { VideoDef } from "./types";

// Every renderable video in this repo. Add a product by importing its `videos`
// array here — Root.tsx turns each entry into a Remotion <Composition>, so no
// other file needs to change. (kitchensink is a primitives demo reel, not a
// product — see products/kitchensink.)
export const allVideos: VideoDef[] = [...mybola, ...worldcup2026, ...worldcup2026hype, ...kitchensink];
