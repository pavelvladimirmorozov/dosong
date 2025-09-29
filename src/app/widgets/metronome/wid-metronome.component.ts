import { Component, OnDestroy, model, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { iterableFilledArray, iterableRange } from '@utils/helpers';

import { ComSelect } from "@components/select";

import { WidMetronomeBeatSelectComponent } from "./metronome-beat/wid-metronome-beat-select.component";
import { BEATS } from '@services/audio-processor/audio-processor.constants';
import { Beat, BeatElement } from '@services/audio-processor/audio-processor.types';

@Component({
  selector: 'wid-metronome',
  imports: [FormsModule, ComSelect, WidMetronomeBeatSelectComponent],
  templateUrl: './wid-metronome.component.html',
  styleUrls: ['./wid-metronome.component.scss']
})
export class WidMetronome implements OnDestroy {
  private audioContext: AudioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  private interval: any;

  public bpm = model(120);
  public volume = model(70);
  public beatsPerMeasure = model(4);
  protected beatsPerMeasureOptions = [...iterableRange(1, 16)].map((num) => ({ id: num, name: `${num}` }));
  protected isRunning = signal(false);

  private currentBeat = signal(0);

  // Элементы визуализации
  beatElements = computed(() =>
    [...iterableFilledArray(this.beatsPerMeasure() - 1)].
      map<BeatElement>((_, i) => ({
        number: i + 1,
        isActive: false,
        sound: BEATS[1],
      })));

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
    this.beatElements().forEach(beat => beat.isActive = false);
  }

  private playBeat(): void {
    // Сброс активности всех долей
    this.beatElements().forEach(beat => beat.isActive = false);
    const currentBeatElement = this.beatElements()[this.currentBeat()];
    // Установка активности текущей доли
    currentBeatElement.isActive = true;
    // Воспроизведение звука
    this.playSound(currentBeatElement.sound);
    // Переход к следующей доле
    this.currentBeat.set((this.currentBeat() + 1) % this.beatsPerMeasure());
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