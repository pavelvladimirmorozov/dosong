import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'svg[comChordsIcon]',
  template: `
    <svg:path
      d="M7 5v14M12 5v14M17 5v14M5 8h14M5 12h14M5 16h14"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
    />
    <svg:circle cx="7" cy="8" r="2" fill="currentColor" />
    <svg:circle cx="12" cy="12" r="2" fill="currentColor" />
    <svg:circle cx="17" cy="16" r="2" fill="currentColor" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.viewBox]': "'0 0 24 24'",
    '[attr.fill]': "'none'",
  }
})
export class ComChordsIcon {}
