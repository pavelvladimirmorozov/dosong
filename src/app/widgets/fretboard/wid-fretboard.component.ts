import { Component, ElementRef, AfterViewInit, HostListener, computed, model, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { iterableRange, NoteHelper } from '@utils/helpers';

import { NoteNamesManager } from '@services/note-names/note-names.service';

import { ComSelect } from '@components/select/com-select.component';
import { ComPlusIcon } from '@components/icons/com-plus-icon.component';
import { ComTrashIcon } from '@components/icons/com-trash-icon.component';

import { WidFretboardString } from './fretboard-string/wid-fretboard-string.component';
import { DEFAULT_TUNING } from './wid-fretboard.constants';
import { Note } from '@services/scale-steps/scale-steps.types';

// TODO: Добавить подсветку одинаковых нот по ховеру
@Component({
  selector: 'wid-fretboard',
  standalone: true,
  imports: [FormsModule, ComSelect, ComPlusIcon, ComTrashIcon, WidFretboardString],
  templateUrl: './wid-fretboard.component.html',
  styleUrls: ['./wid-fretboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WidFretboard implements AfterViewInit {
  private readonly MIN_WIDTH = 600;
  protected readonly noteNamesManager = inject(NoteNamesManager);
  protected readonly countOptions = [{ id: 12, name: '12' }, { id: 24, name: '24' }];
  private readonly actionColumnWidth = 55;
  private readonly offsetWidth = (this.actionColumnWidth + 5) * 4;

  private readonly boardElementRef = inject(ElementRef<HTMLElement>);

  private sustain = signal<number>(1000);

  public tuning = model(DEFAULT_TUNING);
  public fretsCount = model(12);

  public frets = computed(() => [...iterableRange(1, this.fretsCount())]);

  protected widthScaleFactor = computed(() => {
    const ref = this.boardElementRef;
    if (ref == null) return 1;
    const totalRatio = this.frets().reduce((total, a) => total + NoteHelper.calculateFretRatio(a), 0);
    return this.sustain() / totalRatio;
  })

  public ngAfterViewInit(): void {
    this.updateSustain();
  }

  @HostListener('window:resize')
  public onResize(): void {
    this.updateSustain();
  }

  public getFretWidth = (fretNumber: number) => {
    return fretNumber === 0
      ? this.actionColumnWidth
      : NoteHelper.calculateFretRatio(fretNumber) * this.widthScaleFactor();
  }

  public changeTuning(stringNumber: number, note: { note: Note | null, octave: number | null } | null) {
    if (note?.note == null || note.octave == null) return;
    this.tuning.update((currentTuning) => {
      const result = [...currentTuning];
      result[stringNumber] = { note: note.note!, octave: note.octave! };
      return result;
    });
  }

  public appendString() {
    this.tuning.update((currentTuning: { note: Note, octave: number }[]) => {
      const lastStringTuning = currentTuning[currentTuning.length - 1];
      if (lastStringTuning.octave === 0 && lastStringTuning.note < 5) 
        return [...currentTuning, lastStringTuning];
      return [...currentTuning, this.getNextTuningNote(lastStringTuning, -5)]
    });
  }

  public insertString() {
    this.tuning.update((currentTuning: { note: Note, octave: number }[]) => {
      const firstStringTuning = currentTuning[0];
      if (firstStringTuning.octave === 8 && firstStringTuning.note < 5) return [firstStringTuning, ...currentTuning];
      return [this.getNextTuningNote(firstStringTuning, 5), ...currentTuning]
    });
  }

  private getNextTuningNote(currentTuning: { note: Note, octave: number }, offset: number) {
    const note = (currentTuning.note + offset + 12) % 12;
    const octave = Math.floor((currentTuning.note + offset + 12 * currentTuning.octave) / 12);
    return { note, octave };
  }

  public removeString(stringNumber: number) {
    this.tuning.update((currentTuning) => [...currentTuning.slice(0, stringNumber), ...currentTuning.slice(stringNumber + 1)]);
  }

  private updateSustain() {
    const ref = this.boardElementRef;
    if (ref != null) {
      const width = ref.nativeElement.clientWidth - this.offsetWidth;
      this.sustain.set(width < this.MIN_WIDTH ? this.MIN_WIDTH : width);
    }
  }
}