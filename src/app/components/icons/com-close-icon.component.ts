import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'svg[comCloseIcon]',
  template: `
    <svg:path d="M6 6L18 18M18 6L6 18" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.viewBox]': "'0 0 24 24'",
    '[attr.fill]': "'none'",
  },
})
export class ComCloseIcon {}
