import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ComButton } from '@components/button';
import { ComInput } from '@components/input';
import { ComSelect } from '@components/select';
import { ComSpoiler } from '@components/spoiler';

import { ChordsService, ProgressionPlaybackService, ProgressionSlot, SongContextService } from '@services/chords';
import { I18nService, TranslatePipe } from '@services/i18n';

import { WidChordProgressionSlot } from './progression-slot/wid-chord-progression-slot.component';

@Component({
  selector: 'wid-chord-progression',
  imports: [
    ComButton,
    ComInput,
    ComSelect,
    ComSpoiler,
    FormsModule,
    TranslatePipe,
    WidChordProgressionSlot,
  ],
  templateUrl: './wid-chord-progression.component.html',
  styleUrl: './wid-chord-progression.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WidChordProgression {
  protected readonly chords = inject(ChordsService);
  protected readonly playback = inject(ProgressionPlaybackService);
  private readonly songContext = inject(SongContextService);
  private readonly i18n = inject(I18nService);

  protected readonly progressionOptions = computed(() => [
    { id: null as string | null, name: this.i18n.t('progression.notSelected') },
    ...this.chords.progressions().map(p => ({ id: p.id as string | null, name: p.name })),
  ]);

  /** Локальное зеркало активной прогрессии — связано с селектом, чтобы откатывать визуальный выбор при отказе подтверждения. */
  protected readonly selectViewId = signal<string | null>(null);

  protected readonly currentSlotId = computed<string | null>(() => {
    const idx = this.playback.currentSlotIndex();
    if (idx < 0) return null;
    return this.chords.activeProgression()?.slots[idx]?.id ?? null;
  });

  protected readonly canStartPlayback = computed(() =>
    (this.chords.activeProgression()?.slots.length ?? 0) > 0
  );

  protected readonly renaming = signal<boolean>(false);
  protected readonly renameValue = signal<string>('');

  constructor() {
    effect(() => {
      this.selectViewId.set(this.chords.activeProgressionId());
    });
  }

  protected async onProgressionChange(id: string | null): Promise<void> {
    // Зеркалим клик пользователя — между set(id) и set(actualId) await разнесёт CD на два цикла,
    // и Angular корректно пробросит откат во внутренний model com-select.
    this.selectViewId.set(id);
    if (this.playback.playbackActive()) this.playback.stop();
    const ok = await this.songContext.selectProgression(id);
    if (!ok) {
      this.selectViewId.set(this.chords.activeProgressionId());
    }
  }

  protected createNew(): void {
    const baseName = this.i18n.t('progression.namePlaceholder');
    const existing = this.chords.progressions().length;
    this.songContext.createProgression(`${baseName} ${existing + 1}`);
  }

  protected startRename(): void {
    const current = this.chords.activeProgression();
    if (!current) return;
    this.renameValue.set(current.name);
    this.renaming.set(true);
  }

  protected commitRename(): void {
    const current = this.chords.activeProgression();
    if (!current) {
      this.renaming.set(false);
      return;
    }
    const next = this.renameValue().trim();
    if (next.length > 0 && next !== current.name) {
      this.chords.renameProgression(current.id, next);
    }
    this.renaming.set(false);
  }

  protected cancelRename(): void {
    this.renaming.set(false);
  }

  protected deleteCurrent(): void {
    const current = this.chords.activeProgression();
    if (!current) return;
    this.chords.deleteProgression(current.id);
    if (this.playback.playbackActive()) this.playback.stop();
  }

  protected togglePlayback(): void {
    this.playback.toggle();
  }

  protected trackSlot(_index: number, slot: ProgressionSlot): string {
    return slot.id;
  }
}
