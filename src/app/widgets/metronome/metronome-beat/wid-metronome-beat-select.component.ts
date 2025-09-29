import { ChangeDetectionStrategy, Component, computed, HostListener, inject, input, model } from '@angular/core';
import { BEATS } from '@services/audio-processor/audio-processor.constants';
import { Beat } from '@services/audio-processor/audio-processor.types';
import { NoteColorsService } from '@services/note-colors/note-colors.service';

@Component({
  selector: 'wid-metronome-beat-select',
  imports: [],
  templateUrl: './wid-metronome-beat-select.component.html',
  styleUrl: './wid-metronome-beat-select.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WidMetronomeBeatSelectComponent {
  protected readonly beats: Beat[] = BEATS;

  private readonly colorsState = inject(NoteColorsService);
  public activeColor = computed(() => this.colorsState.getStaticNoteColor());

  selectedBeat = model<Beat>(this.beats[0]);

  isActive = input<boolean>(false);

  color = computed(() => this.isActive() ? this.activeColor() : '#00000030');

  index = input<number>(0);

  @HostListener('click')
  public next() {
    this.selectedBeat.update((prev) => {
      const index = this.beats.indexOf(prev);
      return this.beats[(index + 1) % this.beats.length];
    })
  }

  protected getColor(index: number) {
    return this.selectedCondition(index) ? this.color() : '#00000000';
  }

  private selectedCondition(index: number) {
    return index <= this.beats.indexOf(this.selectedBeat())
  }
}
