import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { ROMAN_NUMERALS } from '@utils/constants';

// TODO: Добавить визуальную подсветку октавы
@Component({
  selector: 'com-note-presenter',
  imports: [],
  templateUrl: './com-note-presenter.component.html',
  styleUrl: './com-note-presenter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[style.width]': 'width()',
    '[style.flexBasis]': 'width()',
    '[class.note-presenter--size-sm]': 'size() === "sm"',
    '[class.note-presenter--size-lg]': 'size() === "lg"',
  }
})
export class ComNotePresenter {
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
