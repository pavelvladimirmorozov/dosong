import { ChangeDetectionStrategy, Component, ViewEncapsulation, forwardRef, input, model } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'com-slider',
  imports: [FormsModule],
  templateUrl: './com-slider.component.html',
  styleUrl: './com-slider.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'com-slider',
    '[class.com-slider--disabled]': 'disabled()',
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ComSlider),
      multi: true,
    },
  ],
})
export class ComSlider implements ControlValueAccessor {
  public readonly min = input<number>(0);
  public readonly max = input<number>(100);
  public readonly step = input<number>(1);
  public readonly showValue = input<boolean>(false);
  public readonly valueSuffix = input<string>('');
  public readonly disabled = model<boolean>(false);

  public readonly value = model<number>(0);

  protected onNgModelChange(raw: number): void {
    this.value.set(raw);
    this.onChange(raw);
  }

  protected onBlur(): void {
    this.onTouched();
  }

  // #region ControlValueAccessor
  private onChange: (value: number) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  public writeValue(value: number): void {
    this.value.set(value ?? 0);
  }

  public registerOnChange(fn: (value: number) => void): void {
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
