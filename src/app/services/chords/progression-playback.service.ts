import { computed, effect, inject, Injectable, signal } from '@angular/core';

import { MetronomeService } from '@services/metronome/metronome.service';

import { ChordsService } from './chords.service';

@Injectable({ providedIn: 'root' })
export class ProgressionPlaybackService {
  private readonly metronome = inject(MetronomeService);
  private readonly chords = inject(ChordsService);

  public readonly playbackActive = signal<boolean>(false);
  private playbackStartTick = 0;

  public readonly currentSlotIndex = computed<number>(() => {
    if (!this.playbackActive()) return -1;
    const progression = this.chords.activeProgression();
    if (!progression || progression.slots.length === 0) return -1;

    const totalBeats = progression.slots.reduce((sum, s) => sum + Math.max(1, s.beats), 0);
    if (totalBeats <= 0) return -1;

    const tick = this.metronome.tickIndex();
    const elapsed = tick - this.playbackStartTick;
    const within = ((elapsed % totalBeats) + totalBeats) % totalBeats;

    let acc = 0;
    for (let i = 0; i < progression.slots.length; i++) {
      acc += Math.max(1, progression.slots[i].beats);
      if (within < acc) return i;
    }
    return 0;
  });

  public readonly currentSlot = computed(() => {
    const idx = this.currentSlotIndex();
    if (idx < 0) return null;
    return this.chords.activeProgression()?.slots[idx] ?? null;
  });

  public readonly previousSlot = computed(() => {
    const progression = this.chords.activeProgression();
    if (!progression || progression.slots.length < 2) return null;
    const idx = this.currentSlotIndex();
    if (idx < 0) return null;
    const prevIdx = (idx - 1 + progression.slots.length) % progression.slots.length;
    return progression.slots[prevIdx] ?? null;
  });

  public readonly nextSlot = computed(() => {
    const progression = this.chords.activeProgression();
    if (!progression || progression.slots.length < 2) return null;
    const idx = this.currentSlotIndex();
    if (idx < 0) return null;
    const nextIdx = (idx + 1) % progression.slots.length;
    return progression.slots[nextIdx] ?? null;
  });

  constructor() {
    effect(() => {
      this.chords.playbackActive.set(this.playbackActive());
    });

    effect(() => {
      const slot = this.currentSlot();
      if (!this.playbackActive() || !slot) {
        this.chords.playbackChord.set(null);
        return;
      }
      this.chords.playbackChord.set(this.chords.buildChordFromSlot(slot));
      this.chords.selectedPositionId.set(slot.positionId);
    });

    effect(() => {
      if (!this.metronome.isRunning() && this.playbackActive()) {
        this.deactivate();
      }
    });
  }

  public start(): void {
    const progression = this.chords.activeProgression();
    if (!progression || progression.slots.length === 0) return;

    if (this.metronome.isRunning()) {
      this.playbackStartTick = this.metronome.tickIndex() + 1;
      this.playbackActive.set(true);
    } else {
      this.playbackStartTick = 0;
      this.playbackActive.set(true);
      this.metronome.start();
    }
  }

  public stop(): void {
    this.deactivate();
  }

  private deactivate(): void {
    this.playbackActive.set(false);
    this.chords.selectedPositionId.set(null);
    if (this.metronome.isRunning()) {
      this.metronome.stop();
    }
  }

  public toggle(): void {
    if (this.playbackActive()) this.stop();
    else this.start();
  }
}
