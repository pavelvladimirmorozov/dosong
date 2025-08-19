import { Component } from '@angular/core';

@Component({
  selector: 'svg[com-tuner-icon]',
  template: `
    <svg:path class="cls-1" d="M7.5,5.5a2,2,0,0,0-2,2v33a2,2,0,0,0,2,2h33a2,2,0,0,0,2-2V7.5a2,2,0,0,0-2-2Z"/>
    <svg:line class="cls-1" x1="18.16" y1="5.5" x2="18.16" y2="42.5"/>
    <svg:path class="cls-1" d="M18.16,9.89c3.7,0,2.24,28.92,9.92,28.92H42.5"/>
    <svg:path class="cls-1" d="M18.16,9.89c-3.7,0-2.24,28.92-9.93,28.92H5.5"/>
  `,
  host: {
    '[attr.viewBox]': "'0 0 48 48'",
    '[attr.fill]': "'#000'",
    '[attr.stroke]': "'#000000'",
  }
})
export class ComTunerIcon { }
