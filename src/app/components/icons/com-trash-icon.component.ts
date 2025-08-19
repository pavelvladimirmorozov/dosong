import { Component } from '@angular/core';

@Component({
  selector: 'svg[com-trash-icon]',
  template: `
  <svg:path d="M18 6L6 18M6 6L18 18" stroke="red" stroke-width="4" stroke-linecap="round"/>
  `,
  host: {
    '[attr.viewBox]': "'0 0 24 24'",
    '[attr.fill]': "'none'"
  }
})
export class ComTrashIcon { }