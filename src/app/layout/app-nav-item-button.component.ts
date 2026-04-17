import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-nav-item-button',
  template: `
    <button type="button" (click)="clicked.emit()">
      <ng-content />
      <span class="app-nav-item-button__text">{{ label() }}</span>
    </button>
  `,
  styleUrl: './app-nav-item-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppNavItemButtonComponent {
  label = input.required<string>();
  clicked = output<void>();
}
