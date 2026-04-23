import { effect, inject, Injectable } from '@angular/core';

import { SettingsRepository } from '@services/settings';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly settings = inject(SettingsRepository);

  public readonly currentTheme = this.settings.theme.asReadonly();

  constructor() {
    effect(() => {
      const theme = this.currentTheme();
      // Класс темы ставим на <html>, чтобы CSS-переменные достали
      // и до CDK-оверлеев (они монтируются в body, вне app-root).
      const root = document.documentElement;
      root.classList.toggle('white', theme === 'white');
      root.classList.toggle('dark', theme === 'dark');
    });
  }

  public toggle(): void {
    this.settings.theme.update(t => (t === 'dark' ? 'white' : 'dark'));
  }
}
