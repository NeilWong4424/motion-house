import { launch } from "./videos/launch";
import { capabilityVariants } from "./videos/capabilities";
import { hookOptions } from "./videos/hooks";

// =============================================================================
// MyBola product — registered videos
// =============================================================================
// Every MyBola VideoDef the studio should show. The engine entry imports this
// array and calls registerVideos(); nothing in shared/ changes to accept it.
// The MyBolaCaps-* variants are review clips for scene 3 — the client picks one,
// then it's slotted into the launch cut.

export const videos = [launch, ...capabilityVariants, ...hookOptions];
