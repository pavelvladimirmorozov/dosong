import { ChangeDetectionStrategy, Component, computed, input, model } from '@angular/core';

import { ComButton } from '@components/button';
import { ComField } from '@components/field';
import { ComInput } from '@components/input';

import { clamp, parseClampedInt } from '@utils/helpers';

export type ControlOrientation = 'vertical' | 'horizontal' | 'auto';

@Component({
  selector: 'wid-bpm-control',
  imports: [ComButton, ComInput, ComField],
  templateUrl: './wid-bpm-control.component.html',
  styleUrl: './wid-bpm-control.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'wid-bpm-control',
    '[class.wid-bpm-control--vertical]': 'isVertical()',
    '[class.wid-bpm-control--horizontal]': 'isHorizontal()',
    '[class.wid-bpm-control--auto]': 'orientation() === "auto"',
  },
})
export class WidBpmControl {
  public value = model.required<number>();
  public min = input(40);
  public max = input(300);
  public step = input(10);
  public label = input('BPM');
  public orientation = input<ControlOrientation>('auto');

  protected isVertical = computed(() => this.orientation() === 'vertical');
  protected isHorizontal = computed(() => this.orientation() === 'horizontal');

  protected canDecrease = computed(() => this.value() - this.step() >= this.min());
  protected canIncrease = computed(() => this.value() + this.step() <= this.max());

  protected decrease(): void {
    this.value.set(clamp(this.value() - this.step(), this.min(), this.max()));
  }

  protected increase(): void {
    this.value.set(clamp(this.value() + this.step(), this.min(), this.max()));
  }

  protected onInputChange(raw: string | number | null): void {
    const clamped = parseClampedInt(raw, this.min(), this.max());
    if (clamped === null) return;
    this.value.set(clamped);
  }
}
