import { Component, signal } from '@angular/core';
import { RouterOutlet } from "@angular/router";
import { AppNavigationComponent } from './layout/app-navigation.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AppNavigationComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  host: {
    '[class]': 'currentTheme()',
  }
})
export class AppComponent {
  title = 'dosong';

  // TODO: Настроить линтер
  // TODO: Добавить выбор цвета текста в зависимости от фона
  // TODO: Доделать выбор темы. Добавить кнопку в навигацию
  currentTheme = signal<"dark" | "white">("dark");
}
