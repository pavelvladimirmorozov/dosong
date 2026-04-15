import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly currentTheme = signal<'dark' | 'white'>('dark');

  toggle(): void {
    this.currentTheme.update(t => (t === 'dark' ? 'white' : 'dark'));
  }
}
