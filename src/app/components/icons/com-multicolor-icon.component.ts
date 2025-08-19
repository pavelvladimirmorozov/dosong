import { Component } from '@angular/core';

@Component({
  selector: 'svg[com-multicolor-icon]',
  template: `
    <svg:defs>
      <linearGradient id="colorPickerGradient" x1 = "0%" y1 = "0%" x2 = "100%" y2 = "100%" >
        <stop offset="0%" stop - color="#FF3B30" />
        <stop offset="20%" stop - color="#FF9500" />
        <stop offset="40%" stop - color="#FFCC00" />
        <stop offset="60%" stop - color="#34C759" />
        <stop offset="80%" stop - color="#5AC8FA" />
        <stop offset="100%" stop - color="#5856D6" />
      </linearGradient>
    </svg:defs>
    <svg:circle cx = "12" cy = "12" r = "10" fill = "url(#colorPickerGradient)" stroke = "#333" stroke - width="1" />
  `,
  host: {
    '[attr.viewBox]': "'0 0 24 24'",
    '[attr.fill]': "'none'"
  }
})
export class ComMulticolorIcon { }



