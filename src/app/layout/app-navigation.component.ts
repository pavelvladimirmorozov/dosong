import { ChangeDetectionStrategy, Component } from '@angular/core';

import {
  ComGuitarIcon,
  ComMetronomeIcon,
  ComSettingsIcon,
} from '@components/icons';
import { ComTunerIcon } from '@components/icons/com-tuner-icon.component';

import { TranslatePipe } from '@services/i18n';
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
    TranslatePipe,
  ],
  template: `
    <wid-metronome-indicator></wid-metronome-indicator>
    <nav class="app-navigation">
      <app-nav-item route="/" [label]="'nav.fretboard' | translate" [exact]="true">
        <svg width="20" height="20" comGuitarIcon></svg>
      </app-nav-item>
      <app-nav-item route="/metronome" [label]="'nav.metronome' | translate">
        <svg width="20" height="20" comMetronomeIcon></svg>
      </app-nav-item>
      <app-nav-item route="/tuner" [label]="'nav.tuner' | translate">
        <svg width="20" height="20" comTunerIcon></svg>
      </app-nav-item>

      <app-nav-item route="/settings" [label]="'nav.settings' | translate">
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
