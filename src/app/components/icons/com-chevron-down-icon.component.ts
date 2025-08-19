import { Component } from '@angular/core';

@Component({
  selector: 'svg[com-chevron-down-icon]',
  template: `
    <svg:path d="M 1 7 L 12 18 L 23 7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  `,
  host: {
    '[attr.viewBox]': "'0 0 24 24'",
    '[attr.fill]': "'none'"
  }
})
export class ComChevronDownIcon { }
