import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from "@angular/router";

import { ThemeService } from '@services/theme/theme.service';

import { AppNavigationComponent } from './layout/app-navigation.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AppNavigationComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'themeService.currentTheme()',
  }
})
export class AppComponent {
  protected readonly themeService = inject(ThemeService);
}
