import { ChangeDetectionStrategy, Component, computed, inject, input, model } from '@angular/core';

import { ComNoteColorPresenter } from "@components/note-color-presenter/com-note-color-presenter.component";
import { ComNotePresenter } from '@components/note-presenter';
import { ComSelect, ComSelectContentSlot, ComSelectOption } from '@components/select';

import { ChordsService } from '@services/chords';
import { I18nService } from '@services/i18n';
import { NoteColorsService } from '@services/note-colors/note-colors.service';
import { NoteNamesManager } from '@services/note-names/note-names.service';
import { ScaleSteepsService } from '@services/scale-steps/scale-steps.service';
import { Note } from '@services/scale-steps/scale-steps.types';
import { OCTAVES } from '@utils/constants';
import { iterableRange, NoteHelper } from '@utils/helpers';

@Component({
  selector: 'wid-fretboard-string',
  imports: [ComSelect, ComNotePresenter, ComSelectContentSlot, ComNoteColorPresenter],
  templateUrl: './wid-fretboard-string.component.html',
  styleUrl: './wid-fretboard-string.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WidFretboardString {
  private readonly colorsManager = inject(NoteColorsService);
  private readonly scaleSteepsManager = inject(ScaleSteepsService);
  private readonly noteNamesManager = inject(NoteNamesManager);
  private readonly chords = inject(ChordsService);
  private readonly i18n = inject(I18nService);

  protected readonly octaveOptions = computed(() => this.i18n.translateOptions(OCTAVES));
  protected readonly notesOptions = this.noteNamesManager.noteNames;

  public startNote = model<Note>(Note.C);
  public startOctave = model<number>(0);

  public index = input<number>(0);
  public fretsCount = input(12);

  public noteWidth = input<number | ((fret: number) => number)>(60);

  protected frets = computed(() => [...iterableRange(1, this.fretsCount())]);

  protected getNote(fret = 0) {
    const startNote = this.startNote();
    return NoteHelper.getNoteIndex(startNote, fret);
  }

  protected getNoteName(fret = 0) {
    return this.noteNamesManager.getNoteName(this.getNote(fret));
  }

  protected getScaleStep(fret = 0) {
    const note = this.getNote(fret);
    return this.scaleSteepsManager.getScaleStep(note)?.stepNumber;
  }

  protected getNoteColor(fret = 0) {
    const note = this.getNote(fret)!;
    const scaleStep = this.scaleSteepsManager.getScaleStep(note)?.stepNumber;
    const octaveNumber = this.getOctaveNumber(fret);
    return this.colorsManager.getNoteColor(note, scaleStep, octaveNumber);
  }

  protected isChordNote(fret = 0) {
    return this.chords.isChordFret(this.index(), fret);
  }

  protected getOctave(fret = 0) {
    return `${this.getOctaveNumber(fret)}`;
  }

  protected getOctaveColor(fret: number) {
    return this.colorsManager.getOctaveColor(this.getOctaveNumber(fret));
  }

  protected getOctaveSelectStyle() {
    return this.colorsManager.getOctaveStyle(this.startOctave());
  }

  protected readonly getOctaveOptionStyle = (option: ComSelectOption<number>) => {
    return option.id != null ? this.colorsManager.getOctaveStyle(option.id) : null;
  };

  private getOctaveNumber(fret: number) {
    return Math.floor((this.startNote() + fret + 12 * this.startOctave()) / 12);
  }

  protected getFretWidth(fretNumber: number) {
    const width = this.noteWidth();
    return (typeof (width) === 'function') ? width(fretNumber) : width;
  }
}
