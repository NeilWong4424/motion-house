import { Config } from "@remotion/cli/config";

// Master settings — quality over render speed (deliberate; see CLAUDE.md).
// - PNG intermediates: frames reach the encoder lossless. JPEG (the default)
//   bands the flat cream fields and rings around serif edges before h264 runs.
// - BT.709: what phones/YouTube/web expect. The bt601 default reads slightly
//   muddy — coral washes out, blacks grey.
// - CRF 16: near-transparent h264. We `-c:v copy` at the audio mux, so this
//   render is the only encode the film ever gets.
Config.setVideoImageFormat("png");
Config.setColorSpace("bt709");
Config.setCrf(16);
Config.setOverwriteOutput(true);
