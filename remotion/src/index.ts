import { registerRoot } from "remotion";
import { registerVideos } from "./shared/engine/registry";
import { videos as mybola } from "./products/mybola";
import { videos as mybolaV2 } from "./products/mybola-v2";
import { videos as claudeDispatch } from "./products/claude-dispatch";
import { RemotionRoot } from "./Root";

// Register product videos before the root reads the registry. Each product is
// standalone — v2 is a separate package and does not touch v1.
registerVideos(mybola);
registerVideos(mybolaV2);
registerVideos(claudeDispatch);

registerRoot(RemotionRoot);
