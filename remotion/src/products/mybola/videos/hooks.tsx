import React from "react";
import { AbsoluteFill } from "remotion";
import { defineVideo, PORTRAIT } from "../../../shared/engine/types";
import { useDesignFonts } from "../../../shared/design/fonts";
import { mybola, MYBOLA } from "../design";
import { HookBadge, HookBubble, HookProblem, HookPhone } from "../ui/HookOptions";
import { TransitionS1S2 } from "../ui/Transition";
import { Scene1to2, scene1to2Dur } from "../ui/Scene1to2";

// =============================================================================
// Scene-1 hook — 4 options as standalone compositions
// =============================================================================
// Rendered separately so the client can pick a hook treatment. The chosen one is
// slotted into the launch cut (scene 1). Each is a 5s portrait clip on the film's
// dark ground with the fonts loaded.

const DUR = 150; // 5s

const wrap = (Inner: React.FC): React.FC => () => {
  useDesignFonts(mybola);
  return (
    <AbsoluteFill style={{ background: MYBOLA.black }}>
      <Inner />
    </AbsoluteFill>
  );
};

export const hookBadge = defineVideo({ id: "MyBolaHook-badge", component: wrap(HookBadge), durationInFrames: DUR, ...PORTRAIT });
export const hookBubble = defineVideo({ id: "MyBolaHook-bubble", component: wrap(HookBubble), durationInFrames: DUR, ...PORTRAIT });
export const hookProblem = defineVideo({ id: "MyBolaHook-problem", component: wrap(HookProblem), durationInFrames: DUR, ...PORTRAIT });
export const hookPhone = defineVideo({ id: "MyBolaHook-phone", component: wrap(HookPhone), durationInFrames: DUR, ...PORTRAIT });

// The seamless scene1->scene2 morph, as a standalone review clip (~2.7s).
export const transitionS1S2 = defineVideo({ id: "MyBolaTransition-s1s2", component: wrap(TransitionS1S2), durationInFrames: 80, ...PORTRAIT });

// The full hook -> morph -> capability montage, start to end of scene 2.
export const scene1to2 = defineVideo({ id: "MyBolaScene1to2", component: wrap(Scene1to2), durationInFrames: scene1to2Dur, ...PORTRAIT });

export const hookOptions = [hookBadge, hookBubble, hookProblem, hookPhone, transitionS1S2, scene1to2];
