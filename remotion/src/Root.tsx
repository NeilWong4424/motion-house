import React from "react";
import { Composition } from "remotion";
import { allVideos } from "./shared/engine/registry";

// Every video in the repo, registered from the shared registry. To add one,
// export a VideoDef from a product's videos/ folder and list it in that
// product's index.ts — this file never needs to change.
export const RemotionRoot: React.FC = () => (
  <>
    {allVideos.map((v) => (
      <Composition
        key={v.id}
        id={v.id}
        component={v.component}
        durationInFrames={v.durationInFrames}
        fps={v.fps ?? 30}
        width={v.width ?? 1080}
        height={v.height ?? 1920}
      />
    ))}
  </>
);
