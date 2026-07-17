"""Score synthesis for the World Cup 2026 format film — free time, cut-locked.

Same approach as MyBola's score (see products/mybola/audio/score.py for the
full argument): no drum pulse, no bar grid. This edit's scenes are 4/5/8/9/10/11
and 13 seconds long — not musical durations at any tempo — so every chord change
is placed exactly on a scene cut and the harmony breathes with the picture.

The arrangement is tuned to THIS design language ("pitch at night — green-black,
bone type, one electric lime; broadcast graphics with the confidence to hold
still"), which is colder and more austere than MyBola's warm editorial:

  * Felt piano   — the voice, but sparser than MyBola's: mostly roots and
                   fifths, single notes. Broadcast confidence is stillness.
  * Low strings  — the bed, sitting an octave darker than the MyBola score.
  * Upright bass — the floor.
  * Glass bell   — ONCE, at the film's turn (scene 6, the first lime — "the 8
                   best third-placed teams"). The bell is the audio lime:
                   scarcity is the rule in both channels.

Harmony: E minor home (a darker home than MyBola's A minor), lifting to the
relative major (G) at the turn and resolving back.

Still synthesis, not licensed production music.
"""

from __future__ import annotations

import numpy as np

SR = 48000


def hz(semitones_from_a4: float) -> float:
    """Equal temperament, A4 = 440."""
    return 440.0 * (2 ** (semitones_from_a4 / 12.0))


# Semitone offsets from A4.
E1, B1, C2, D2, E2, F2s, G2, A2, B2 = -41, -34, -33, -31, -29, -27, -26, -24, -22
C3, D3, E3, F3s, G3, A3, B3 = -21, -19, -17, -15, -14, -12, -10
C4, D4, E4, F4s, G4, A4, B4 = -9, -7, -5, -3, -2, 0, 2
D5, E5, G5, B5 = 5, 7, 10, 14


def _adsr(n: int, a: float, d: float, s: float, r: float) -> np.ndarray:
    ai, di, ri = max(int(a * SR), 1), max(int(d * SR), 1), max(int(r * SR), 1)
    si = max(n - ai - di - ri, 0)
    env = np.concatenate([
        np.linspace(0, 1, ai),
        np.linspace(1, s, di),
        np.full(si, s),
        np.linspace(s, 0, ri),
    ])
    return env[:n] if len(env) >= n else np.pad(env, (0, n - len(env)))


def felt_piano(f: float, dur: float, vel: float = 1.0) -> np.ndarray:
    """Struck felt piano: fast attack, exponential decay, slightly inharmonic."""
    n = int(dur * SR)
    t = np.arange(n) / SR
    B = 0.0004
    wave = np.zeros(n)
    for k, amp in [(1, 1.0), (2, 0.30), (3, 0.11), (4, 0.05), (5, 0.02)]:
        wave += amp * np.sin(2 * np.pi * f * k * np.sqrt(1 + B * k * k) * t)
    decay = np.exp(-t * (1.5 + f / 1100))
    rng = np.random.default_rng(int(f * 7) % 9973)
    felt = rng.standard_normal(n) * np.exp(-t * 90) * 0.18
    return (wave * decay + felt * decay) * vel * 0.24


def strings(f: float, dur: float, vel: float = 1.0) -> np.ndarray:
    """Bowed section: slow swell, detuned unison, no vibrato. Pure bed."""
    n = int(dur * SR)
    t = np.arange(n) / SR
    wave = np.zeros(n)
    for det, amp in [(0.997, 0.5), (1.0, 1.0), (1.004, 0.5)]:
        wave += amp * (
            np.sin(2 * np.pi * f * det * t)
            + 0.30 * np.sin(2 * np.pi * f * det * 2 * t)
            + 0.10 * np.sin(2 * np.pi * f * det * 3 * t)
        )
    rng = np.random.default_rng(int(f) % 7919)
    bow = np.convolve(rng.standard_normal(n), np.ones(80) / 80, mode="same") * 0.02
    return (wave / 2 + bow) * _adsr(n, dur * 0.28, dur * 0.2, 0.8, dur * 0.4) * vel * 0.10


def upright_bass(f: float, dur: float, vel: float = 1.0) -> np.ndarray:
    """Round, short, felt more than heard."""
    n = int(dur * SR)
    t = np.arange(n) / SR
    wave = np.sin(2 * np.pi * f * t) + 0.14 * np.sin(2 * np.pi * f * 2 * t)
    rng = np.random.default_rng(int(f) % 6151)
    pluck = rng.standard_normal(n) * np.exp(-t * 120) * 0.10
    return (wave + pluck) * _adsr(n, 0.04, 0.5, 0.5, dur * 0.45) * vel * 0.30


def glass_bell(f: float, dur: float, vel: float = 1.0) -> np.ndarray:
    """The accent. Used once, at the turn. Inharmonic, long, shimmering."""
    n = int(dur * SR)
    t = np.arange(n) / SR
    wave = np.zeros(n)
    for ratio, amp, dec in [(1.0, 1.0, 1.1), (2.76, 0.5, 1.8), (5.40, 0.25, 2.6), (8.93, 0.12, 3.4)]:
        wave += amp * np.sin(2 * np.pi * f * ratio * t) * np.exp(-t * dec)
    return wave * vel * 0.16


# =============================================================================
# The cue sheet
# =============================================================================
Cue = tuple[float, list[int], int, str]


def cues_for(cuts: list[float], end: float, payoff_at: float | None) -> list[Cue]:
    """A progression whose changes land exactly on the scene cuts.

    E minor home; the turn lifts to G (the relative major) and resolves back to
    Em, which after the lift reads settled rather than unresolved.
    """
    prog = [
        ([E3, G3, B3], E2),    # Em — home, cold
        ([C3, E3, G3], C2),    # C  — width
        ([G3, B3, D4], G2),    # G  — light, briefly
        ([D3, F3s, A3], D2),   # D  — leans forward
    ]
    lift = [
        ([G3, B3, D4], G2),    # G  — arrival (the turn)
        ([D3, F3s, A3], D2),
        ([C3, E3, G3], C2),
        ([E3, G3, B3], E2),    # back home, warmer now
    ]
    out: list[Cue] = []
    starts = [0.0] + list(cuts)
    for i, s in enumerate(starts):
        after = payoff_at is not None and s >= payoff_at - 0.01
        table = lift if after else prog
        chord, root = table[i % 4]
        if payoff_at is not None and abs(s - payoff_at) < 0.01:
            tex = "payoff"
        elif i == 0:
            tex = "open"
        elif s > end - 6:
            tex = "close"
        else:
            tex = "build" if after else "main"
        out.append((s, chord, root, tex))
    return out


def compose(duration: float, cuts: list[float] | None = None, payoff_at: float | None = None, seed: int = 11) -> np.ndarray:
    """Render the score. `cuts` are the film's scene-change times in seconds."""
    rng = np.random.default_rng(seed)
    total = int(duration * SR)
    L = np.zeros(total)
    R = np.zeros(total)

    def place(buf: np.ndarray, sig: np.ndarray, at: float) -> None:
        s = max(int(at * SR), 0)
        if s >= total:
            return
        e = min(s + len(sig), total)
        buf[s:e] += sig[: e - s]

    cuts = cuts or []
    sheet = cues_for(cuts, duration, payoff_at)

    for i, (start, chord, root, tex) in enumerate(sheet):
        nxt = sheet[i + 1][0] if i + 1 < len(sheet) else duration
        span = nxt - start
        if span <= 0.2:
            continue

        # Bass: one round note per section.
        place(L, upright_bass(hz(root), span * 1.05, 0.9), start)
        place(R, upright_bass(hz(root), span * 1.05, 0.9), start)

        # Strings: the chord held across the section, slight stagger + spread.
        for j, tone in enumerate(chord):
            pan = 0.5 + 0.2 * (j - 1)
            sig = strings(hz(tone), span * 1.1, 0.9 if tex != "open" else 0.55)
            place(L, sig * (1 - pan), start + 0.02 * j)
            place(R, sig * pan, start + 0.02 * j)

        # Felt piano — sparser than the MyBola arrangement: this language holds
        # still, so the voice speaks less. Root only, root+fifth in the build.
        pattern = {
            "open": [0],
            "main": [0],
            "build": [0, 2],
            "payoff": [0, 2, 0],
            "close": [0],
        }[tex]
        step = span / max(len(pattern), 1)
        for k, idx in enumerate(pattern):
            tone = chord[idx % len(chord)] + (12 if tex == "payoff" and k == len(pattern) - 1 else 0)
            jitter = rng.uniform(-0.02, 0.02)
            vel = 0.75 + rng.uniform(-0.1, 0.1) + (0.2 if tex == "payoff" else 0)
            sig = felt_piano(hz(tone), min(step * 2.4, 3.2), vel)
            place(L, sig * 0.55, start + k * step + jitter)
            place(R, sig * 0.45, start + k * step + jitter + 0.008)

        # The bell: once, at the turn — the audio lime.
        if tex == "payoff":
            place(L, glass_bell(hz(B5), 4.0, 0.9) * 0.5, start + 0.04)
            place(R, glass_bell(hz(B5), 4.0, 0.9) * 0.5, start + 0.06)

    # Fades.
    t = np.arange(total) / SR
    L *= np.minimum(1, t / 1.6) * np.minimum(1, (duration - t) / 3.2)
    R *= np.minimum(1, t / 1.6) * np.minimum(1, (duration - t) / 3.2)

    st = np.stack([L, R])
    peak = float(np.max(np.abs(st)))
    if peak > 0:
        st /= peak
    return st
