import { Component, computed, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';

import { CustomAudioProcessor } from '@services/audio-processor/custom-audio-processor';
import { ComNotePresenter } from '@components/note-presenter/com-note-presenter.component';
import { ComButton } from '@components/button/com-button.component';

@Component({
  selector: 'com-tuner',
  imports: [DecimalPipe, ComNotePresenter, ComButton],
  templateUrl: './com-tuner.component.html',
  styleUrl: './com-tuner.component.scss'
})
export class ComTuner {
  processor = inject(CustomAudioProcessor);

  private readonly noteStrings = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

  volumePercent = computed(() => Math.min(100, this.processor.currentVolume() * 500));

  centsDisplay = computed(() => {
    const c = this.processor.currentCents();
    return (c > 0 ? '+' : '') + c + '¢';
  });

  // Октава из MIDI-номера: C4 = MIDI 60 → floor(60/12) - 1 = 4
  currentOctave = computed(() => Math.floor(this.processor.currentMidiNote() / 12) - 1);

  private prevMidi = computed(() => this.processor.currentMidiNote() - 1);
  private nextMidi = computed(() => this.processor.currentMidiNote() + 1);

  prevNoteName = computed(() => {
    if (!this.processor.currentMidiNote()) return '—';
    return this.noteStrings[((this.prevMidi() % 12) + 12) % 12];
  });

  nextNoteName = computed(() => {
    if (!this.processor.currentMidiNote()) return '—';
    return this.noteStrings[this.nextMidi() % 12];
  });

  prevOctave = computed(() => (Math.floor(this.prevMidi() / 12) - 1).toString());
  nextOctave = computed(() => (Math.floor(this.nextMidi() / 12) - 1).toString());
}
