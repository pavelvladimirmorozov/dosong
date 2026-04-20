import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'svg[comPlayIcon]',
  template: `
    <svg:path d="M7 4L20 12L7 20V4Z" fill="currentColor"/>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.viewBox]': "'0 0 24 24'",
    '[attr.fill]': "'none'",
  },
})
export class ComPlayIcon {}
