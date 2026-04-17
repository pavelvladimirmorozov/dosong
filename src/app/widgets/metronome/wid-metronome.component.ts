import { ChangeDetectionStrategy, Component, OnDestroy, model, signal, computed, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ComButton } from "@components/button";
import { ComSelect } from "@components/select";

import { BEATS } from '@services/audio-processor/audio-processor.constants';
import { Beat, BeatElement } from '@services/audio-processor/audio-processor.types';
import { iterableRange } from '@utils/helpers';

import { WidMetronomeBeatSelectComponent } from "./metronome-beat/wid-metronome-beat-select.component";

@Component({
  selector: 'wid-metronome',
  imports: [FormsModule, ComSelect, WidMetronomeBeatSelectComponent, ComButton],
  templateUrl: './wid-metronome.component.html',
  styleUrls: ['./wid-metronome.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WidMetronome implements OnDestroy {
  private audioContext: AudioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  private interval: ReturnType<typeof setInterval> | undefined;

  public bpm = model(120);
  public volume = model(70);
  public beatsPerMeasure = model(4);
  protected beatsPerMeasureOptions = [...iterableRange(1, 16)].map((num) => ({ id: num, name: `${num}` }));
  protected isRunning = signal(false);

  private currentBeat = signal(0);

  // Persistent sound selection per beat (survives beatsPerMeasure changes)
  private beatSounds = signal<Beat[]>(new Array(4).fill(BEATS[1]));
  // Which beat index is currently highlighted (-1 = none)
  private activeBeatIndex = signal<number>(-1);

  constructor() {
    // Resize beatSounds when beatsPerMeasure changes — preserve existing, add defaults for new
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
  }

  beatElements = computed<BeatElement[]>(() =>
    this.beatSounds().map((sound, i) => ({
      number: i + 1,
      isActive: this.activeBeatIndex() === i,
      sound,
    }))
  );

  public updateBeatSound(index: number, beat: Beat): void {
    this.beatSounds.update(prev => {
      const next = [...prev];
      next[index] = beat;
      return next;
    });
  }

  public ngOnDestroy(): void {
    this.stopMetronome();
  }

  public startMetronome(): void {
    if (this.isRunning()) return;

    this.isRunning.set(true);
    this.currentBeat.set(0);

    this.playBeat();

    const intervalMs = 60000 / this.bpm();
    this.interval = setInterval(() => this.playBeat(), intervalMs);
  }

  public stopMetronome(): void {
    if (!this.isRunning()) return;

    this.isRunning.set(false);
    clearInterval(this.interval);
    this.activeBeatIndex.set(-1);
  }

  private playBeat(): void {
    const idx = this.currentBeat();
    this.activeBeatIndex.set(idx);
    this.playSound(this.beatSounds()[idx]);
    this.currentBeat.set((idx + 1) % this.beatsPerMeasure());
  }

  private playSound(beat: Beat): void {
    const gainNode = this.audioContext.createGain();
    gainNode.gain.value = this.volume() / 100;
    gainNode.connect(this.audioContext.destination);

    const oscillator = this.audioContext.createOscillator();
    oscillator.type = beat.type;
    oscillator.frequency.value = beat.frequency;
    oscillator.connect(gainNode);

    oscillator.start();
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + beat.duration);
    oscillator.stop(this.audioContext.currentTime + beat.duration);
  }
}
