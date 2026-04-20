import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'com-field',
  imports: [],
  templateUrl: './com-field.component.html',
  styleUrl: './com-field.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'com-field',
  },
})
export class ComField {}
