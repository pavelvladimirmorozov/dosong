import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'svg[comPlusIcon]',
  template: `
    <svg:path d="M12 5V19M5 12H19" stroke="green" stroke-width="4" stroke-linecap="round"/>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.viewBox]': "'0 0 24 24'",
    '[attr.fill]': "'none'"
  }
})
export class ComPlusIcon { }
