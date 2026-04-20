import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { ComCloseIcon, ComPlayIcon, ComStopIcon } from '@components/icons';

import { MetronomeService } from '@services/metronome/metronome.service';

@Component({
  selector: 'wid-metronome-indicator',
  imports: [ComStopIcon, ComPlayIcon, ComCloseIcon],
  templateUrl: './wid-metronome-indicator.component.html',
  styleUrl: './wid-metronome-indicator.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.wid-metronome-indicator--visible]': 'visible()',
  },
})
export class WidMetronomeIndicator {
  protected readonly metronome = inject(MetronomeService);

  protected readonly visible = this.metronome.indicatorVisible;
  protected readonly isRunning = this.metronome.isRunning;
  protected readonly activeIndex = this.metronome.activeBeatIndex;

  protected readonly beats = computed(() => {
    const count = this.metronome.beatsPerMeasure();
    return Array.from({ length: count }, (_, i) => i);
  });

  protected toggle(): void {
    this.metronome.toggle();
  }

  protected close(): void {
    this.metronome.closeIndicator();
  }
}
