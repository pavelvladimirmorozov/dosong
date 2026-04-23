import { ChangeDetectionStrategy, Component } from '@angular/core';

import {
  ComGuitarIcon,
  ComMetronomeIcon,
  ComSettingsIcon,
} from '@components/icons';
import { ComTunerIcon } from '@components/icons/com-tuner-icon.component';

import { WidMetronomeIndicator } from '@widgets/metronome/indicator/wid-metronome-indicator.component';

import { AppNavItemComponent } from './app-nav-item.component';

@Component({
  selector: 'app-navigation',
  imports: [
    ComTunerIcon,
    ComGuitarIcon,
    ComMetronomeIcon,
    ComSettingsIcon,
    AppNavItemComponent,
    WidMetronomeIndicator,
  ],
  template: `
    <wid-metronome-indicator></wid-metronome-indicator>
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

      <app-nav-item route="/settings" label="Настройки">
        <svg width="20" height="20" comSettingsIcon></svg>
      </app-nav-item>
    </nav>

    <div class="main-container">
      <ng-content />
    </div>
  `,
  styleUrl: './app-navigation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppNavigationComponent {}
