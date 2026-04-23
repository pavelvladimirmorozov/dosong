import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { ComCheckbox } from '@components/checkbox';
import { ComSelect } from '@components/select';

import { I18nService, TranslatePipe } from '@services/i18n';
import {
  HIGHLIGHT_MODE_OPTIONS,
  LANGUAGE_OPTIONS,
  NOTE_NAMING_OPTIONS,
  SettingsRepository,
  THEME_OPTIONS,
} from '@services/settings';

@Component({
  selector: 'app-settings-page',
  imports: [ComSelect, ComCheckbox, TranslatePipe],
  templateUrl: './settings-page.component.html',
  styleUrl: './settings-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsPageComponent {
  protected readonly settings = inject(SettingsRepository);
  private readonly i18n = inject(I18nService);

  protected readonly themeOptions = computed(() => this.i18n.translateOptions(THEME_OPTIONS));
  protected readonly noteNamingOptions = computed(() => this.i18n.translateOptions(NOTE_NAMING_OPTIONS));
  protected readonly highlightModeOptions = computed(() => this.i18n.translateOptions(HIGHLIGHT_MODE_OPTIONS));
  protected readonly languageOptions = computed(() => this.i18n.translateOptions(LANGUAGE_OPTIONS));
}
