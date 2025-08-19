import { ChangeDetectionStrategy, Component, computed, inject, input, model } from '@angular/core';
import { Note } from '@utils/models';
import { ColorHelper, iterableRange, NoteHelper } from '@utils/helpers';
import { SHARP_NOTES, OCTAVES } from '@utils/constants';

import { NoteColorsManager } from '@services/note-colors-manager';
import { ScaleSteepsManager } from '@services/scale-steps-manager';

import { ComSelect, ComSelectContentSlot } from '@components/select';
import { ComNotePresenter } from '@components/note-presenter';

// TODOLow: Возможно стоит вернуть во внешний компонент
@Component({
  selector: 'wid-fretboard-string',
  imports: [ComSelect, ComNotePresenter, ComSelectContentSlot],
  templateUrl: './wid-fretboard-string.component.html',
  styleUrl: './wid-fretboard-string.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WidFretboardString {
  private readonly colorsManager = inject(NoteColorsManager);
  private readonly scaleSteepsManager = inject(ScaleSteepsManager);

  protected readonly octaveOptions = OCTAVES;
  protected readonly notesOptions = SHARP_NOTES;
  protected readonly countOptions = [{ id: 12, name: '12' }, { id: 24, name: '24' }];

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

  protected getScaleStep(toniOffset: number = 0) {
    const note = this.getNote(toniOffset);
    return this.scaleSteepsManager.getScaleStep(note);
  }

  protected getNoteColor(toniOffset: number = 0): { backgroundColor: string, color: string } {
    const note = this.getNote(toniOffset)!;
    const scaleStep = this.scaleSteepsManager.getScaleStep(note);
    const background = this.colorsManager.getNoteColor(note, scaleStep);
    // TODO: Передать бекграунд темы приложения вместо #686f8b
    const text = ColorHelper.colorIsDark(background, '#686f8b') ? 'white' : 'black';
    return { backgroundColor: background, color: text };
  }

  protected getFretWidth(fretNumber: number) {
    const width = this.noteWidth();
    return (typeof (width) === 'function') ? width(fretNumber) : width;
  }

  protected getOctave(fret: number) {
    const octave = Math.floor((this.startNote() + fret + 12 * this.startOctave()) / 12);
    return `${octave}`;
  }
}
