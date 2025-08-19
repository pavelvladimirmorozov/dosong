import { Component } from '@angular/core';

@Component({
  selector: 'svg[com-dynamic-singlecolor-icon]',
  template: `
  <svg:rect x="3" y="6" width="18" height="2" fill="#5890dfff"/>
  <svg:rect x="3" y="11" width="18" height="2" fill="#146cd26d"/>
  <svg:rect x="3" y="16" width="18" height="2" fill="#2962FF"/>
  `,
  host: {
    '[attr.viewBox]': "'0 0 24 24'",
    '[attr.fill]': "'none'"
  }
})
export class ComDynamicSinglecolorIcon { }
