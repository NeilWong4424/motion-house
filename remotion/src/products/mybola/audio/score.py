"""Score synthesis — written to the cut, in free time.

Two earlier versions were wrong in instructive ways:

  1. Four sine chords on a fixed 4.4s loop. Harmonically static, ignored the
     edit entirely, and mixed 15dB louder than the reference film's bed.
  2. A metric score on a bar grid. But this film's scene gaps are 3.33 / 6 / 7
     seconds, and 3.33s is not a musical duration at any sane tempo — the best
     fit across 56-120bpm still drifted ~58ms per cut. A grid would fight the
     edit, and you would hear it.

So this is a FREE-TIME score, which is what warm-editorial product films
actually use: no drum pulse, no bar lines. Instead each chord change is placed
exactly on a scene cut, so the harmony breathes with the edit. The music can't
drift out of sync because it has no grid to drift against — it is scored to the
picture, note by note.

Instruments are chosen for the design language ("warm editorial — cream paper,
Playfair serif, one coral accent. Calm and premium; the app does the talking"):

  * Felt piano   — the voice. Struck, intimate, decays fast. Carries the melody
                   on the beats that matter and stays quiet elsewhere.
  * Warm strings — the bed. Slow bowed swell, no vibrato. Holds the harmony
                   under everything without asking for attention.
  * Upright bass — the floor. Round, short, felt more than heard.
  * Glass bell   — the accent, used ONCE, on the payoff. Scarcity is the point,
                   exactly like coral in the visual language.

No drums: a pulse would make this a promo. The film is calm, so the score is
calm.

Still synthesis, not licensed production music. If a real track is ever
licensed, drop it in public/audio/ and mix it in place of this.
"""

from __future__ import annotations

import numpy as np

SR = 48000


def hz(semitones_from_a4: float) -> float:
    """Equal temperament, A4 = 440."""
    return 440.0 * (2 ** (semitones_from_a4 / 12.0))


# Semitone offsets from A4.
A1, E2, F2, G2, A2, C3, D3, E3, F3, G3 = -36, -29, -28, -26, -24, -21, -19, -17, -16, -14
A3, B3, C4, D4, E4, F4, G4 = -12, -10, -9, -7, -5, -4, -2
A4, B4, C5, D5, E5, G5, A5 = 0, 2, 3, 5, 7, 10, 12


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
    """Struck felt piano: fast attack, exponential decay, slightly inharmonic.

    Real strings are stiff so partials sit sharp of exact multiples; that small
    stretch is most of what separates an instrument from an oscillator. The felt
    reads as the hammer-noise burst and the rolled-off top.
    """
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
    # Bow noise, very low.
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
    """The accent. Used once, on the payoff. Inharmonic, long, shimmering."""
    n = int(dur * SR)
    t = np.arange(n) / SR
    wave = np.zeros(n)
    for ratio, amp, dec in [(1.0, 1.0, 1.1), (2.76, 0.5, 1.8), (5.40, 0.25, 2.6), (8.93, 0.12, 3.4)]:
        wave += amp * np.sin(2 * np.pi * f * ratio * t) * np.exp(-t * dec)
    return wave * vel * 0.16


# =============================================================================
# The cue sheet
# =============================================================================
# Each entry: (start_seconds, chord tones, bass root, texture)
# `texture` picks the arrangement density for that section, so the film's arc is
# audible: sparse open -> fuller as it builds -> bell on the payoff -> resolve.
Cue = tuple[float, list[int], int, str]


def cues_for(cuts: list[float], end: float, payoff_at: float | None) -> list[Cue]:
    """Write a progression whose changes land exactly on the scene cuts.

    Harmony: A minor home, lifting to C major (the relative major) at the payoff
    and resolving back. i - VI - III - VII is the natural loop; we deviate from
    it deliberately at the turn so the lift is felt.
    """
    prog = [
        ([A3, C4, E4], A2),   # Am  — home, unresolved
        ([F3, A3, C4], F2),   # F   — warmth
        ([C4, E4, G4], C3),   # C   — hope
        ([G3, B3, D4], G2),   # G   — leans forward
    ]
    lift = [
        ([C4, E4, G4], C3),   # C   — arrival
        ([G3, B3, D4], G2),
        ([F3, A3, C4], F2),
        ([A3, C4, E4], A2),   # back to Am, but after the lift it reads warm
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


def compose(duration: float, cuts: list[float] | None = None, payoff_at: float | None = None, seed: int = 5) -> np.ndarray:
    """Render the score.

    `cuts` — the film's scene-change times in seconds. Chord changes land on
    these, which is the whole point: the music is scored to the picture rather
    than looped underneath it.
    """
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

        # Bass: one round note per section, let it ring.
        place(L, upright_bass(hz(root), span * 1.05, 0.9), start)
        place(R, upright_bass(hz(root), span * 1.05, 0.9), start)

        # Strings: the chord, held across the whole section. Slight stagger and
        # L/R spread gives width without reverb.
        for j, tone in enumerate(chord):
            pan = 0.5 + 0.2 * (j - 1)
            sig = strings(hz(tone), span * 1.1, 0.9 if tex != "open" else 0.55)
            place(L, sig * (1 - pan), start + 0.02 * j)
            place(R, sig * pan, start + 0.02 * j)

        # Felt piano: how many notes depends on the section's job.
        pattern = {
            "open": [0],
            "main": [0, 2],
            "build": [0, 1, 2, 1],
            "payoff": [0, 1, 2],
            "close": [0],
        }[tex]
        step = span / max(len(pattern), 1)
        for k, idx in enumerate(pattern):
            tone = chord[idx % len(chord)] + (12 if tex in ("build", "payoff") and k == len(pattern) - 1 else 0)
            # Humanise — a player is never exactly on the mark.
            jitter = rng.uniform(-0.02, 0.02)
            vel = 0.75 + rng.uniform(-0.1, 0.1) + (0.2 if tex == "payoff" else 0)
            sig = felt_piano(hz(tone), min(step * 2.4, 3.2), vel)
            place(L, sig * 0.55, start + k * step + jitter)
            place(R, sig * 0.45, start + k * step + jitter + 0.008)

        # The bell: once, on the payoff. Scarcity is the point.
        if tex == "payoff":
            place(L, glass_bell(hz(A5), 4.0, 0.9) * 0.5, start + 0.04)
            place(R, glass_bell(hz(A5), 4.0, 0.9) * 0.5, start + 0.06)

    # Fades.
    t = np.arange(total) / SR
    L *= np.minimum(1, t / 1.6) * np.minimum(1, (duration - t) / 3.2)
    R *= np.minimum(1, t / 1.6) * np.minimum(1, (duration - t) / 3.2)

    st = np.stack([L, R])
    peak = float(np.max(np.abs(st)))
    if peak > 0:
        st /= peak
    return st
