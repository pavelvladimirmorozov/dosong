import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { ComNotePresenter } from '@components/note-presenter/com-note-presenter.component';
import { ComSelect, ComSelectContentSlot } from '@components/select';

import { TranslatePipe } from '@services/i18n';
import { NoteColorsService } from '@services/note-colors/note-colors.service';
import { NoteNamesManager } from '@services/note-names/note-names.service';
import { ScaleSteepsService } from '@services/scale-steps/scale-steps.service';
import { NoteHelper } from '@utils/helpers';
import { ComNoteColorPresenter } from "@components/note-color-presenter/com-note-color-presenter.component";

@Component({
  selector: 'wid-gamma',
  imports: [
    ComSelect,
    ComNotePresenter,
    ComSelectContentSlot,
    TranslatePipe,
    ComNoteColorPresenter
],
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
    if(toniOffset == null) return '-';
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
