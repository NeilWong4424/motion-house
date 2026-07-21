import { launch } from "./videos/launch";

// =============================================================================
// MyBola v2 product — registered videos
// =============================================================================
// Standalone from products/mybola. The engine entry imports this array and calls
// registerVideos(); nothing in shared/ or in the v1 product changes to accept it.
export const videos = [launch];
