import { registerRoot } from "remotion";
import { registerVideos } from "./shared/engine/registry";
import { videos as mybola } from "./products/mybola";
import { RemotionRoot } from "./Root";

// Register product videos before the root reads the registry.
registerVideos(mybola);

registerRoot(RemotionRoot);
