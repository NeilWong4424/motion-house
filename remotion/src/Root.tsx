import React from "react";
import { AbsoluteFill, Composition } from "remotion";
import { allVideos } from "./shared/engine/registry";

// Renders every registered VideoDef as a Remotion <Composition>. The engine
// ships with an EMPTY registry — a consumer calls registerVideos(...) at startup
// (e.g. in an entry that imports its own videos) before the studio/render runs.
// This file never changes.

// Placeholder shown when nothing is registered yet, so the studio/CLI always
// boots (Remotion errors on zero compositions). A real consumer's videos replace
// it the moment they register.
const Placeholder: React.FC = () => (
  <AbsoluteFill
    style={{
      background: "#0b0b0c",
      color: "#e8e8ea",
      fontFamily: "sans-serif",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 40,
      letterSpacing: "0.02em",
    }}
  >
    Empty engine — registerVideos() to add a video
  </AbsoluteFill>
);

export const RemotionRoot: React.FC = () => (
  <>
    {allVideos.length === 0 && (
      <Composition
        id="EmptyEngine"
        component={Placeholder}
        durationInFrames={90}
        fps={30}
        width={1920}
        height={1080}
      />
    )}
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
