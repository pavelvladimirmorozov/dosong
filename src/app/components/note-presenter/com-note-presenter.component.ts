import { Component, computed, inject, input } from '@angular/core';
import { ROMAN_NUMERALS } from '@utils/constants';
import { NoteNamesManager } from '@services/note-names/note-names.service';

// TODO: Добавить визуальную подсветку октавы
@Component({
  selector: 'com-note-presenter',
  imports: [],
  templateUrl: './com-note-presenter.component.html',
  styleUrl: './com-note-presenter.component.scss',
  host: {
    '[style.width]': 'width()',
    '[style.flexBasis]': 'width()',
    '[class.size-sm]': 'size() === "sm"',
    '[class.size-lg]': 'size() === "lg"',
  }
})
export class ComNotePresenter {
  private readonly noteNamesManager = inject(NoteNamesManager);

  public noteName = input<string>();
  public width = input<string>();
  public octave = input<string>();
  public scaleStep = input<number>();
  /** Визуальный размер: 'sm' — сосед в тюнере, 'md' — дефолт (гриф), 'lg' — акцент */
  public size = input<'sm' | 'md' | 'lg'>('md');

  protected scaleStepForDisplay = computed(() => {
    const scaleStep = this.scaleStep();
    return scaleStep != null ? ROMAN_NUMERALS[scaleStep] : '';
  });

}
