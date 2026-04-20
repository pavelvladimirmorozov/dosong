import { ChangeDetectionStrategy, Component, ViewEncapsulation, forwardRef, input, model } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

import { parseClampedNumber } from '@utils/helpers';

type ComInputType = 'text' | 'number';
type ComInputCommitOn = 'change' | 'blur';

@Component({
  selector: 'com-input',
  imports: [FormsModule],
  templateUrl: './com-input.component.html',
  styleUrl: './com-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'com-input',
    '[class.com-input--disabled]': 'disabled()',
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ComInput),
      multi: true,
    },
  ],
})
export class ComInput implements ControlValueAccessor {
  public readonly type = input<ComInputType>('text');
  public readonly min = input<number>();
  public readonly max = input<number>();
  public readonly step = input<number>();
  public readonly placeholder = input<string>();
  public readonly commitOn = input<ComInputCommitOn>('change');
  public readonly disabled = model<boolean>(false);

  public readonly value = model<string | number | null>(null);

  // Сырой ввод, ещё не закоммиченный в value (при commitOn='blur')
  private pendingRaw: string | number | null | undefined;

  protected onNgModelChange(raw: string | number): void {
    if (this.commitOn() === 'blur') {
      this.pendingRaw = raw;
      return;
    }
    this.commitValue(raw);
  }

  protected onBlur(): void {
    if (this.commitOn() === 'blur' && this.pendingRaw !== undefined) {
      this.commitValue(this.pendingRaw);
      this.pendingRaw = undefined;
    }
    this.onTouched();
  }

  private commitValue(raw: string | number | null): void {
    if (this.type() === 'number') {
      if (raw === null || raw === '') {
        this.value.set(null);
        this.onChange(null);
        return;
      }
      const clamped = parseClampedNumber(raw, this.min(), this.max());
      if (clamped === null) return;
      this.value.set(clamped);
      this.onChange(clamped);
      return;
    }
    this.value.set(raw);
    this.onChange(raw);
  }

  // #region ControlValueAccessor
  private onChange: (value: string | number | null) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  public writeValue(value: string | number | null): void {
    this.value.set(value);
    this.pendingRaw = undefined;
  }

  public registerOnChange(fn: (value: string | number | null) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }
  // #endregion
}
