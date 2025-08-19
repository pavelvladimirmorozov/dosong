import { Component } from '@angular/core';

@Component({
  selector: 'svg[com-home-icon]',
  template: `
    <svg:path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  `,
  host: {
    '[attr.viewBox]': "'0 0 24 24'",
    '[attr.fill]': "'none'"
  }
})
export class ComHomeIcon { }
