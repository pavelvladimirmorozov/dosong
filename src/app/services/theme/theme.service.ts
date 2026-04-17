import { Injectable, signal, effect } from '@angular/core';
import { Theme } from './theme.constants';

const THEME_KEY = 'dosong-theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly currentTheme = signal<Theme>(this.loadTheme());

  constructor() {
    effect(() => {
      localStorage.setItem(THEME_KEY, this.currentTheme());
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
