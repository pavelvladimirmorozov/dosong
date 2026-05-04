import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'svg[comSongIcon]',
  template: `
    <svg:path
      d="M7 3h7l4 4v14H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"
      stroke="currentColor"
      stroke-width="1.7"
      stroke-linejoin="round"
      fill="none"
    />
    <svg:path
      d="M14 3v5h5M15 11v5.5a2 2 0 1 1-1.2-1.83V11h4"
      stroke="currentColor"
      stroke-width="1.7"
      stroke-linecap="round"
      stroke-linejoin="round"
      fill="none"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.viewBox]': "'0 0 24 24'",
    '[attr.fill]': "'none'",
  }
})
export class ComSongIcon {}
