"""Synthesize background music bed and UI sound effects for the MyBola launch video."""

import numpy as np
import wave


SR = 48000
DUR = 46.2  # full length of the current v7 cut (~46.1s). SFX cue times in sfx()
# below are still aligned to the older 34.4s layout — realign to v7 scene
# boundaries as a follow-up (see CLAUDE.md audio note / backlog).


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


def music() -> np.ndarray:
    """Warm four-chord pad progression covering the full video with fades."""
    F3, A3, C4, E4 = 174.61, 220.0, 261.63, 329.63
    G3, B3, D4 = 196.0, 246.94, 293.66
    Am = [220.0, 261.63, 329.63]
    Fmaj7 = [F3, A3, C4, E4]
    Cmaj = [130.81, 196.0, 261.63, 329.63]
    Gmaj = [G3, B3, D4, 392.0]
    prog = [Fmaj7, Cmaj, Am, Gmaj]
    bar = 4.4
    total = int(DUR * SR)
    out = np.zeros(total)
    t0 = 0.0
    i = 0
    while t0 < DUR:
        start = int(t0 * SR)
        c = chord(prog[i % 4], bar + 0.9, vol=0.9)
        e1 = min(start + len(c), total)
        out[start:e1] += c[: e1 - start]
        bass_f = prog[i % 4][0] / 2
        b = note(bass_f, bar + 0.5, attack=0.15, release=1.2, vol=0.30)
        e2 = min(start + len(b), total)
        out[start:e2] += b[: e2 - start]
        t0 += bar
        i += 1
    t = np.arange(total) / SR
    fade = np.minimum(1, t / 2.5) * np.minimum(1, (DUR - t) / 3.0)
    out = out * fade
    out /= np.max(np.abs(out)) * 1.05
    left = out * (1 + 0.04 * np.sin(2 * np.pi * 0.11 * t))
    right = out * (1 - 0.04 * np.sin(2 * np.pi * 0.11 * t))
    return np.stack([left, right]) * 0.32


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


def sfx() -> np.ndarray:
    """Assemble the full SFX track: typing bursts, send/receive pops."""
    total = int(DUR * SR)
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

    typing_burst(5.35, 5.80)
    place(pop(700, 0.5), 5.83)
    typing_burst(7.00, 8.10, rate=9)
    place(pop(520, 0.45), 8.33)
    place(pop(520, 0.45), 10.67)
    typing_burst(12.70, 13.12)
    place(pop(700, 0.5), 13.17)
    typing_burst(20.05, 20.30)
    place(pop(700, 0.45), 20.33)
    place(pop(520, 0.42), 21.00)
    place(pop(880, 0.35), 29.4)
    return np.stack([out, out])


write_wav("/tmp/music.wav", music())
write_wav("/tmp/sfx.wav", sfx())
print("audio written")
