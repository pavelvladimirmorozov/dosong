import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'svg[comPauseIcon]',
  template: `
    <svg:rect x="6" y="4" width="4" height="16" rx="1" fill="currentColor"/>
    <svg:rect x="14" y="4" width="4" height="16" rx="1" fill="currentColor"/>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.viewBox]': "'0 0 24 24'",
    '[attr.fill]': "'none'",
  },
})
export class ComPauseIcon {}
