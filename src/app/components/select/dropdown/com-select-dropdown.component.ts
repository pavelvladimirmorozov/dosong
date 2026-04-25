import { ChangeDetectionStrategy, Component, computed, input, model, ViewEncapsulation, InputSignal } from '@angular/core';

import { ComSelectOption, ComSelectOptionStyle } from '../com-select-option';

@Component({
  selector: 'com-select-dropdown',
  templateUrl: './com-select-dropdown.component.html',
  styleUrls: ['./com-select-dropdown.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'com-select-dropdown',
  }
})
export class ComSelectDropdown<T> {
  selectedValue = model<T | null>(null);

  selectedOption = computed(() => this.options().find(opt => opt.id === this.selectedValue()) ?? null);
  options = input<ComSelectOption<T>[]>([]);
  optionStyle: InputSignal<ComSelectOptionStyle<T> | null> = input<ComSelectOptionStyle<T> | null>(null);

  isSelected(option: ComSelectOption<T>) {
    return this.selectedValue() === option.id;
  }

  getOptionStyle(option: ComSelectOption<T>) {
    return this.optionStyle()?.(option) ?? null;
  }

  selectOption(option?: T | null) {
    this.selectedValue.set(option ?? null);
  }
}
