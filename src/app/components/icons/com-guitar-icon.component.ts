import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'svg[comGuitarIcon]',
  template: `
    <svg:rect x="5" y="2" width="14" height="20" rx="1.5" ry="1.5"
      fill="none" stroke="currentColor" stroke-width="1.5"/>
    <svg:line x1="5" y1="7"  x2="19" y2="7"  stroke="currentColor" stroke-width="1.5"/>
    <svg:line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" stroke-width="1.5"/>
    <svg:line x1="5" y1="17" x2="19" y2="17" stroke="currentColor" stroke-width="1.5"/>
    <svg:line x1="9"  y1="2" x2="9"  y2="22" stroke="currentColor" stroke-width="0.75"/>
    <svg:line x1="12" y1="2" x2="12" y2="22" stroke="currentColor" stroke-width="0.75"/>
    <svg:line x1="15" y1="2" x2="15" y2="22" stroke="currentColor" stroke-width="0.75"/>
    <svg:circle cx="12" cy="9.5"  r="1" fill="currentColor"/>
    <svg:circle cx="12" cy="19.5" r="1" fill="currentColor"/>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.viewBox]': "'0 0 24 24'",
    '[attr.fill]': "'none'"
  }
})
export class ComGuitarIcon { }
