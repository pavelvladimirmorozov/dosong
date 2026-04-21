import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'svg[comGuitarIcon]',
  template: `
    <svg:rect x="2" y="6" width="20" height="12" rx="1.5" ry="1.5"
      fill="none" stroke="currentColor" stroke-width="1.5"/>
    <svg:line x1="4" y1="6"  x2="4"  y2="18" stroke="currentColor" stroke-width="2"/>
    <svg:line x1="9" y1="6"  x2="9"  y2="18" stroke="currentColor" stroke-width="1"/>
    <svg:line x1="14" y1="6" x2="14" y2="18" stroke="currentColor" stroke-width="1"/>
    <svg:line x1="19" y1="6" x2="19" y2="18" stroke="currentColor" stroke-width="1"/>
    <svg:line x1="2" y1="9.5"  x2="22" y2="9.5"  stroke="currentColor" stroke-width="0.8"/>
    <svg:line x1="2" y1="12"   x2="22" y2="12"   stroke="currentColor" stroke-width="0.8"/>
    <svg:line x1="2" y1="14.5" x2="22" y2="14.5" stroke="currentColor" stroke-width="0.8"/>
    <svg:circle cx="11.5" cy="12" r="1" fill="currentColor"/>
    <svg:circle cx="16.5" cy="12" r="1" fill="currentColor"/>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.viewBox]': "'0 0 24 24'",
    '[attr.fill]': "'none'"
  }
})
export class ComGuitarIcon { }
