import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NoteHelper } from '@utils/helpers';

import { NoteColorsService } from '@services/note-colors/note-colors.service';
import { NoteNamesManager } from '@services/note-names/note-names.service';
import { ScaleSteepsService } from '@services/scale-steps/scale-steps.service';

import { ComSelect, ComSelectContentSlot } from '@components/select';
import { ComNotePresenter } from '@components/note-presenter/com-note-presenter.component';
import { 
  ComStaticMulticolorIcon, 
  ComStaticSinglecolorIcon, 
  ComDynamicMulticolorIcon, 
  ComDynamicSinglecolorIcon 
} from '@components/icons';

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
  protected readonly colorsManager = inject(NoteColorsService);
  protected readonly scaleSteepsManager = inject(ScaleSteepsService);
  protected readonly noteNamesManager = inject(NoteNamesManager);

  protected selectedFormula = computed(() =>
    this.scaleSteepsManager.selectedScaleState().slice(1)
  );

  protected selectedFormulaFormatted = computed(() =>
    NoteHelper.formatSteps(this.selectedFormula())
  );

  protected getNoteName(toniOffset: number | null) {
    if(toniOffset == null) return '?';
    return this.noteNamesManager.getNoteName(this.getNote(toniOffset));
  }

  protected getNote(toniOffset: number) {
    return NoteHelper.getNoteIndex(this.scaleSteepsManager.selectedTonic(), toniOffset);
  }

  protected getNoteColor(toniOffset: number | null) {
    if (toniOffset == null) return this.colorsManager.getTransparentNoteColor();
    
    const note = this.getNote(toniOffset)!;
    const scaleStep = this.scaleSteepsManager.getScaleStep(note);
    return this.colorsManager.getNoteColor(note, scaleStep?.stepNumber);
  }

  protected getScaleStep(toniOffset: number | null = 0) {
    if (toniOffset == null) return -1;
    const note = NoteHelper.getNoteIndex(this.scaleSteepsManager.selectedTonic(), toniOffset);
    return this.scaleSteepsManager.getScaleStep(note)?.stepNumber;
  }
}
