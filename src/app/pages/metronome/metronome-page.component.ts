import { Component } from '@angular/core';
import { WidMetronome } from "@widgets/metronome/wid-metronome.component";

@Component({
  selector: 'app-metronome-page',
  imports: [WidMetronome],
  templateUrl: './metronome-page.component.html',
  styleUrl: './metronome-page.component.scss'
})
export class MetronomePageComponent {

}
