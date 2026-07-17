"""Synthesize the background music bed and UI sound effects for MyBola videos.

Per-video: each entry in VIDEOS carries that cut's length and SFX cue table, so a
new video adds a dict entry rather than editing the synthesis code.

    python make_audio.py MyBolaV4 --out out/audio

writes <out>/<VideoId>-music.wav and <out>/<VideoId>-sfx.wav.
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
# duration: seconds of audio to synthesize; must cover the full cut.
# typing:   (start, end[, rate]) bursts of keyboard taps before a send.
# pops:     (freq, vol, at) send/receive blips.
#
VIDEOS: dict[str, dict] = {
    # v4 (the current cut, 49.43s after the Step-2 evidence bubble lengthened
    # Scene A 330→430f). Cues derived from videos/launchV4.tsx at 30fps:
    #   sceneA f90   typing f+8..84, send f+95, reply f+140, send f+195,
    #                reply f+243, evidence shot f+278, action sheet f+358
    #   sceneB f520  voice f+20, reply f+100, send f+195, reply f+245
    #   sceneC f967  typing f+8..53, send f+60, reply f+105, doc f+168, reply f+230
    "MyBolaV4": {
        "duration": 49.6,  # timeline is 49.43s; a little tail so the bed never ends early
        # Scene-boundary times — chord changes land on these.
        "cuts": [3.0, 17.33, 19.53, 30.03, 32.23, 42.9, 45.1],
        "payoff_at": 45.1,  # the cut to KINI DILANCARKAN — the launch itself
        "typing": [
            (3.27, 5.77, 9),    # sceneA: register-Adam request typed
            (9.07, 9.43, 11),   # sceneA: send-bills request
            (32.50, 33.97, 9),  # sceneC: WhatsApp order typed
        ],
        "pops": [
            (700, 0.50, 6.17),   # sceneA send 1
            (520, 0.45, 7.67),   # sceneA reply 1
            (700, 0.50, 9.50),   # sceneA send 2
            (520, 0.45, 11.10),  # sceneA reply 2 — "28 bil dihantar."
            (520, 0.42, 12.27),  # evidence screenshot lands
            (520, 0.40, 14.93),  # action sheet slides up
            (700, 0.45, 18.00),  # sceneB voice note sent
            (520, 0.42, 20.67),  # sceneB attendance reply
            (700, 0.45, 23.83),  # sceneB schedule request sent
            (520, 0.42, 25.50),  # sceneB schedule reply
            (700, 0.50, 34.23),  # sceneC WA send
            (520, 0.45, 35.73),  # sceneC WA reply
            (700, 0.45, 37.83),  # sceneC WA receipt doc
            (520, 0.42, 39.90),  # sceneC WA confirm
        ],
    },
    # v8 — cues derived from the actual scene table in videos/launchV8.tsx.
    # Recompute these whenever a scene length changes: a pop even 3 frames off
    # its send reads as broken.
    #   sceneA  f150   typing f+8..92, send f+95, reply f+140, send f+195, reply f+243
    #   sceneB  f546   voice f+20, reply f+100, reply f+245
    #   sceneC  f927   typing f+8..58, send f+60, reply f+105, doc f+168, reply f+230
    "MyBolaV8": {
        "duration": 76.9,  # timeline is 76.70s; a little tail so the bed never ends early
        # Scene cuts from videos/launchV8.tsx.
        "cuts": [3.0, 5.0, 16.0, 18.2, 28.7, 30.9, 41.57, 43.77, 45.97, 57.97, 60.17, 70.17, 72.37],
        "payoff_at": 45.97,  # "Dan duit? Semua nampak." — the turn to the dashboard
        "typing": [
            (5.27, 8.07, 9),    # sceneA: first request typed
            (11.00, 11.43, 11), # sceneA: second request
            (31.17, 32.83, 9),  # sceneC: WhatsApp order typed
        ],
        "pops": [
            (700, 0.50, 8.17),   # send 1
            (520, 0.45, 9.67),   # reply 1
            (700, 0.50, 11.50),  # send 2
            (520, 0.45, 13.10),  # reply 2
            (700, 0.45, 18.87),  # voice note sent
            (520, 0.42, 21.53),  # attendance reply
            (520, 0.42, 26.37),  # schedule reply
            (700, 0.50, 32.90),  # WA send
            (520, 0.45, 34.40),  # WA reply
            (700, 0.45, 36.50),  # WA receipt doc
            (520, 0.42, 38.57),  # WA confirm
            (880, 0.35, 46.20),  # the turn -> dashboard
            (880, 0.30, 60.30),  # bil -> ahli
        ],
    },
    # Parent onboarding — cues derived from videos/parentOnboarding.tsx.
    # Taps land on the press frame, sheet pops on the slide-up.
    "MyBolaParent": {
        "duration": 59.5,  # timeline is 59.33s
        # Scene-cut times from videos/parentOnboarding.tsx. Chord changes land on
        # these, so the score is written to the edit rather than looped under it.
        # Recompute whenever a scene length changes.
        "cuts": [3.33, 9.33, 16.33, 19.67, 25.67, 31.67, 37.67, 44.67, 51.67, 55.0],
        # Adam's card lands at 25.67 — the film turns there, so the score lifts
        # to the relative major and the bell sounds once.
        "payoff_at": 25.67,
        "typing": [
            (9.17, 9.90, 11),   # phone number entered
            (18.30, 18.97, 11), # display name entered
        ],
        "pops": [
            (700, 0.45, 6.50),   # tap "Log masuk dengan Google"
            (700, 0.45, 13.50),  # tap "Seterusnya"
            (700, 0.45, 22.20),  # tap "Selesai"
            (880, 0.50, 24.37),  # Adam's card lands — the link working
            (520, 0.40, 30.70),  # sesi sheet up
            (700, 0.45, 33.37),  # tap "Rekod Kehadiran"
            (520, 0.40, 36.70),  # bil sheet up
            (700, 0.50, 39.97),  # tap "Bayar Sekarang"
            (520, 0.40, 43.70),  # kedai sheet up
            (620, 0.35, 45.03),  # pick size M
            (700, 0.50, 47.30),  # tap "Beli Sekarang"
        ],
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


def note(freq: float, dur: float, attack: float = 0.4, release: float = 0.8, vol: float = 1.0) -> np.ndarray:
    """Render one soft pad note: sine + gentle harmonics with slow envelope."""
    t = np.arange(int(dur * SR)) / SR
    wavf = (
        np.sin(2 * np.pi * freq * t)
        + 0.35 * np.sin(2 * np.pi * freq * 2 * t)
        + 0.12 * np.sin(2 * np.pi * freq * 3 * t)
        + 0.08 * np.sin(2 * np.pi * freq * 0.5 * t)
    )
    env = np.minimum(1, t / attack) * np.minimum(1, (dur - t) / release)
    vib = 1 + 0.003 * np.sin(2 * np.pi * 5.2 * t)
    return wavf * env * vol * vib


def chord(freqs: list[float], dur: float, vol: float = 1.0) -> np.ndarray:
    """Layer several notes into one chord."""
    out = np.zeros(int(dur * SR))
    for f in freqs:
        out += note(f, dur, vol=vol / len(freqs))
    return out


def music(dur: float, cuts=None, payoff_at=None) -> np.ndarray:
    """The score. See score.py — free-time, chord changes landing on the film's
    scene cuts, felt piano + strings + upright bass, one bell on the payoff."""
    return compose(dur, cuts=cuts, payoff_at=payoff_at)


def tap(vol: float = 0.5, tone: float = 3200, dur: float = 0.05) -> np.ndarray:
    """One short keyboard tap: filtered noise burst with a soft tonal click."""
    n = int(dur * SR)
    t = np.arange(n) / SR
    rng = np.random.default_rng(int(tone))
    noise = rng.standard_normal(n)
    noise = np.convolve(noise, np.ones(6) / 6, mode="same")
    click = 0.5 * np.sin(2 * np.pi * tone * t)
    env = np.exp(-t * 90)
    return (0.7 * noise + click) * env * vol


def pop(freq: float = 620, vol: float = 0.5) -> np.ndarray:
    """Message-send/receive pop: quick pitch-bent sine blip."""
    dur = 0.16
    n = int(dur * SR)
    t = np.arange(n) / SR
    sweep = freq * (1 + 0.6 * np.exp(-t * 40))
    phase = 2 * np.pi * np.cumsum(sweep) / SR
    env = np.exp(-t * 26) * np.minimum(1, t / 0.004)
    return np.sin(phase) * env * vol


def sfx(cfg: dict) -> np.ndarray:
    """Assemble the SFX track for one video: typing bursts, send/receive pops."""
    dur = cfg["duration"]
    total = int(dur * SR)
    out = np.zeros(total)

    def place(sound: np.ndarray, at: float) -> None:
        s = int(at * SR)
        e = min(s + len(sound), total)
        if s < total:
            out[s:e] += sound[: e - s]

    rng = np.random.default_rng(7)

    def typing_burst(start: float, end: float, rate: float = 11) -> None:
        t0 = start
        while t0 < end:
            place(tap(vol=0.33 + rng.uniform(0, 0.1), tone=2600 + rng.uniform(0, 1400), dur=0.045), t0)
            t0 += 1 / rate + rng.uniform(-0.02, 0.02)

    for burst in cfg.get("typing", []):
        start, end = burst[0], burst[1]
        rate = burst[2] if len(burst) > 2 else 11
        typing_burst(start, end, rate)

    for freq, vol, at in cfg.get("pops", []):
        place(pop(freq, vol), at)

    return np.stack([out, out])


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("video", choices=sorted(VIDEOS), help="composition id to synthesize audio for")
    ap.add_argument("--out", default="out/audio", help="output directory for the WAV files")
    args = ap.parse_args()

    cfg = VIDEOS[args.video]
    os.makedirs(args.out, exist_ok=True)
    music_path = os.path.join(args.out, f"{args.video}-music.wav")
    sfx_path = os.path.join(args.out, f"{args.video}-sfx.wav")

    write_wav(music_path, music(cfg["duration"], cfg.get("cuts"), cfg.get("payoff_at")))
    write_wav(sfx_path, sfx(cfg))
    print(f"wrote {music_path}")
    print(f"wrote {sfx_path}")


if __name__ == "__main__":
    main()
