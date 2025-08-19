import { Component } from '@angular/core';

@Component({
  selector: 'svg[com-plus-icon]',
  template: `
    <svg:path d="M12 5V19M5 12H19" stroke="green" stroke-width="4" stroke-linecap="round"/>
  `,
  host: {
    '[attr.viewBox]': "'0 0 24 24'",
    '[attr.fill]': "'none'"
  }
})
export class ComPlusIcon { }
