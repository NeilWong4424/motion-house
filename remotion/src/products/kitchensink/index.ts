import { defineVideo, LANDSCAPE } from "../../shared/engine/types";
import { KitchenSink } from "./sink";

// Not a product — a demo reel of the shared motion primitives, so each new
// component can be rendered as a still and eyeballed (the craft loop: code
// cannot be judged, only frames). Neutral placeholder palette; nothing here is
// a design language. Kept out of any real product.
export const videos = [
  defineVideo({ id: "KitchenSink", component: KitchenSink, durationInFrames: 240, ...LANDSCAPE }),
];
