import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'com-button',
  imports: [],
  templateUrl: './com-button.component.html',
  styleUrl: './com-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'com-button',
    '[class.com-button--secondary]': 'variant() === "secondary"',
    '[class.com-button--disabled]': 'disabled()',
    '[attr.aria-disabled]': 'disabled()',
  },
})
export class ComButton {
  public variant = input<'primary' | 'secondary'>('primary');
  public disabled = input<boolean>(false);
}