import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';

import { ComChevronDownIcon } from '@components/icons/com-chevron-down-icon.component';
import { ComCloseIcon } from '@components/icons/com-close-icon.component';
import { ComNoteColorPresenter } from '@components/note-color-presenter/com-note-color-presenter.component';
import { ComSelect } from '@components/select';
import { ComSelectOption } from '@components/select/com-select-option';

import { ChordsService, ProgressionSlot, SLOT_BEATS_OPTIONS } from '@services/chords';
import { TranslatePipe } from '@services/i18n';

@Component({
  selector: 'wid-chord-progression-slot',
  imports: [ComNoteColorPresenter, ComSelect, ComChevronDownIcon, ComCloseIcon, TranslatePipe],
  templateUrl: './wid-chord-progression-slot.component.html',
  styleUrl: './wid-chord-progression-slot.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.wid-chord-progression-slot--current]': 'isCurrent()',
  },
})
export class WidChordProgressionSlot {
  private readonly chords = inject(ChordsService);

  public readonly slot = input.required<ProgressionSlot>();
  public readonly isCurrent = input<boolean>(false);

  protected readonly chord = computed(() => this.chords.buildChordFromSlot(this.slot()));
  protected readonly isEmpty = computed(() => this.slot().root == null);

  protected readonly beatsOptions: ComSelectOption<number>[] = SLOT_BEATS_OPTIONS.map(b => ({
    id: b,
    name: `${b}`,
  }));

  protected onBeatsChange(value: number | null): void {
    if (value == null) return;
    this.chords.updateSlot(this.slot().id, { beats: value });
  }

  protected moveLeft(): void {
    this.chords.moveSlot(this.slot().id, -1);
  }

  protected moveRight(): void {
    this.chords.moveSlot(this.slot().id, 1);
  }

  protected remove(): void {
    this.chords.removeSlot(this.slot().id);
  }
}
