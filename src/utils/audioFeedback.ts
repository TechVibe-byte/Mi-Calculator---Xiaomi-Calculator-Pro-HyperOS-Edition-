// Xiaomi MIUI / HyperOS tactile audio and vibration feedback

class FeedbackEngine {
  private audioCtx: AudioContext | null = null;
  private soundEnabled: boolean = true;
  private vibrationEnabled: boolean = true;

  constructor() {
    // Lazy initialized on first user gesture
  }

  public setConfig(sound: boolean, vibration: boolean) {
    this.soundEnabled = sound;
    this.vibrationEnabled = vibration;
  }

  private initAudio() {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
  }

  public playKeyClick(type: 'number' | 'operator' | 'action' | 'equals' = 'number') {
    if (this.vibrationEnabled && typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        if (type === 'equals') {
          navigator.vibrate(18);
        } else if (type === 'operator') {
          navigator.vibrate(12);
        } else {
          navigator.vibrate(6);
        }
      } catch {
        // Ignore vibration errors if blocked
      }
    }

    if (!this.soundEnabled) return;

    try {
      this.initAudio();
      if (!this.audioCtx) return;
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      const now = this.audioCtx.currentTime;

      let freq = 1200;
      let duration = 0.025;
      let vol = 0.08;

      if (type === 'operator') {
        freq = 1500;
        vol = 0.1;
      } else if (type === 'action') {
        freq = 900;
        vol = 0.09;
      } else if (type === 'equals') {
        freq = 1800;
        duration = 0.04;
        vol = 0.12;
      }

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.4, now + duration);

      gain.gain.setValueAtTime(vol, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + duration);
    } catch {
      // Audio playback fails gracefully if not permitted
    }
  }
}

export const feedback = new FeedbackEngine();
