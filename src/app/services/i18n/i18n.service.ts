import { computed, inject, Injectable } from '@angular/core';

import { ComSelectOption } from '@components/select/com-select-option';

import { Language, SettingsRepository } from '@services/settings';

import { EN_TRANSLATIONS } from './translations/en';
import { RU_TRANSLATIONS } from './translations/ru';

const DICTIONARIES: Record<Language, Record<string, string>> = {
  ru: RU_TRANSLATIONS,
  en: EN_TRANSLATIONS,
};

@Injectable({ providedIn: 'root' })
export class I18nService {
  private readonly settings = inject(SettingsRepository);

  public readonly language = this.settings.language.asReadonly();

  private readonly dictionary = computed(() => DICTIONARIES[this.language()]);

  public t(key: string): string {
    return this.dictionary()[key] ?? key;
  }

  public translateOptions<T>(options: ComSelectOption<T>[]): ComSelectOption<T>[] {
    const dict = this.dictionary();
    return options.map(o => ({ ...o, name: dict[o.name] ?? o.name }));
  }
}
