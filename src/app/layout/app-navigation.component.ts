import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import {
  ComBriefcaseIcon,
  ComGuitarIcon,
  ComMetronomeIcon,
  ComMoonIcon,
  ComSunIcon,
} from '@components/icons';
import { ComTunerIcon } from '@components/icons/com-tuner-icon.component';

import { ThemeService } from '@services/theme/theme.service';

import { AppNavItemButtonComponent } from './app-nav-item-button.component';
import { AppNavItemComponent } from './app-nav-item.component';

@Component({
  selector: 'app-navigation',
  imports: [
    ComTunerIcon,
    ComGuitarIcon,
    ComMetronomeIcon,
    ComSunIcon,
    ComMoonIcon,
    AppNavItemComponent,
    AppNavItemButtonComponent,
  ],
  template: `
    <nav class="app-navigation">
      <app-nav-item route="/" label="Гриф" [exact]="true">
        <svg width="20" height="20" comGuitarIcon></svg>
      </app-nav-item>
      <app-nav-item route="/metronome" label="Метроном">
        <svg width="20" height="20" comMetronomeIcon></svg>
      </app-nav-item>
      <!-- <app-nav-item route="/knowledge-base" label="База знаний">
        <svg width="20" height="20" comBriefcaseIcon></svg>
      </app-nav-item> -->
      <app-nav-item route="/tuner" label="Тюнер">
        <svg width="20" height="20" comTunerIcon></svg>
      </app-nav-item>

      @if (themeService.currentTheme() === 'dark') {
        <app-nav-item-button label="Светлая" (clicked)="themeService.toggle()">
          <svg width="20" height="20" comSunIcon></svg>
        </app-nav-item-button>
      } @else {
        <app-nav-item-button label="Тёмная" (clicked)="themeService.toggle()">
          <svg width="20" height="20" comMoonIcon></svg>
        </app-nav-item-button>
      }
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
