import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';

import { ComNoteColorPresenter } from "@components/note-color-presenter/com-note-color-presenter.component";
import { ComNotePresenter } from '@components/note-presenter/com-note-presenter.component';
import { ComSelect, ComSelectContentSlot } from '@components/select';
import { ComSwitch } from '@components/switch';

import { ChordsService, SongContextService } from '@services/chords';
import { I18nService, TranslatePipe } from '@services/i18n';
import { LocalStorageService } from '@services/local-storage/local-storage.service';
import { NoteColorsService } from '@services/note-colors/note-colors.service';
import { NoteNamesManager } from '@services/note-names/note-names.service';
import { ScaleSteepsService } from '@services/scale-steps/scale-steps.service';
import { Note, ScaleKind, ScaleQuality } from '@services/scale-steps/scale-steps.types';
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
  private readonly songContext = inject(SongContextService);
  private readonly storage = inject(LocalStorageService);
  private readonly i18n = inject(I18nService);

  protected readonly showAllNotes = persistedSignal<boolean>(this.storage, 'gamma-show-all-notes', false);

  // Локальные зеркала для селектов — позволяют визуально откатывать выбор при отказе подтверждения.
  protected readonly tonicViewValue = signal<Note>(this.scaleSteepsManager.selectedTonic());
  protected readonly qualityViewValue = signal(this.scaleSteepsManager.selectedQuality());
  protected readonly kindViewValue = signal(this.scaleSteepsManager.selectedKind());

  constructor() {
    effect(() => this.tonicViewValue.set(this.scaleSteepsManager.selectedTonic()));
    effect(() => this.qualityViewValue.set(this.scaleSteepsManager.selectedQuality()));
    effect(() => this.kindViewValue.set(this.scaleSteepsManager.selectedKind()));

    // Если у выбранного аккорда есть нота вне текущей гаммы — автоматически включаем «Отображать все ноты».
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
    // Зависим от языка, чтобы перевод обновлялся при его смене.
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

  protected async onTonicChange(value: Note | null): Promise<void> {
    if (value == null || value === this.scaleSteepsManager.selectedTonic()) return;
    this.tonicViewValue.set(value);
    const ok = await this.songContext.confirmTonalityChange();
    if (!ok) {
      this.tonicViewValue.set(this.scaleSteepsManager.selectedTonic());
      return;
    }
    this.scaleSteepsManager.selectedTonic.set(value);
  }

  protected async onQualityChange(value: ScaleQuality | null): Promise<void> {
    if (value == null || value === this.scaleSteepsManager.selectedQuality()) return;
    this.qualityViewValue.set(value);
    const ok = await this.songContext.confirmTonalityChange();
    if (!ok) {
      this.qualityViewValue.set(this.scaleSteepsManager.selectedQuality());
      return;
    }
    this.scaleSteepsManager.setQuality(value);
  }

  protected async onKindChange(value: ScaleKind | null): Promise<void> {
    if (value == null || value === this.scaleSteepsManager.selectedKind()) return;
    this.kindViewValue.set(value);
    const ok = await this.songContext.confirmTonalityChange();
    if (!ok) {
      this.kindViewValue.set(this.scaleSteepsManager.selectedKind());
      return;
    }
    this.scaleSteepsManager.setKind(value);
  }
}
