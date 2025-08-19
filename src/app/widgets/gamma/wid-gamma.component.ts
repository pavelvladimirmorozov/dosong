import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ColorHelper, NoteHelper } from '@utils/helpers';
import { TRANSPARENT_NOTE_COLOR } from '@utils/constants';

import { NoteColorsManager } from '@services/note-colors-manager';
import { ScaleSteepsManager } from '@services/scale-steps-manager';

import { 
  ComStaticMulticolorIcon, 
  ComStaticSinglecolorIcon, 
  ComDynamicMulticolorIcon, 
  ComDynamicSinglecolorIcon 
} from '@components/icons';
import { ComSelect, ComSelectContentSlot } from '@components/select';
import { ComNotePresenter } from '@components/note-presenter/com-note-presenter.component';

@Component({
  selector: 'wid-gamma',
  imports: [
    ComSelect,
    ComNotePresenter,
    ComSelectContentSlot,
    ComStaticMulticolorIcon,
    ComStaticSinglecolorIcon,
    ComDynamicMulticolorIcon,
    ComDynamicSinglecolorIcon,
    FormsModule],
  templateUrl: './wid-gamma.component.html',
  styleUrl: './wid-gamma.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WidGamma {
  protected readonly colorsManager = inject(NoteColorsManager);
  protected readonly scaleSteepsManager = inject(ScaleSteepsManager);

  protected selectedFormula = computed(() =>
    this.scaleSteepsManager.selectedScaleSteps().slice(1)
  );

  protected selectedFormulaFormatted = computed(() =>
    NoteHelper.formatSteps(this.selectedFormula())
  );

  protected getNote(toniOffset: number | null) {
    if (toniOffset == null) return undefined;
    return NoteHelper.getNoteIndex(this.scaleSteepsManager.selectedTonic(), toniOffset);
  }

  protected getNoteColor(toniOffset: number | null): { backgroundColor: string, color: string } {
    if (toniOffset == null) {
      const background = NoteHelper.mergeColorWithOpacity(TRANSPARENT_NOTE_COLOR, 0);
      // TODO: Передать бекграунд темы приложения вместо #686f8b
      const text = ColorHelper.colorIsDark(background, '#686f8b') ? 'white' : 'black';
      return { backgroundColor: background, color: text };
    }
    const note = this.getNote(toniOffset)!;
    const scaleStep = this.scaleSteepsManager.getScaleStep(note);
    const background = this.colorsManager.getNoteColor(note, scaleStep);
    // TODO: Передать бекграунд темы приложения вместо #686f8b
    const text = ColorHelper.colorIsDark(background, '#686f8b') ? 'white' : 'black';
    return { backgroundColor: background, color: text };
  }

  protected getScaleStep(toniOffset: number | null = 0) {
    if (toniOffset == null) return -1;
    const note = NoteHelper.getNoteIndex(this.scaleSteepsManager.selectedTonic(), toniOffset);
    return this.scaleSteepsManager.getScaleStep(note);
  }
}
