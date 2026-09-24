export type SoundName = 'move' | 'rotate' | 'drop' | 'clear' | 'gameover';

/** Note format: [frequency in Hz (0 = rest), duration in ms]. */
type Note = readonly [number, number];

/**
 * Web Audio sound effects and the Korobeiniki theme.
 *
 * Music is driven by an explicit lifecycle — `startMusic` / `pauseMusic` /
 * `stopMusic` — so it only ever plays while a round is in progress. The theme
 * position survives a pause instead of restarting from the top.
 */
export class AudioController {
  muted = false;

  private ctx: AudioContext | null = null;
  private musicTimer: number | null = null;
  private musicIndex = 0;
  private wantsMusic = false;

  /** Created lazily so no AudioContext exists before the first user gesture. */
  private context(): AudioContext | null {
    if (this.muted) return null;

    if (!this.ctx) {
      // Safari exposed only the prefixed constructor until v14.1.
      const Ctor = window.AudioContext ?? (Reflect.get(window, 'webkitAudioContext') as typeof AudioContext | undefined);
      if (!Ctor) return null;
      this.ctx = new Ctor();
    }

    if (this.ctx.state === 'suspended') void this.ctx.resume();
    return this.ctx;
  }

  private playTone(frequency: number, duration: number, type: OscillatorType = 'square', volume = 0.3) {
    const ctx = this.context();
    if (!ctx) return;

    try {
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();

      oscillator.connect(gain);
      gain.connect(ctx.destination);
      oscillator.type = type;
      oscillator.frequency.value = frequency;

      // Quick attack, sustain, quick release.
      const now = ctx.currentTime;
      const attack = Math.min(0.01, duration / 4);
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(volume, now + attack);
      gain.gain.setValueAtTime(volume, now + duration - attack);
      gain.gain.linearRampToValueAtTime(0, now + duration);

      oscillator.start(now);
      oscillator.stop(now + duration);
    } catch (error) {
      // Audio must never break the game loop.
      console.warn('Audio playback failed:', error);
    }
  }

  play(sound: SoundName) {
    if (this.muted) return;

    switch (sound) {
      case 'move':
        this.playTone(880, 0.04, 'square', 0.06);
        break;
      case 'rotate':
        this.playTone(520, 0.05, 'square', 0.12);
        break;
      case 'drop':
        this.playTone(180, 0.09, 'triangle', 0.18);
        break;
      case 'clear':
        this.playTone(523, 0.1, 'sine', 0.22);
        window.setTimeout(() => this.playTone(659, 0.1, 'sine', 0.22), 90);
        window.setTimeout(() => this.playTone(784, 0.16, 'sine', 0.22), 180);
        break;
      case 'gameover':
        this.playTone(392, 0.18, 'triangle', 0.2);
        window.setTimeout(() => this.playTone(311, 0.18, 'triangle', 0.2), 180);
        window.setTimeout(() => this.playTone(233, 0.32, 'triangle', 0.2), 360);
        break;
    }
  }

  private tetrisTheme: readonly Note[] = [
    [659, 400], [494, 200], [523, 200], [587, 400], [523, 200], [494, 200],
    [440, 400], [440, 200], [523, 200], [659, 400], [587, 200], [523, 200],
    [494, 600], [523, 200], [587, 400], [659, 400],
    [523, 400], [440, 400], [440, 400], [0, 400],

    [587, 400], [698, 200], [880, 400], [784, 200], [698, 200],
    [659, 600], [523, 200], [659, 400], [587, 200], [523, 200],
    [494, 400], [494, 200], [523, 200], [587, 400], [659, 400],
    [523, 400], [440, 400], [440, 400], [0, 400],
  ];

  /** Marks the theme as wanted and (re)starts it from the current position. */
  startMusic() {
    this.wantsMusic = true;
    if (this.muted || this.musicTimer !== null) return;
    this.scheduleNote();
  }

  private scheduleNote() {
    const [frequency, duration] = this.tetrisTheme[this.musicIndex];
    if (frequency > 0) this.playTone(frequency, duration / 1000, 'square', 0.11);

    this.musicIndex = (this.musicIndex + 1) % this.tetrisTheme.length;
    this.musicTimer = window.setTimeout(() => {
      this.musicTimer = null;
      if (this.wantsMusic && !this.muted) this.scheduleNote();
    }, duration);
  }

  /** Silences the theme but remembers the position and that it is wanted. */
  pauseMusic() {
    if (this.musicTimer === null) return;
    clearTimeout(this.musicTimer);
    this.musicTimer = null;
  }

  resumeMusic() {
    this.startMusic();
  }

  stopMusic() {
    this.wantsMusic = false;
    this.musicIndex = 0;
    this.pauseMusic();
  }

  toggleMute(): boolean {
    this.muted = !this.muted;

    if (this.muted) {
      this.pauseMusic();
    } else if (this.wantsMusic) {
      this.startMusic();
    }

    return this.muted;
  }
}

export const audio = new AudioController();