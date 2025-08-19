import { Component, forwardRef, ElementRef, AfterViewInit, inject, ViewEncapsulation, input, signal, model, ChangeDetectionStrategy, effect, computed, contentChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgTemplateOutlet } from '@angular/common';

import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ConnectedPosition } from '@angular/cdk/overlay';

import { ComChevronDownIcon } from '@components/icons/com-chevron-down-icon.component';

import { ComSelectContentSlot } from './com-select-slots';
import { ComSelectOption } from './com-select-option';
import { ComSelectDropdown } from './dropdown/com-select-dropdown.component';

@Component({
  selector: 'com-select',
  templateUrl: './com-select.component.html',
  styleUrls: ['./com-select.component.scss'],
  imports: [ComChevronDownIcon, NgTemplateOutlet],
  host: {
    class: 'com-select',
    '[class.com-select-disabled]': 'disabled()',
    '[attr.tabindex]': 'disabled() ? -1 : tabIndex',
    '[attr.aria-disabled]': 'disabled()',
    '(click)': 'toggle()'
  },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ComSelect),
      multi: true
    }
  ]
})
export class ComSelect<T> implements ControlValueAccessor, AfterViewInit {
  public placeholder = input<string>();
  public options = input<ComSelectOption<T>[]>([]);

  public disabled = model(false);

  public isOpen = signal(false);
  public isInited = signal(false);
  
  public selectedValue = model<T | null>(null);

  protected selectedOption = computed(() => this.options().find(opt => opt.id === this.selectedValue()) ?? null);
  protected displayValue = computed(() => this.selectedOption()?.name ?? this.placeholder());
  protected emptyContent = computed(() => this.contentSlot() == null);

  protected contentSlot = contentChild(ComSelectContentSlot);

  private elementRef = inject(ElementRef);
  private overlay = inject(Overlay);

  private overlayRef!: OverlayRef;

  private positions: ConnectedPosition[] = [
    {
      originX: 'start', originY: 'bottom',
      overlayX: 'start', overlayY: 'top'
    },
    {
      originX: 'start', originY: 'top',
      overlayX: 'start', overlayY: 'bottom'
    }
  ];

  public ngAfterViewInit(): void {
    const strategy = this.overlay
      .position()
      .flexibleConnectedTo(this.elementRef.nativeElement)
      .withPositions(this.positions)
      .withPush(true)
      .withFlexibleDimensions(false)
      .withLockedPosition(true);

    this.overlayRef = this.overlay.create({
      positionStrategy: strategy,
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-transparent-backdrop',
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      minWidth: this.elementRef.nativeElement.offsetWidth
    });

    this.overlayRef.backdropClick().subscribe(() => {
      this.close();
    });
  }

  public ngOnDestroy(): void {
    if (this.overlayRef) {
      this.overlayRef.dispose();
    }
  }

  public toggle(): void {
    this.isOpen() ? this.close() : this.open();
  }

  private close(): void {
    if (!this.isOpen) return;

    this.overlayRef?.detach();
    this.isOpen.set(false);
  }

  private open(): void {
    if (this.disabled() || this.isOpen()) return;
    this.isOpen.set(true);

    const dropdownRef = this.overlayRef.attach(new ComponentPortal(ComSelectDropdown<T>));
    this.fillDropdownInputs(dropdownRef.instance);
  }

  private fillDropdownInputs(dropdown: ComSelectDropdown<T>) {
    dropdown.options = this.options;
    dropdown.selectedValue = this.selectedValue;
    dropdown.selectedOption = this.selectedOption;
  }

  // #region  ControlValueAccessor methods
  private onChange: any = () => { };
  private onTouched: any = () => { };

  private selectedValueChangeEffct = effect(() => {
    if (this.isInited()) {
      this.onTouched();
      this.onChange(this.selectedValue());
      this.close();
    } else {
      this.isInited.set(true);
    }
  });

  public writeValue(value: T | null): void {
    this.selectedValue.set(value);
  }

  public registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }
  // #endregion
}