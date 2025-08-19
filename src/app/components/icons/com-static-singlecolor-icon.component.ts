import { Component } from '@angular/core';

@Component({
  selector: 'svg[com-static-singlecolor-icon]',
  template: `
  <svg:rect x="3" y="6" width="18" height="2" fill="#0000"/>
  <svg:rect x="3" y="11" width="18" height="2" fill="#0000"/>
  <svg:rect x="3" y="16" width="18" height="2" fill="#0000"/>
  `,
  host: {
    '[attr.viewBox]': "'0 0 24 24'",
    '[attr.fill]': "'none'"
  }
})
export class ComStaticSinglecolorIcon { }
