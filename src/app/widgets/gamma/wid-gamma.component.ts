import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';

import { ComNoteColorPresenter } from '@components/note-color-presenter/com-note-color-presenter.component';
import { ComNotePresenter } from '@components/note-presenter/com-note-presenter.component';
import { ComSwitch } from '@components/switch';

import { ChordsService } from '@services/chords';
import { I18nService, TranslatePipe } from '@services/i18n';
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
    ComNoteColorPresenter,
    ComNotePresenter,
    ComSwitch,
    TranslatePipe,
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
  private readonly i18n = inject(I18nService);

  protected readonly showAllNotes = persistedSignal<boolean>(this.storage, 'gamma-show-all-notes', false);

  constructor() {
    effect(() => {
      const chord = this.chords.selectedChord();
      if (!chord) return;
      const hasForeign = [...chord.notes].some(note =>
        this.scaleSteepsManager.getScaleStep(note) == null
      );
      if (hasForeign && !this.showAllNotes()) {
        this.showAllNotes.set(true);
      }
    });
  }

  protected selectedFormula = computed(() =>
    this.scaleSteepsManager.selectedScaleState().slice(1)
  );

  protected selectedFormulaFormatted = computed(() => {
    this.i18n.language();
    return NoteHelper.stepIntervals(this.selectedFormula()).map(semitones => this.formatStep(semitones));
  });

  private formatStep(semitones: number): string {
    return this.i18n.t(`gamma.semitone.${semitones}`);
  }

  protected displayedSteps = computed<DisplayedStep[]>(() => {
    if (this.showAllNotes()) {
      return Array.from({ length: 11 }, (_, i) => ({ interval: i + 1 }));
    }
    return this.selectedFormula();
  });

  protected getNoteName(toniOffset: number | null) {
    if (toniOffset == null) return '-';
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
