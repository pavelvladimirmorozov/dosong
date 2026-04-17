import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ComBriefcaseIcon, ComGuitarIcon, ComMetronomeIcon } from '@components/icons';
import { ComTunerIcon } from '@components/icons/com-tuner-icon.component';

import { ThemeService } from '@services/theme/theme.service';

import { AppNavItemComponent } from './app-nav-item.component';

@Component({
  selector: 'app-navigation',
  imports: [ComBriefcaseIcon, ComTunerIcon, ComGuitarIcon, ComMetronomeIcon, AppNavItemComponent],
  template: `
    <nav class="app-navigation">
      <app-nav-item route="/" label="Гриф" [exact]="true">
        <svg width="24" height="24" comGuitarIcon></svg>
      </app-nav-item>
      <app-nav-item route="/metronome" label="Метроном">
        <svg width="24" height="24" comMetronomeIcon></svg>
      </app-nav-item>
      <app-nav-item route="/knowledge-base" label="База знаний">
        <svg width="24" height="24" comBriefcaseIcon></svg>
      </app-nav-item>
      <app-nav-item route="/tuner" label="Тюнер">
        <svg width="24" height="24" comTunerIcon></svg>
      </app-nav-item>

      <button class="app-navigation__theme-toggle" (click)="themeService.toggle()">
        @if (themeService.currentTheme() === 'dark') {
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="12" r="4"/>
            <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/>
          </svg>
          <span class="app-navigation__nav-text">Светлая</span>
        } @else {
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
          <span class="app-navigation__nav-text">Тёмная</span>
        }
      </button>
    </nav>

    <div class="main-container">
      <ng-content />
    </div>
  `,
  styleUrl: './app-navigation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppNavigationComponent {
  protected readonly themeService = inject(ThemeService);
}
