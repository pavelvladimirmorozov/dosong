import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { ComCloseIcon, ComPlayIcon, ComStopIcon } from '@components/icons';

import { ChordsService, ProgressionPlaybackService, ProgressionSlot } from '@services/chords';
import { I18nService, TranslatePipe } from '@services/i18n';
import { MetronomeService } from '@services/metronome/metronome.service';

@Component({
  selector: 'wid-metronome-indicator',
  imports: [ComStopIcon, ComPlayIcon, ComCloseIcon, TranslatePipe],
  templateUrl: './wid-metronome-indicator.component.html',
  styleUrl: './wid-metronome-indicator.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.wid-metronome-indicator--visible]': 'visible()',
  },
})
export class WidMetronomeIndicator {
  protected readonly metronome = inject(MetronomeService);
  private readonly chords = inject(ChordsService);
  private readonly i18n = inject(I18nService);
  protected readonly playback = inject(ProgressionPlaybackService);

  protected readonly visible = this.metronome.indicatorVisible;
  protected readonly isRunning = this.metronome.isRunning;
  protected readonly activeIndex = this.metronome.activeBeatIndex;

  protected readonly beats = computed(() => {
    const count = this.metronome.beatsPerMeasure();
    return Array.from({ length: count }, (_, i) => i);
  });

  protected readonly previousChordName = computed<string | null>(() =>
    this.playback.playbackActive() ? this.slotName(this.playback.previousSlot()) : null
  );

  protected readonly currentChordName = computed<string | null>(() =>
    this.playback.playbackActive() ? this.slotName(this.playback.currentSlot()) : null
  );

  protected readonly nextChordName = computed<string | null>(() =>
    this.playback.playbackActive() ? this.slotName(this.playback.nextSlot()) : null
  );

  private slotName(slot: ProgressionSlot | null): string | null {
    if (!slot) return null;
    if (slot.root == null) return this.i18n.t('chords.emptySlot');
    return this.chords.buildChordFromSlot(slot)?.name ?? null;
  }

  protected toggle(): void {
    this.metronome.toggle();
  }

  protected close(): void {
    this.metronome.closeIndicator();
  }
}
