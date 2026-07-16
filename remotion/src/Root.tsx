import React from "react";
import { Composition } from "remotion";
import { LaunchVideo, TOTAL_FRAMES } from "./LaunchVideo";
import { LaunchVideoV4, TOTAL_V4 } from "./LaunchVideoV4";

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="MyBolaLaunch" component={LaunchVideo} durationInFrames={TOTAL_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="MyBolaV4" component={LaunchVideoV4} durationInFrames={TOTAL_V4} fps={30} width={1080} height={1920} />
  </>
);
