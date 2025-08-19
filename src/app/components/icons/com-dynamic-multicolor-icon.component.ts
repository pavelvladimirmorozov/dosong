import { Component } from '@angular/core';

@Component({
  selector: 'svg[com-dynamic-multicolor-icon]',
  template: `
  <svg:rect x="3" y="6" width="18" height="2" fill="#FF3D00"/>
  <svg:rect x="3" y="11" width="18" height="2" fill="#00C853"/>
  <svg:rect x="3" y="16" width="18" height="2" fill="#2962FF"/>
  `,
  host: {
    '[attr.viewBox]': "'0 0 24 24'",
    '[attr.fill]': "'none'"
  }
})
export class ComDynamicMulticolorIcon { }
