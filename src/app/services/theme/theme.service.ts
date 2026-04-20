import { Injectable, signal, effect } from '@angular/core';

import { Theme } from './theme.constants';

const THEME_KEY = 'dosong-theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly currentTheme = signal<Theme>(this.loadTheme());

  constructor() {
    effect(() => {
      const theme = this.currentTheme();
      localStorage.setItem(THEME_KEY, theme);

      // Класс темы ставим на <html>, чтобы CSS-переменные достали
      // и до CDK-оверлеев (они монтируются в body, вне app-root).
      const root = document.documentElement;
      root.classList.toggle('white', theme === 'white');
      root.classList.toggle('dark', theme === 'dark');
    });
  }

  toggle(): void {
    this.currentTheme.update(t => (t === 'dark' ? 'white' : 'dark'));
  }

  private loadTheme(): Theme {
    const stored = localStorage.getItem(THEME_KEY);
    return stored === 'white' ? 'white' : 'dark';
  }
}
