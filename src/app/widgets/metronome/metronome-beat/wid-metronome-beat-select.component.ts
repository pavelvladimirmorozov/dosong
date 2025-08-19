import { ChangeDetectionStrategy, Component, computed, HostListener, inject, input, model } from '@angular/core';
import { NoteColorsManager } from '@services/note-colors-manager';
import { Beat, BEATS } from '@utils/constants';

@Component({
  selector: 'wid-metronome-beat-select',
  imports: [],
  templateUrl: './wid-metronome-beat-select.component.html',
  styleUrl: './wid-metronome-beat-select.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WidMetronomeBeatSelectComponent {
  protected readonly beats: Beat[] = BEATS;

  private readonly colorsState = inject(NoteColorsManager);
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
