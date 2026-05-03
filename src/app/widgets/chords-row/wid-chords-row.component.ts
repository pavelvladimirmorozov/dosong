import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { ComButton } from '@components/button';
import { ComChevronDownIcon } from '@components/icons/com-chevron-down-icon.component';
import { ComNoteColorPresenter } from '@components/note-color-presenter/com-note-color-presenter.component';
import { ComNotePresenter } from '@components/note-presenter';
import { ComSelect } from '@components/select';
import { ComSelectOption } from '@components/select/com-select-option';
import { ComSpoiler } from '@components/spoiler';

import { ChordModifier, ChordsService, DiatonicChord, MODIFIER_OPTIONS, SLOT_BEATS_OPTIONS } from '@services/chords';
import { I18nService, TranslatePipe } from '@services/i18n';
import { NoteNamesManager } from '@services/note-names/note-names.service';
import { WidChordDiagram } from '@widgets/chord-diagram/wid-chord-diagram.component';

@Component({
  selector: 'wid-chords-row',
  imports: [ComNoteColorPresenter, ComNotePresenter, ComSelect, ComSpoiler, ComButton, TranslatePipe, ComChevronDownIcon, WidChordDiagram],
  templateUrl: './wid-chords-row.component.html',
  styleUrl: './wid-chords-row.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WidChordsRow {
  protected readonly chords = inject(ChordsService);
  private readonly noteNames = inject(NoteNamesManager);
  private readonly i18n = inject(I18nService);

  protected readonly hasActiveProgression = computed(() => this.chords.activeProgression() != null);

  protected readonly selectedChordNotes = computed(() => {
    const chord = this.chords.selectedChord();
    if (!chord) return '';
    const names = this.noteNames.noteNames();
    return [...chord.notes].map(n => names[n].name).join(' · ');
  });

  protected readonly modifierOptions = computed(() =>
    MODIFIER_OPTIONS.map(o => ({ ...o, name: this.i18n.t(o.name) })),
  );

  protected readonly beatsOptions: ComSelectOption<number>[] = SLOT_BEATS_OPTIONS.map(b => ({
    id: b,
    name: `${b}`,
  }));

  protected readonly positionOptions = computed(() => {
    const all = { id: null as string | null, name: this.i18n.t('chords.allNotes') };
    return [all, ...this.chords.availablePositions().map(p => ({ id: p.id as string | null, name: p.label }))];
  });

  protected readonly currentPositionIndex = computed(() => {
    const opts = this.positionOptions();
    const id = this.chords.selectedPositionId();
    return opts.findIndex(o => o.id === id);
  });

  protected readonly canGoPrev = computed(() => this.currentPositionIndex() > 0);
  protected readonly canGoNext = computed(() => {
    const idx = this.currentPositionIndex();
    return idx >= 0 && idx < this.positionOptions().length - 1;
  });

  protected trackChord(_index: number, chord: DiatonicChord): string {
    return `${chord.root}:${chord.type}`;
  }

  protected onModifierChange(value: ChordModifier | null): void {
    if (value == null) return;
    this.chords.setManualModifier(value);
  }

  protected onBeatsChange(value: number | null): void {
    if (value == null) return;
    this.chords.manualPickBeats.set(value);
  }

  protected addToProgression(): void {
    this.chords.addSelectedToProgression();
  }

  protected goPrev(): void {
    if (!this.canGoPrev()) return;
    const opts = this.positionOptions();
    this.chords.selectedPositionId.set(opts[this.currentPositionIndex() - 1].id);
  }

  protected goNext(): void {
    if (!this.canGoNext()) return;
    const opts = this.positionOptions();
    this.chords.selectedPositionId.set(opts[this.currentPositionIndex() + 1].id);
  }
}
