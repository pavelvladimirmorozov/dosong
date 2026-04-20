import { ChangeDetectionStrategy, Component, ViewEncapsulation, forwardRef, model } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'com-checkbox',
  imports: [],
  templateUrl: './com-checkbox.component.html',
  styleUrl: './com-checkbox.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'com-checkbox',
    '[class.com-checkbox--checked]': 'checked()',
    '[class.com-checkbox--disabled]': 'disabled()',
    '(click)': 'toggle()',
    '[attr.role]': '"checkbox"',
    '[attr.aria-checked]': 'checked()',
    '[attr.tabindex]': 'disabled() ? -1 : 0',
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ComCheckbox),
      multi: true,
    },
  ],
})
export class ComCheckbox implements ControlValueAccessor {
  public readonly checked = model<boolean>(false);
  public readonly disabled = model<boolean>(false);

  protected toggle(): void {
    if (this.disabled()) return;
    const next = !this.checked();
    this.checked.set(next);
    this.onChange(next);
    this.onTouched();
  }

  // #region ControlValueAccessor
  private onChange: (value: boolean) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  public writeValue(value: boolean): void {
    this.checked.set(!!value);
  }

  public registerOnChange(fn: (value: boolean) => void): void {
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
