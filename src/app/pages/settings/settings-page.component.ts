import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { ComSelect } from '@components/select';
import { ComSwitch } from '@components/switch';

import { I18nService, TranslatePipe } from '@services/i18n';
import {
  HIGHLIGHT_MODE_OPTIONS,
  LANGUAGE_OPTIONS,
  SettingsRepository,
} from '@services/settings';

@Component({
  selector: 'app-settings-page',
  imports: [ComSelect, ComSwitch, TranslatePipe],
  templateUrl: './settings-page.component.html',
  styleUrl: './settings-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsPageComponent {
  protected readonly settings = inject(SettingsRepository);
  private readonly i18n = inject(I18nService);

  protected readonly highlightModeOptions = computed(() => this.i18n.translateOptions(HIGHLIGHT_MODE_OPTIONS));
  protected readonly languageOptions = computed(() => this.i18n.translateOptions(LANGUAGE_OPTIONS));

  protected readonly darkTheme = computed(() => this.settings.theme() === 'dark');

  protected onDarkThemeChange(checked: boolean): void {
    this.settings.theme.set(checked ? 'dark' : 'white');
  }
}
