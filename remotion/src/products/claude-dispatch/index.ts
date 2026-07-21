import { dispatch } from "./videos/dispatch";

// =============================================================================
// Claude "Dispatch" product — registered videos
// =============================================================================
// Standalone product package (a 1:1 study replica of the reference film). The
// engine entry imports this array and calls registerVideos(); nothing in shared/
// or in other products changes to accept it.
export const videos = [dispatch];
