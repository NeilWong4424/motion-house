"""Score synthesis — a written piece, not a drone.

The first version of this was four chords looping on sine pads: harmonically
static, no rhythm, no arrangement, and mixed 15dB louder than the reference
film's bed. It sounded like filler because it was filler.

This module composes properly:

  * A real progression in A minor with movement (i - VI - III - VII, the
    "sad-but-hopeful" loop), plus a lift to the relative major (C) for the
    payoff section and a resolve home for the close.
  * Voice leading: chord tones move by the smallest interval available instead
    of every note jumping in parallel. That's what stops it sounding like a
    keyboard demo.
  * Three layers with different jobs — felt piano (melody/arpeggio), warm pad
    (harmonic bed), soft bass (root movement) — arranged so the film's arc is
    audible: sparse at the open, full at the payoff, thinning to the close.
  * Struck timbres with real envelopes and inharmonic partials, so notes decay
    like a plucked/struck instrument rather than sustaining like a test tone.

It is still synthesis, not licensed production music: the ceiling here is a
tasteful instrumental bed. If a real track is ever licensed, drop it in
public/audio/ and mix it in place of this.
"""

from __future__ import annotations

import numpy as np

SR = 48000

# Equal temperament from A4 = 440.
def note_hz(semitones_from_a4: float) -> float:
    return 440.0 * (2 ** (semitones_from_a4 / 12.0))


# Scale degrees we use, as semitone offsets from A4.
A2, C3, D3, E3, F3, G3 = -24, -21, -19, -17, -16, -14
A3, C4, D4, E4, F4, G4 = -12, -9, -7, -5, -4, -2
A4, C5, D5, E5 = 0, 3, 5, 7

# The progression. Each entry: (chord tones as semitone offsets, bass root).
# Am - F - C - G  — i, VI, III, VII in A minor. Movement, not a drone.
PROG_MAIN = [
    ([A3, C4, E4], A2),   # Am  — home, unresolved
    ([F3, A3, C4], F3),   # F   — warmth, lifts
    ([C4, E4, G4], C3),   # C   — the relative major: hope
    ([G3, D4, G4], G3),   # G   — leans forward, wants to resolve
]

# Payoff section: the same shape but rooted in C major — brighter without
# changing key, so the lift is felt rather than announced.
PROG_LIFT = [
    ([C4, E4, G4], C3),
    ([G3, D4, G4], G3),
    ([F3, A3, C4], F3),
    ([C4, E4, G4], C3),
]


def _env(n: int, attack: float, decay: float, sustain: float, release: float) -> np.ndarray:
    """ADSR over n samples, times in seconds."""
    a, d, r = int(attack * SR), int(decay * SR), int(release * SR)
    a, d, r = max(a, 1), max(d, 1), max(r, 1)
    s = max(n - a - d - r, 0)
    return np.concatenate([
        np.linspace(0, 1, a),
        np.linspace(1, sustain, d),
        np.full(s, sustain),
        np.linspace(sustain, 0, r),
    ])[:n]


def felt_piano(freq: float, dur: float, vol: float = 1.0) -> np.ndarray:
    """A struck, felted tone: fast attack, long decay, slightly inharmonic.

    Real strings are stiff, so partials sit slightly sharp of exact multiples —
    that tiny detuning is most of what makes a synth sound like an instrument
    rather than an oscillator.
    """
    n = int(dur * SR)
    t = np.arange(n) / SR
    B = 0.0004  # inharmonicity
    wave = np.zeros(n)
    for k, amp in [(1, 1.0), (2, 0.36), (3, 0.14), (4, 0.07), (5, 0.03)]:
        stretch = np.sqrt(1 + B * k * k)
        wave += amp * np.sin(2 * np.pi * freq * k * stretch * t)
    # Struck: immediate attack, exponential decay. Higher notes decay faster.
    decay = np.exp(-t * (1.6 + freq / 900))
    hammer = np.exp(-t * 60) * 0.25 * np.random.default_rng(int(freq)).standard_normal(n)
    return (wave * decay + hammer * decay) * vol * 0.22


def warm_pad(freq: float, dur: float, vol: float = 1.0) -> np.ndarray:
    """Slow bed tone: detuned pair, gentle breath. Sits UNDER everything."""
    n = int(dur * SR)
    t = np.arange(n) / SR
    wave = (
        np.sin(2 * np.pi * freq * t)
        + 0.5 * np.sin(2 * np.pi * freq * 1.005 * t)   # detune -> chorus
        + 0.25 * np.sin(2 * np.pi * freq * 2 * t)
    )
    breath = 1 + 0.03 * np.sin(2 * np.pi * 0.15 * t)
    return wave * _env(n, 0.9, 0.6, 0.75, 1.2) * breath * vol * 0.12


def soft_bass(freq: float, dur: float, vol: float = 1.0) -> np.ndarray:
    """Round low end: mostly fundamental, a touch of second."""
    n = int(dur * SR)
    t = np.arange(n) / SR
    wave = np.sin(2 * np.pi * freq * t) + 0.18 * np.sin(2 * np.pi * freq * 2 * t)
    return wave * _env(n, 0.06, 0.5, 0.55, 0.7) * vol * 0.3


def _voice_lead(prev: list[int] | None, chord: list[int]) -> list[int]:
    """Move each chord tone to the nearest octave of the previous voicing.

    Without this every chord jumps in parallel and the ear hears "block chords
    on a keyboard". With it the inner voices barely move and the progression
    flows.
    """
    if prev is None:
        return chord
    out = []
    for tone in chord:
        best = tone
        for octave in (-12, 0, 12):
            cand = tone + octave
            if min(abs(cand - p) for p in prev) < min(abs(best - p) for p in prev):
                best = cand
        out.append(best)
    return out


def compose(duration: float, lift_at: float | None = None, seed: int = 3) -> np.ndarray:
    """Write the full score.

    `lift_at` — seconds where the film turns (the payoff). The arrangement
    thickens and moves to the brighter progression there, then thins for the
    close. Passing None keeps the main progression throughout.
    """
    rng = np.random.default_rng(seed)
    total = int(duration * SR)
    left = np.zeros(total)
    right = np.zeros(total)

    bar = 3.6  # seconds per chord — slow enough to feel calm, not static
    t0 = 0.0
    i = 0
    prev_voicing: list[int] | None = None

    def place(buf: np.ndarray, sig: np.ndarray, at: float) -> None:
        # Notes near the end get truncated; a jittered start can also land just
        # past the buffer, so guard both ends before slicing.
        s = max(int(at * SR), 0)
        if s >= total:
            return
        e = min(s + len(sig), total)
        buf[s:e] += sig[: e - s]

    while t0 < duration:
        in_lift = lift_at is not None and t0 >= lift_at
        prog = PROG_LIFT if in_lift else PROG_MAIN
        chord, root = prog[i % len(prog)]
        voicing = _voice_lead(prev_voicing, chord)
        prev_voicing = voicing

        # Bass: root on the downbeat, held.
        place(left, soft_bass(note_hz(root), bar * 1.05, 0.9), t0)
        place(right, soft_bass(note_hz(root), bar * 1.05, 0.9), t0)

        # Pad: the chord, wide. Slight L/R offset gives width without reverb.
        for j, tone in enumerate(voicing):
            pan = 0.5 + 0.18 * (j - 1)
            sig = warm_pad(note_hz(tone), bar * 1.15, 0.8)
            place(left, sig * (1 - pan), t0 + 0.01 * j)
            place(right, sig * pan, t0 + 0.01 * j)

        # Felt piano: an arpeggio, not a block. Sparse early, fuller at the lift.
        steps = [0, 1, 2, 1] if not in_lift else [0, 1, 2, 1, 2, 1]
        step_dur = bar / len(steps)
        for k, si in enumerate(steps):
            tone = voicing[si % len(voicing)] + (12 if in_lift and k % 3 == 2 else 0)
            # Humanise: real players are never exactly on the grid.
            jitter = rng.uniform(-0.012, 0.012)
            vel = 0.8 + rng.uniform(-0.12, 0.12) + (0.15 if in_lift else 0)
            sig = felt_piano(note_hz(tone), step_dur * 2.2, vel)
            place(left, sig * 0.55, t0 + k * step_dur + jitter)
            place(right, sig * 0.45, t0 + k * step_dur + jitter + 0.006)

        t0 += bar
        i += 1

    # Fades: in over 2s, out over the last 3.5s.
    t = np.arange(total) / SR
    fade = np.minimum(1, t / 2.0) * np.minimum(1, (duration - t) / 3.5)
    left *= fade
    right *= fade

    stereo = np.stack([left, right])
    peak = np.max(np.abs(stereo))
    if peak > 0:
        stereo /= peak
    return stereo
