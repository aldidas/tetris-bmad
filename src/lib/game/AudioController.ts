export class AudioController {
  private audioContext: AudioContext | null = null;
  muted: boolean = false;
  private musicInterval: number | null = null;
  private musicPlaying: boolean = false;

  constructor() {
    // Initialize AudioContext on first user interaction (browser requirement)
    if (typeof window !== 'undefined') {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  private playTone(frequency: number, duration: number, type: OscillatorType = 'square', volume: number = 0.3) {
    if (this.muted || !this.audioContext) return;

    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.type = type;
      oscillator.frequency.value = frequency;

      // Envelope: quick attack, sustain, quick release
      const now = this.audioContext.currentTime;
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(volume, now + 0.01); // Attack
      gainNode.gain.linearRampToValueAtTime(volume, now + duration - 0.01); // Sustain
      gainNode.gain.linearRampToValueAtTime(0, now + duration); // Release

      oscillator.start(now);
      oscillator.stop(now + duration);
    } catch (e) {
      console.warn('Audio playback failed:', e);
    }
  }

  play(sound: string) {
    if (this.muted || !this.audioContext) return;

    // Resume audio context on first play (browser autoplay policy)
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }

    switch (sound) {
      case 'move':
        // Quick blip
        this.playTone(800, 0.05, 'square');
        break;
      case 'rotate':
        // Double beep
        this.playTone(600, 0.05, 'square');
        setTimeout(() => this.playTone(800, 0.05, 'square'), 50);
        break;
      case 'drop':
        // Low thud
        this.playTone(200, 0.1, 'square');
        break;
      case 'clear':
        // Ascending chime
        this.playTone(523, 0.1, 'sine'); // C
        setTimeout(() => this.playTone(659, 0.1, 'sine'), 100); // E
        setTimeout(() => this.playTone(784, 0.15, 'sine'), 200); // G
        break;
      case 'gameover':
        // Descending sad tone
        this.playTone(400, 0.2, 'square');
        setTimeout(() => this.playTone(300, 0.2, 'square'), 200);
        setTimeout(() => this.playTone(200, 0.3, 'square'), 400);
        break;
    }
  }

  // Tetris Theme (Korobeiniki) - Simplified melody
  private tetrisTheme = [
    // Note format: [frequency (Hz), duration (ms)]
    // Main melody
    [659, 400], [494, 200], [523, 200], [587, 400], [523, 200], [494, 200],
    [440, 400], [440, 200], [523, 200], [659, 400], [587, 200], [523, 200],
    [494, 600], [523, 200], [587, 400], [659, 400],
    [523, 400], [440, 400], [440, 400], [0, 400], // Rest
    
    [587, 400], [698, 200], [880, 400], [784, 200], [698, 200],
    [659, 600], [523, 200], [659, 400], [587, 200], [523, 200],
    [494, 400], [494, 200], [523, 200], [587, 400], [659, 400],
    [523, 400], [440, 400], [440, 400], [0, 400], // Rest
  ];

  startMusic() {
    if (this.musicPlaying || !this.audioContext) return;
    
    // Resume audio context
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }

    this.musicPlaying = true;
    this.playMusicLoop();
  }

  private playMusicLoop() {
    if (!this.musicPlaying || this.muted) return;

    let index = 0;
    const playNextNote = () => {
      if (!this.musicPlaying || this.muted) return;

      const [frequency, duration] = this.tetrisTheme[index];
      
      if (frequency > 0) {
        this.playTone(frequency, duration / 1000, 'square', 0.15); // Lower volume for bg music
      }

      index++;
      if (index >= this.tetrisTheme.length) {
        index = 0; // Loop
      }

      this.musicInterval = window.setTimeout(playNextNote, duration);
    };

    playNextNote();
  }

  stopMusic() {
    this.musicPlaying = false;
    if (this.musicInterval) {
      clearTimeout(this.musicInterval);
      this.musicInterval = null;
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    if (this.muted) {
      this.stopMusic();
    } else if (!this.musicPlaying) {
      this.startMusic();
    }
    return this.muted;
  }
}

export const audio = new AudioController();
