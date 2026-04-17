import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'svg[comMoonIcon]',
  template: `
    <svg:path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.viewBox]': "'0 0 24 24'",
    '[attr.fill]': "'currentColor'"
  }
})
export class ComMoonIcon { }
