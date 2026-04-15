import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-nav-item',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <a
      [routerLink]="route()"
      routerLinkActive="app-nav-item--active"
      [routerLinkActiveOptions]="{ exact: exact() }"
    >
      <ng-content />
      <span class="nav-text">{{ label() }}</span>
    </a>
  `,
  styleUrl: './app-nav-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppNavItemComponent {
  route = input.required<string>();
  label = input.required<string>();
  exact = input<boolean>(false);
}
