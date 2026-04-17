import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'svg[comSunIcon]',
  template: `
    <svg:circle cx="12" cy="12" r="4"/>
    <svg:path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
      stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.viewBox]': "'0 0 24 24'",
    '[attr.fill]': "'currentColor'"
  }
})
export class ComSunIcon { }
