import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ComButton } from '@components/button';
import { ComSlider } from '@components/slider';

import { Beat } from '@services/audio-processor/audio-processor.types';
import { BPM_MAX, BPM_MIN, MetronomeService } from '@services/metronome/metronome.service';

import { WidAutoTempo } from './auto-tempo/wid-auto-tempo.component';
import { WidBeatsCountControl } from './beats-count-control/wid-beats-count-control.component';
import { WidBpmControl } from './bpm-control/wid-bpm-control.component';
import { WidMetronomeBeatSelectComponent } from './metronome-beat/wid-metronome-beat-select.component';

@Component({
  selector: 'wid-metronome',
  imports: [
    ComButton,
    ComSlider,
    WidMetronomeBeatSelectComponent,
    WidBpmControl,
    WidBeatsCountControl,
    WidAutoTempo,
  ],
  templateUrl: './wid-metronome.component.html',
  styleUrls: ['./wid-metronome.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WidMetronome {
  protected readonly metronome = inject(MetronomeService);

  protected readonly bpmMin = BPM_MIN;
  protected readonly bpmMax = BPM_MAX;

  public updateBeatSound(index: number, beat: Beat): void {
    this.metronome.updateBeatSound(index, beat);
  }
}
