import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'svg[comBriefcaseIcon]',
  template: `
    <svg:path d="M6 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h13a1 1 0 0 0 1-1v-1a1 1 0 0 0-1-1h-1v-2h1a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1H6zm0 2h12v12H6.5a2.5 2.5 0 0 0-.5.05V4zm0 14.05c.16-.03.33-.05.5-.05H17v2H6.5a1 1 0 1 1 0-2h-.5v.05z"/>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.viewBox]': "'0 0 24 24'",
    '[attr.fill]': "'currentColor'"
  }
})
export class ComBriefcaseIcon { }
