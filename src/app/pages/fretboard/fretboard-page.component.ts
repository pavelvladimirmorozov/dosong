import { ChangeDetectionStrategy, Component } from '@angular/core';

import { WidChordProgression } from "@widgets/chord-progression/wid-chord-progression.component";
import { WidChordsRow } from "@widgets/chords-row/wid-chords-row.component";
import { WidCuartCircle } from "@widgets/cuart-circle/wid-cuart-circle.component";
import { WidFretboard } from "@widgets/fretboard/wid-fretboard.component";
import { WidGamma } from "@widgets/gamma/wid-gamma.component";

@Component({
  selector: 'app-fretboard-page',
  imports: [WidFretboard, WidGamma, WidCuartCircle, WidChordsRow, WidChordProgression],
  templateUrl: './fretboard-page.component.html',
  styleUrl: './fretboard-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FretboardPageComponent {

}
