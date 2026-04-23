

import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NoteColorsStyle } from '@services/note-colors/note-colors.types';


@Component({
  selector: 'com-note-color-presenter',
  imports: [],
  templateUrl: './com-note-color-presenter.component.html',
  styleUrl: './com-note-color-presenter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.note-presenter--has-octave-marker]': 'noteColor()?.octaveColor != null',
    '[style.--octave-marker-color]': 'noteColor()?.octaveColor',
    '[style.--note-color]': 'noteColor()?.noteColor',
    '[style.--text-color]': 'noteColor()?.textColor',
  }
})
export class ComNoteColorPresenter {
  public noteColor = input<NoteColorsStyle | null>(null);
}
