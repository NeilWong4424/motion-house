import React from "react";

// One renderable video. Products publish these; the registry turns each into a
// Remotion <Composition>. `id` is the composition id used by render/still commands.
export type VideoDef = {
  id: string;
  component: React.FC;
  durationInFrames: number;
  fps?: number;
  width?: number;
  height?: number;
};

// Portrait 1080x1920 @30fps — the house default for social/Reels cuts.
export const PORTRAIT = { fps: 30, width: 1080, height: 1920 } as const;

export const defineVideo = (v: VideoDef): Required<VideoDef> => ({
  ...PORTRAIT,
  ...v,
}) as Required<VideoDef>;
