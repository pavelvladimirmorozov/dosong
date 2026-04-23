import { ChangeDetectorRef, DestroyRef, effect, inject, Pipe, PipeTransform } from '@angular/core';

import { I18nService } from './i18n.service';

@Pipe({
  name: 'translate',
  pure: false,
})
export class TranslatePipe implements PipeTransform {
  private readonly i18n = inject(I18nService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);

  private lastKey: string | null | undefined = undefined;
  private lastLanguage = this.i18n.language();
  private lastValue = '';

  constructor() {
    const ref = effect(() => {
      const lang = this.i18n.language();
      if (lang !== this.lastLanguage) {
        this.lastLanguage = lang;
        this.lastKey = undefined;
        this.cdr.markForCheck();
      }
    });
    this.destroyRef.onDestroy(() => ref.destroy());
  }

  public transform(key: string | null | undefined): string {
    if (key == null) return '';
    if (key !== this.lastKey) {
      this.lastKey = key;
      this.lastValue = this.i18n.t(key);
    }
    return this.lastValue;
  }
}
