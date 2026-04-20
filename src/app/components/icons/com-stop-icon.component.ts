import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'svg[comStopIcon]',
  template: `
    <svg:rect x="5" y="5" width="14" height="14" rx="1.5" fill="currentColor"/>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.viewBox]': "'0 0 24 24'",
    '[attr.fill]': "'none'",
  },
})
export class ComStopIcon {}
