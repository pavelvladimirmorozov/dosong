import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { ComNoteColorPresenter } from "@components/note-color-presenter/com-note-color-presenter.component";
import { ComNotePresenter } from '@components/note-presenter/com-note-presenter.component';
import { ComSelect, ComSelectContentSlot } from '@components/select';
import { ComSwitch } from '@components/switch';

import { ChordsService } from '@services/chords';
import { TranslatePipe } from '@services/i18n';
import { LocalStorageService } from '@services/local-storage/local-storage.service';
import { NoteColorsService } from '@services/note-colors/note-colors.service';
import { NoteNamesManager } from '@services/note-names/note-names.service';
import { ScaleSteepsService } from '@services/scale-steps/scale-steps.service';
import { NoteHelper } from '@utils/helpers';
import { persistedSignal } from '@utils/helpers/persisted-signal';

interface DisplayedStep {
  interval: number | null;
}

@Component({
  selector: 'wid-gamma',
  imports: [
    ComSelect,
    ComNotePresenter,
    ComSelectContentSlot,
    TranslatePipe,
    ComNoteColorPresenter,
    ComSwitch
],
  templateUrl: './wid-gamma.component.html',
  styleUrl: './wid-gamma.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WidGamma {
  protected readonly colorsManager = inject(NoteColorsService);
  protected readonly scaleSteepsManager = inject(ScaleSteepsService);
  protected readonly noteNamesManager = inject(NoteNamesManager);
  private readonly chords = inject(ChordsService);
  private readonly storage = inject(LocalStorageService);

  protected readonly showAllNotes = persistedSignal<boolean>(this.storage, 'gamma-show-all-notes', false);

  protected selectedFormula = computed(() =>
    this.scaleSteepsManager.selectedScaleState().slice(1)
  );

  protected selectedFormulaFormatted = computed(() =>
    NoteHelper.formatSteps(this.selectedFormula())
  );

  protected displayedSteps = computed<DisplayedStep[]>(() => {
    if (this.showAllNotes()) {
      return Array.from({ length: 11 }, (_, i) => ({ interval: i + 1 }));
    }
    return this.selectedFormula();
  });

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

  protected isChordNote(toniOffset: number | null) {
    if (toniOffset == null) return false;
    return this.chords.highlightedNotes().has(this.getNote(toniOffset));
  }
}
