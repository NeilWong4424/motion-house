import { videos as mybola } from "../../products/mybola";
import type { VideoDef } from "./types";

// Every renderable video in this repo. Add a product by importing its `videos`
// array here — Root.tsx turns each entry into a Remotion <Composition>, so no
// other file needs to change.
export const allVideos: VideoDef[] = [...mybola];
