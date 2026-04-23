import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { ComCheckbox } from '@components/checkbox';
import { ComField } from '@components/field';
import { ComInput } from '@components/input';
import { ComSpoiler } from '@components/spoiler';

import { TranslatePipe } from '@services/i18n';
import { BPM_MAX, BPM_MIN, MetronomeService } from '@services/metronome/metronome.service';
import { clamp, parseClampedInt } from '@utils/helpers';

@Component({
  selector: 'wid-auto-tempo',
  imports: [ComSpoiler, ComCheckbox, ComInput, ComField, TranslatePipe],
  templateUrl: './wid-auto-tempo.component.html',
  styleUrl: './wid-auto-tempo.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WidAutoTempo {
  protected readonly metronome = inject(MetronomeService);

  protected readonly bpmMin = BPM_MIN;
  protected readonly bpmMax = BPM_MAX;

  protected readonly hasTarget = computed(() => this.metronome.rampTargetBpm() !== null);

  protected onDeltaChange(value: string | number | null): void {
    const parsed = parseClampedInt(value);
    if (parsed === null) return;
    this.metronome.rampDeltaBpm.set(parsed);
  }

  protected onPeriodChange(value: string | number | null): void {
    const parsed = parseClampedInt(value, 1);
    if (parsed === null) return;
    this.metronome.rampEveryMeasures.set(parsed);
  }

  protected onTargetChange(value: string | number | null): void {
    const parsed = parseClampedInt(value, BPM_MIN, BPM_MAX);
    if (parsed === null) return;
    this.metronome.rampTargetBpm.set(parsed);
  }

  protected onTargetToggle(enabled: boolean): void {
    if (enabled) {
      const suggest = this.metronome.bpm() + this.metronome.rampDeltaBpm() * 4;
      this.metronome.rampTargetBpm.set(clamp(suggest, BPM_MIN, BPM_MAX));
      return;
    }
    this.metronome.rampTargetBpm.set(null);
  }
}
