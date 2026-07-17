"""Synthesize the music bed for World Cup 2026 videos.

    python make_audio.py WorldCup2026Format --out out/audio

writes <out>/<VideoId>-music.wav. Music only — this film has no UI, so there is
no SFX track; the score IS the sound design.
"""

from __future__ import annotations

import argparse
import os

import numpy as np
import wave

from score import compose

SR = 48000


# =============================================================================
# Per-video config
# =============================================================================
# cuts: the film's scene-change times in seconds, from the SCENES table in
# videos/format.tsx (frames / 30). Recompute whenever a scene length changes,
# or the chord changes drift off the edit.
VIDEOS: dict[str, dict] = {
    "WorldCup2026Format": {
        "duration": 93.2,  # timeline is 93.00s; a little tail so the bed never ends early
        # SCENES: 150, 420, 750, 1080, 1410, 1800, 2100, 2430, 2670 @ 30fps.
        "cuts": [5.0, 14.0, 25.0, 36.0, 47.0, 60.0, 70.0, 81.0, 89.0],
        # Scene 6 — "The 8 best third-placed teams", the first lime. The film
        # turns here, so the harmony lifts to the relative major and the bell
        # sounds once.
        "payoff_at": 47.0,
    },
}


def write_wav(path: str, data: np.ndarray) -> None:
    """Write a float array (-1..1) as a 16-bit stereo WAV file."""
    if data.ndim == 1:
        data = np.stack([data, data])
    pcm = (np.clip(data, -1, 1) * 32767).astype(np.int16)
    inter = np.empty(pcm.shape[1] * 2, dtype=np.int16)
    inter[0::2] = pcm[0]
    inter[1::2] = pcm[1]
    with wave.open(path, "w") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(inter.tobytes())


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("video", choices=sorted(VIDEOS), help="composition id to synthesize audio for")
    ap.add_argument("--out", default="out/audio", help="output directory for the WAV files")
    args = ap.parse_args()

    cfg = VIDEOS[args.video]
    os.makedirs(args.out, exist_ok=True)
    music_path = os.path.join(args.out, f"{args.video}-music.wav")
    write_wav(music_path, compose(cfg["duration"], cfg.get("cuts"), cfg.get("payoff_at")))
    print(f"wrote {music_path}")


if __name__ == "__main__":
    main()
