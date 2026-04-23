import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ComSelect } from '@components/select';

import {
  HIGHLIGHT_MODE_OPTIONS,
  LANGUAGE_OPTIONS,
  NOTE_NAMING_OPTIONS,
  SettingsRepository,
  THEME_OPTIONS,
} from '@services/settings';

@Component({
  selector: 'app-settings-page',
  imports: [ComSelect],
  templateUrl: './settings-page.component.html',
  styleUrl: './settings-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsPageComponent {
  protected readonly settings = inject(SettingsRepository);

  protected readonly themeOptions = THEME_OPTIONS;
  protected readonly noteNamingOptions = NOTE_NAMING_OPTIONS;
  protected readonly highlightModeOptions = HIGHLIGHT_MODE_OPTIONS;
  protected readonly languageOptions = LANGUAGE_OPTIONS;
}
