import { ChangeDetectionStrategy, Component } from '@angular/core';

import { WidCuartCircle } from "@widgets/cuart-circle/wid-cuart-circle.component";
import { WidFretboard } from "@widgets/fretboard/wid-fretboard.component";
import { WidGamma } from "@widgets/gamma/wid-gamma.component";

@Component({
  selector: 'app-fretboard-page',
  imports: [WidFretboard, WidGamma, WidCuartCircle],
  templateUrl: './fretboard-page.component.html',
  styleUrl: './fretboard-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FretboardPageComponent {

}
