import { ChangeDetectionStrategy, Component, computed, inject, input, model } from '@angular/core';
import { iterableRange, NoteHelper } from '@utils/helpers';
import { OCTAVES } from '@utils/constants';

import { NoteColorsService } from '@services/note-colors/note-colors.service';

import { ComSelect, ComSelectContentSlot } from '@components/select';
import { ComNotePresenter } from '@components/note-presenter';
import { NoteNamesManager } from '@services/note-names/note-names.service';
import { ScaleSteepsService } from '@services/scale-steps/scale-steps.service';
import { Note } from '@services/scale-steps/scale-steps.types';

@Component({
  selector: 'wid-fretboard-string',
  imports: [ComSelect, ComNotePresenter, ComSelectContentSlot],
  templateUrl: './wid-fretboard-string.component.html',
  styleUrl: './wid-fretboard-string.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WidFretboardString {
  private readonly colorsManager = inject(NoteColorsService);
  private readonly scaleSteepsManager = inject(ScaleSteepsService);
  private readonly noteNamesManager = inject(NoteNamesManager);

  protected readonly octaveOptions = OCTAVES;
  protected readonly notesOptions = this.noteNamesManager.noteNames;

  public startNote = model<Note>(Note.C);
  public startOctave = model<number>(0);

  public index = input<number>(0);
  public fretsCount = input(12);

  public noteWidth = input<number | ((fret: number) => number)>(60);

  protected frets = computed(() => [...iterableRange(1, this.fretsCount())]);

  protected getNote(toniOffset: number = 0) {
    const startNote = this.startNote();
    return NoteHelper.getNoteIndex(startNote, toniOffset);
  }

  protected getNoteName(toniOffset: number = 0) {
    return this.noteNamesManager.getNoteName(this.getNote(toniOffset));
  }

  protected getScaleStep(toniOffset: number = 0) {
    const note = this.getNote(toniOffset);
    return this.scaleSteepsManager.getScaleStep(note)?.stepNumber;
  }

  protected getNoteColor(toniOffset: number = 0) {
    const note = this.getNote(toniOffset)!;
    const scaleStep = this.scaleSteepsManager.getScaleStep(note)?.stepNumber;
    return this.colorsManager.getNoteColor(note, scaleStep);
  }

  protected getOctave(fret: number) {
    const octave = Math.floor((this.startNote() + fret + 12 * this.startOctave()) / 12);
    return `${octave}`;
  }

  protected getFretWidth(fretNumber: number) {
    const width = this.noteWidth();
    return (typeof (width) === 'function') ? width(fretNumber) : width;
  }
}
