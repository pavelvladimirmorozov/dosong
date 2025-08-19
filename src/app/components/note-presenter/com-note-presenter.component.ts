import { Component, computed, inject, input } from '@angular/core';
import { NoteHelper } from '@utils/helpers';
import { Note } from '@utils/models';
import { ROMAN_NUMERALS } from '@utils/constants';
import { NoteNamesManager } from '@services/note-names-manager';

// TODO: Добавить визуальную подсветку октавы
@Component({
  selector: 'com-note-presenter',
  imports: [],
  templateUrl: './com-note-presenter.component.html',
  styleUrl: './com-note-presenter.component.scss',
  host: {
    '[style.width]': 'width()',
    '[style.flexBasis]': 'width()',
  }
})
export class ComNotePresenter {
  private readonly noteNamesManager = inject(NoteNamesManager);

  public note = input<Note>();
  public width = input<string>();
  public octave = input<string>();
  public scaleStep = input<number>();

  protected scaleStepForDisplay = computed(() => {
    const scaleStep = this.scaleStep();
    return scaleStep != null ? ROMAN_NUMERALS[scaleStep] : '';
  });

  protected noteName = computed(() => {
    return NoteHelper.getNoteName(this.note());
  });
}
