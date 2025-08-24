import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ComBriefcaseIcon, ComGuitarIcon, ComMetronomeIcon } from '@components/icons';
import { ComTunerIcon } from '@components/icons/com-tuner-icon.component';

@Component({
  selector: 'app-navigation',
  imports: [ComBriefcaseIcon, ComTunerIcon, ComGuitarIcon, ComMetronomeIcon, RouterLink],
  template: `
  <!-- TODO: Вынести кнопки в компоненты -->
  <!-- TODO: Добавить подсветку активной ссылки -->
    <nav class="app-navigation">
      <a routerLink="/">
        <svg width="24" height="24" com-guitar-icon></svg>
        <span class="nav-text">Гриф</span>
      </a>
      <a routerLink="/metronome">
        <svg width="24" height="24" com-metronome-icon></svg>
        <span class="nav-text">Метроном</span>
      </a>
      <a routerLink="/knowledge-base">
        <svg width="24" height="24" com-briefcase-icon></svg>
        <span class="nav-text">База знаний</span>
      </a>
      <a routerLink="/tuner">
        <svg width="24" height="24" com-tuner-icon></svg>
        <span class="nav-text">Тюнер</span>
      </a>
    </nav>

    <div class="main-container">
      <ng-content />
    </div>
  `,
  styleUrl: './app-navigation.component.scss'
})
export class AppNavigationComponent { }
