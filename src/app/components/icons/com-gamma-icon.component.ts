import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'svg[comGammaIcon]',
  template: `
    <svg:path
      d="M4 17h4v-4h4V9h4V5h4"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      fill="none"
    />
    <svg:circle cx="4" cy="17" r="1.5" fill="currentColor" />
    <svg:circle cx="8" cy="13" r="1.5" fill="currentColor" />
    <svg:circle cx="12" cy="9" r="1.5" fill="currentColor" />
    <svg:circle cx="16" cy="5" r="1.5" fill="currentColor" />
    <svg:circle cx="20" cy="5" r="1.5" fill="currentColor" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.viewBox]': "'0 0 24 24'",
    '[attr.fill]': "'none'",
  }
})
export class ComGammaIcon {}
