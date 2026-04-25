import { computed, effect, inject, Injectable, signal } from '@angular/core';

import { NoteColorsService } from '@services/note-colors/note-colors.service';
import { NoteColorsStyle } from '@services/note-colors/note-colors.types';
import { NoteNamesManager } from '@services/note-names/note-names.service';
import { ScaleSteepsService } from '@services/scale-steps/scale-steps.service';
import { Note, ScaleStepQuality } from '@services/scale-steps/scale-steps.types';
import { ROMAN_NUMERALS } from '@utils/constants';
import { NoteHelper } from '@utils/helpers';

import { CHORD_INTERVALS } from './chords.constants';
import { decorateChordName, qualitySuffix } from './chords.utils';

export interface DiatonicChord {
  root: Note;
  isMinor: boolean;
  name: string;
  numeral: string;
  stepNumber: number;
  type: ScaleStepQuality;
  notes: ReadonlySet<Note>;
  color: NoteColorsStyle;
}

@Injectable({ providedIn: 'root' })
export class ChordsService {
  private readonly scaleSteeps = inject(ScaleSteepsService);
  private readonly colors = inject(NoteColorsService);
  private readonly noteNames = inject(NoteNamesManager);

  public readonly diatonicChords = computed<DiatonicChord[]>(() => {
    const noteNames = this.noteNames.noteNames();
    const result: DiatonicChord[] = [];
    for (const step of this.scaleSteeps.selectedScaleState()) {
      const chord = this.buildChord(step.midiNote, step.interval, step.type, step.stepNumber, noteNames);
      if (chord) result.push(chord);
    }
    return result;
  });

  public readonly selectedChord = signal<DiatonicChord | null>(null);

  public readonly highlightedNotes = computed<ReadonlySet<Note>>(
    () => this.selectedChord()?.notes ?? new Set<Note>(),
  );

  constructor() {
    effect(() => {
      this.scaleSteeps.selectedTonic();
      this.scaleSteeps.selectedScale();
      this.selectedChord.set(null);
    });
  }

  public toggle(chord: DiatonicChord): void {
    const current = this.selectedChord();
    const same = current && current.root === chord.root && current.isMinor === chord.isMinor;
    this.selectedChord.set(same ? null : chord);
  }

  public isSelected(chord: DiatonicChord): boolean {
    const current = this.selectedChord();
    return current != null && current.root === chord.root && current.isMinor === chord.isMinor;
  }

  private buildChord(
    midiNote: Note | null,
    interval: number | null,
    type: ScaleStepQuality,
    stepNumber: number,
    noteNames: { name: string }[],
  ): DiatonicChord | null {
    if (midiNote == null || interval == null) return null;
    if (type === ScaleStepQuality.None || type === ScaleStepQuality.Any) return null;

    const intervals = CHORD_INTERVALS[type];
    if (intervals.length === 0) return null;

    const isMinor = type === ScaleStepQuality.Minor || type === ScaleStepQuality.Diminished;
    const baseName = noteNames[midiNote].name;

    return {
      root: midiNote,
      isMinor,
      name: decorateChordName(baseName, isMinor, type),
      numeral: ROMAN_NUMERALS[stepNumber] + qualitySuffix(type),
      stepNumber,
      type,
      notes: new Set(intervals.map(i => NoteHelper.getNoteIndex(midiNote, i))),
      color: this.colors.getNoteColor(midiNote, stepNumber),
    };
  }
}
