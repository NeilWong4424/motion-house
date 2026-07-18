import React from "react";
import { AbsoluteFill } from "remotion";
import { defineVideo, PORTRAIT } from "../../../shared/engine/types";
import { useDesignFonts } from "../../../shared/design/fonts";
import { mybola, MYBOLA } from "../design";
import { CapsGrid, CapsMontage, CapsOrbit, CapsList } from "../ui/Capabilities";

// =============================================================================
// Scene-3 capability summary — 4 form variants as standalone compositions
// =============================================================================
// Rendered separately so the client can pick a treatment. The chosen one is
// slotted into the launch cut (currently CapsGrid). Each is a short 6s portrait
// clip on the same black stage with the film's fonts loaded.

const DUR = 180; // 6s

const wrap = (Inner: React.FC): React.FC => () => {
  useDesignFonts(mybola);
  return (
    <AbsoluteFill style={{ background: MYBOLA.black }}>
      <Inner />
    </AbsoluteFill>
  );
};

export const capsGrid = defineVideo({ id: "MyBolaCaps-grid", component: wrap(CapsGrid), durationInFrames: DUR, ...PORTRAIT });
export const capsMontage = defineVideo({ id: "MyBolaCaps-montage", component: wrap(CapsMontage), durationInFrames: DUR, ...PORTRAIT });
export const capsOrbit = defineVideo({ id: "MyBolaCaps-orbit", component: wrap(CapsOrbit), durationInFrames: DUR, ...PORTRAIT });
export const capsList = defineVideo({ id: "MyBolaCaps-list", component: wrap(CapsList), durationInFrames: DUR, ...PORTRAIT });

export const capabilityVariants = [capsGrid, capsMontage, capsOrbit, capsList];
