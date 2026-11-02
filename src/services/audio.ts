/**
 * Audio Synthesizer for Mystery Room using Web Audio API
 * Features tactile clicks, locks, chimes, tension ticks, and a full Cozy Mystery Music Loop
 */

class SoundController {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  // Background Music state
  private isMusicPlaying: boolean = false;
  private musicIntervalId: NodeJS.Timeout | null = null;
  private musicVolumeNode: GainNode | null = null;
  private musicVolume: number = 0.22;
  private currentStep: number = 0;

  constructor() {
    // AudioContext will be initialized on first user interaction
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted && this.musicVolumeNode && this.ctx) {
      this.musicVolumeNode.gain.setValueAtTime(0, this.ctx.currentTime);
    } else if (!muted && this.musicVolumeNode && this.ctx && this.isMusicPlaying) {
      this.musicVolumeNode.gain.setValueAtTime(this.musicVolume, this.ctx.currentTime);
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public getIsMusicPlaying(): boolean {
    return this.isMusicPlaying;
  }

  // Tactile button click / gear notch
  public playClick() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.04);

    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }

  // Safe dial click
  public playDialTick() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(540, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(140, this.ctx.currentTime + 0.03);

    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.03);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.035);
  }

  // Tension timer tick
  public playTimerTick() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(440, this.ctx.currentTime + 0.02);

    gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.02);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.025);
  }

  // Hint revealed chime
  public playHintReveal() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const notes = [440, 554.37, 659.25]; // A major arpeggio
    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx!.currentTime + idx * 0.08);

      gain.gain.setValueAtTime(0.08, this.ctx!.currentTime + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx!.currentTime + idx * 0.08 + 0.3);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(this.ctx!.currentTime + idx * 0.08);
      osc.stop(this.ctx!.currentTime + idx * 0.08 + 0.35);
    });
  }

  // Correct answer & triumph chime
  public playSuccess() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx!.currentTime + idx * 0.09);

      gain.gain.setValueAtTime(0.12, this.ctx!.currentTime + idx * 0.09);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx!.currentTime + idx * 0.09 + 0.6);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(this.ctx!.currentTime + idx * 0.09);
      osc.stop(this.ctx!.currentTime + idx * 0.09 + 0.65);
    });
  }

  // Wrong guess buzz
  public playWrong() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(130, this.ctx.currentTime);
    osc.frequency.setValueAtTime(110, this.ctx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.28);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.3);
  }

  // Exit game sound
  public playDoorClose() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(180, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(50, this.ctx.currentTime + 0.3);

    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.38);
  }

  // ==========================================
  // Cozy Mystery Background Music Engine
  // Whimsical celesta, warm chords & music box
  // ==========================================

  // Melodic pitch map (Hz)
  private readonly NOTE_FREQS: Record<string, number> = {
    B2: 123.47,
    C3: 130.81,
    E3: 164.81,
    G3: 196.0,
    A3: 220.0,
    B3: 246.94,
    C4: 261.63,
    D4: 293.66,
    E4: 329.63,
    Fs4: 369.99,
    G4: 392.0,
    A4: 440.0,
    B4: 493.88,
    C5: 523.25,
    D5: 587.33,
    E5: 659.25,
    G5: 783.99,
  };

  // 16-bar Cozy Mystery Arpeggiated Melody
  private readonly MELODY_PATTERN = [
    // Phrase 1: Em9 mystery
    { note: 'E4', bass: 'E3', dur: 0.3 },
    { note: 'G4', dur: 0.2 },
    { note: 'B4', dur: 0.3 },
    { note: 'E5', dur: 0.35 },
    { note: 'D5', bass: 'G3', dur: 0.25 },
    { note: 'B4', dur: 0.2 },
    { note: 'G4', dur: 0.25 },
    { note: 'E4', dur: 0.3 },

    // Phrase 2: Cmaj7 cozy nostalgia
    { note: 'C4', bass: 'C3', dur: 0.3 },
    { note: 'E4', dur: 0.2 },
    { note: 'G4', dur: 0.3 },
    { note: 'B4', dur: 0.35 },
    { note: 'C5', bass: 'E3', dur: 0.25 },
    { note: 'B4', dur: 0.2 },
    { note: 'G4', dur: 0.25 },
    { note: 'E4', dur: 0.3 },

    // Phrase 3: Am9 soft detective thought
    { note: 'A3', bass: 'A3', dur: 0.3 },
    { note: 'C4', dur: 0.2 },
    { note: 'E4', dur: 0.3 },
    { note: 'A4', dur: 0.35 },
    { note: 'G4', bass: 'C3', dur: 0.25 },
    { note: 'E4', dur: 0.2 },
    { note: 'D4', dur: 0.25 },
    { note: 'C4', dur: 0.3 },

    // Phrase 4: B7sus4 tension resolver
    { note: 'B3', bass: 'B2', dur: 0.3 },
    { note: 'Fs4', dur: 0.2 },
    { note: 'A4', dur: 0.3 },
    { note: 'B4', dur: 0.35 },
    { note: 'A4', bass: 'Fs4', dur: 0.25 },
    { note: 'G4', dur: 0.2 },
    { note: 'Fs4', dur: 0.25 },
    { note: 'D4', dur: 0.3 },
  ];

  private playTone(freq: number, duration: number, isBass: boolean = false) {
    if (!this.ctx || this.isMuted) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      if (isBass) {
        osc.type = 'triangle';
        gain.gain.setValueAtTime(0.04 * this.musicVolume, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration * 2.5);
      } else {
        // Celesta / music box bell character: sine with smooth bell envelope
        osc.type = 'sine';
        gain.gain.setValueAtTime(0.06 * this.musicVolume, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration * 1.8);
      }

      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      osc.connect(gain);
      if (this.musicVolumeNode) {
        gain.connect(this.musicVolumeNode);
      } else {
        gain.connect(this.ctx.destination);
      }

      osc.start();
      osc.stop(this.ctx.currentTime + duration * 2.2);
    } catch {
      // Audio node cleanup
    }
  }

  public startMusic() {
    if (this.isMusicPlaying) return;
    this.initContext();
    if (!this.ctx) return;

    this.isMusicPlaying = true;
    this.currentStep = 0;

    // Master volume node for music
    this.musicVolumeNode = this.ctx.createGain();
    this.musicVolumeNode.gain.setValueAtTime(
      this.isMuted ? 0 : this.musicVolume,
      this.ctx.currentTime
    );
    this.musicVolumeNode.connect(this.ctx.destination);

    // 240ms per step gives approx 125 eighth-notes/min (relaxing mystery pace)
    const stepDurationMs = 280;

    this.musicIntervalId = setInterval(() => {
      if (!this.isMusicPlaying || !this.ctx) return;

      const step = this.MELODY_PATTERN[this.currentStep];
      if (step) {
        // Play melodic bell note
        const melodyFreq = this.NOTE_FREQS[step.note];
        if (melodyFreq) {
          this.playTone(melodyFreq, step.dur, false);
        }

        // Play bass note on chord roots
        if (step.bass) {
          const bassFreq = this.NOTE_FREQS[step.bass];
          if (bassFreq) {
            this.playTone(bassFreq, step.dur * 1.5, true);
          }
        }
      }

      this.currentStep = (this.currentStep + 1) % this.MELODY_PATTERN.length;
    }, stepDurationMs);
  }

  public stopMusic() {
    this.isMusicPlaying = false;
    if (this.musicIntervalId) {
      clearInterval(this.musicIntervalId);
      this.musicIntervalId = null;
    }
    if (this.musicVolumeNode && this.ctx) {
      try {
        this.musicVolumeNode.disconnect();
      } catch {
        // Ignore
      }
      this.musicVolumeNode = null;
    }
  }

  public toggleMusic(): boolean {
    if (this.isMusicPlaying) {
      this.stopMusic();
      return false;
    } else {
      this.startMusic();
      return true;
    }
  }
}

export const sound = new SoundController();
