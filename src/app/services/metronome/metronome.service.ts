import { computed, effect, Injectable, signal } from '@angular/core';

import { BEATS } from '@services/audio-processor/audio-processor.constants';
import { Beat, BeatElement } from '@services/audio-processor/audio-processor.types';
import { clamp } from '@utils/helpers';

export const BPM_MIN = 40;
export const BPM_MAX = 300;

@Injectable({ providedIn: 'root' })
export class MetronomeService {
  public readonly bpm = signal(120);
  public readonly volume = signal(70);
  public readonly beatsPerMeasure = signal(4);

  public readonly isRunning = signal(false);
  public readonly indicatorVisible = signal(false);

  public readonly rampEnabled = signal(false);
  public readonly rampDeltaBpm = signal(5);
  public readonly rampEveryMeasures = signal(4);
  public readonly rampTargetBpm = signal<number | null>(null);

  private readonly beatSounds = signal<Beat[]>(new Array(4).fill(BEATS[1]));
  private readonly activeBeatIndexSignal = signal<number>(-1);
  private measuresSincePlayed = 0;

  public readonly activeBeatIndex = this.activeBeatIndexSignal.asReadonly();
  public readonly beatElements = computed<BeatElement[]>(() =>
    this.beatSounds().map((sound, i) => ({
      number: i + 1,
      isActive: this.activeBeatIndexSignal() === i,
      sound,
    })),
  );

  private audioContext: AudioContext | null = null;
  private timeoutId: ReturnType<typeof setTimeout> | null = null;
  private currentBeat = 0;

  constructor() {
    effect(() => {
      const count = this.beatsPerMeasure();
      this.beatSounds.update(prev => {
        if (prev.length === count) return prev;
        if (prev.length < count) {
          return [...prev, ...new Array(count - prev.length).fill(BEATS[1])];
        }
        return prev.slice(0, count);
      });
    });

    // При старте показываем плавающий индикатор автоматически
    effect(() => {
      if (this.isRunning()) {
        this.indicatorVisible.set(true);
      }
    });
  }

  public getBeatSound(index: number): Beat {
    return this.beatSounds()[index] ?? BEATS[1];
  }

  public updateBeatSound(index: number, beat: Beat): void {
    this.beatSounds.update(prev => {
      const next = [...prev];
      next[index] = beat;
      return next;
    });
  }

  public setBpm(value: number): void {
    this.bpm.set(clamp(Math.round(value), BPM_MIN, BPM_MAX));
  }

  public start(): void {
    if (this.isRunning()) return;
    this.ensureAudioContext();
    this.isRunning.set(true);
    this.currentBeat = 0;
    this.measuresSincePlayed = 0;
    this.playBeat();
    this.scheduleNext();
  }

  public stop(): void {
    this.clearTimer();
    this.isRunning.set(false);
    this.activeBeatIndexSignal.set(-1);
    this.currentBeat = 0;
    this.measuresSincePlayed = 0;
  }

  public toggle(): void {
    if (this.isRunning()) this.stop();
    else this.start();
  }

  public closeIndicator(): void {
    this.stop();
    this.indicatorVisible.set(false);
  }

  private scheduleNext(): void {
    this.clearTimer();
    const intervalMs = 60_000 / this.bpm();
    this.timeoutId = setTimeout(() => {
      if (!this.isRunning()) return;
      this.playBeat();
      this.scheduleNext();
    }, intervalMs);
  }

  private playBeat(): void {
    const total = this.beatsPerMeasure();
    const idx = this.currentBeat % total;
    this.activeBeatIndexSignal.set(idx);
    this.playSound(this.beatSounds()[idx]);

    const isLastBeatInMeasure = idx === total - 1;
    this.currentBeat = (idx + 1) % total;

    if (isLastBeatInMeasure) {
      this.onMeasureFinished();
    }
  }

  private onMeasureFinished(): void {
    if (!this.rampEnabled()) return;

    this.measuresSincePlayed += 1;
    const period = clamp(Math.round(this.rampEveryMeasures()), 1);
    if (this.measuresSincePlayed < period) return;

    this.measuresSincePlayed = 0;

    const delta = Math.round(this.rampDeltaBpm());
    if (delta === 0) return;

    const target = this.rampTargetBpm();
    const current = this.bpm();
    let next = current + delta;

    if (target !== null) {
      if ((delta > 0 && current >= target) || (delta < 0 && current <= target)) {
        return;
      }
      if ((delta > 0 && next > target) || (delta < 0 && next < target)) {
        next = target;
      }
    }

    this.setBpm(next);
  }

  private playSound(beat: Beat): void {
    if (!this.audioContext || beat.frequency === 0 || beat.duration === 0) return;

    const gain = this.audioContext.createGain();
    gain.gain.value = this.volume() / 100;
    gain.connect(this.audioContext.destination);

    const oscillator = this.audioContext.createOscillator();
    oscillator.type = beat.type;
    oscillator.frequency.value = beat.frequency;
    oscillator.connect(gain);

    oscillator.start();
    gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + beat.duration);
    oscillator.stop(this.audioContext.currentTime + beat.duration);
  }

  private ensureAudioContext(): void {
    if (this.audioContext) return;
    const Ctx = window.AudioContext
      || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.audioContext = new Ctx();
  }

  private clearTimer(): void {
    if (this.timeoutId !== null) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }
}
