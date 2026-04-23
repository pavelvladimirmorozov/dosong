import { ChangeDetectionStrategy, Component, computed, input, model } from '@angular/core';

import { ComButton } from '@components/button';
import { ComField } from '@components/field';
import { ComSelect } from '@components/select';

import { TranslatePipe } from '@services/i18n';
import { clamp, iterableRange } from '@utils/helpers';

import type { ControlOrientation } from '../bpm-control/wid-bpm-control.component';

@Component({
  selector: 'wid-beats-count-control',
  imports: [ComButton, ComSelect, ComField, TranslatePipe],
  templateUrl: './wid-beats-count-control.component.html',
  styleUrl: './wid-beats-count-control.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'wid-beats-count-control',
    '[class.wid-beats-count-control--vertical]': 'orientation() === "vertical"',
    '[class.wid-beats-count-control--horizontal]': 'orientation() === "horizontal"',
    '[class.wid-beats-count-control--auto]': 'orientation() === "auto"',
  },
})
export class WidBeatsCountControl {
  public value = model.required<number>();
  public min = input(1);
  public max = input(16);
  public label = input('metronome.beats');
  public orientation = input<ControlOrientation>('auto');

  protected readonly options = computed(() =>
    [...iterableRange(this.min(), this.max())].map(i => ({ id: i, name: `${i}` })),
  );

  protected canDecrease = computed(() => this.value() - 1 >= this.min());
  protected canIncrease = computed(() => this.value() + 1 <= this.max());

  protected decrease(): void {
    this.value.set(clamp(this.value() - 1, this.min(), this.max()));
  }

  protected increase(): void {
    this.value.set(clamp(this.value() + 1, this.min(), this.max()));
  }
}
