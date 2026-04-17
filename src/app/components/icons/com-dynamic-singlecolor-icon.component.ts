import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'svg[comDynamicSinglecolorIcon]',
  template: `
  <svg:rect x="3" y="6" width="18" height="2" fill="#5890dfff"/>
  <svg:rect x="3" y="11" width="18" height="2" fill="#146cd26d"/>
  <svg:rect x="3" y="16" width="18" height="2" fill="#2962FF"/>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.viewBox]': "'0 0 24 24'",
    '[attr.fill]': "'none'"
  }
})
export class ComDynamicSinglecolorIcon { }
