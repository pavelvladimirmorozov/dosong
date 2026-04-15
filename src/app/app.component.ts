import { Component, inject } from '@angular/core';
import { RouterOutlet } from "@angular/router";
import { AppNavigationComponent } from './layout/app-navigation.component';
import { ThemeService } from '@services/theme/theme.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AppNavigationComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  host: {
    '[class]': 'themeService.currentTheme()',
  }
})
export class AppComponent {
  // TODO: Настроить линтер
  protected readonly themeService = inject(ThemeService);
}
