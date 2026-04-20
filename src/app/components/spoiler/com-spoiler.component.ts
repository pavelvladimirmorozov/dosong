import { ChangeDetectionStrategy, Component, ViewEncapsulation, input, model } from '@angular/core';

import { ComChevronDownIcon } from '@components/icons/com-chevron-down-icon.component';

@Component({
  selector: 'com-spoiler',
  imports: [ComChevronDownIcon],
  templateUrl: './com-spoiler.component.html',
  styleUrl: './com-spoiler.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'com-spoiler',
    '[class.com-spoiler--open]': 'open()',
  },
})
export class ComSpoiler {
  public readonly title = input<string>('');
  public readonly open = model<boolean>(false);

  protected toggle(): void {
    this.open.update(v => !v);
  }
}
