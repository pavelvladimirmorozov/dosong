import { Component, ElementRef, AfterViewInit, HostListener, computed, signal, inject, ChangeDetectionStrategy } from '@angular/core';

import { ComPlusIcon } from '@components/icons/com-plus-icon.component';
import { ComTrashIcon } from '@components/icons/com-trash-icon.component';
import { ComSelect } from '@components/select/com-select.component';
import { ComSwitch } from '@components/switch';

import { ChordsService } from '@services/chords';
import { I18nService, TranslatePipe } from '@services/i18n';
import { Note } from '@services/scale-steps/scale-steps.types';
import { SettingsRepository } from '@services/settings';
import { INSTRUMENTS, InstrumentId, MAX_STRINGS, MIN_STRINGS, TuningService, TuningString } from '@services/tuning';
import { iterableRange, NoteHelper } from '@utils/helpers';

import { WidFretboardString } from './fretboard-string/wid-fretboard-string.component';

const STRING_ROW_HEIGHT = 32;
const ACTION_COLUMNS = 4;
const BARRE_LINE_THICKNESS = 8;

@Component({
  selector: 'wid-fretboard',
  standalone: true,
  imports: [ComSelect, ComSwitch, ComPlusIcon, ComTrashIcon, WidFretboardString, TranslatePipe],
  templateUrl: './wid-fretboard.component.html',
  styleUrls: ['./wid-fretboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WidFretboard implements AfterViewInit {
  private readonly MIN_WIDTH = 600;
  protected readonly settings = inject(SettingsRepository);
  protected readonly tuningService = inject(TuningService);
  protected readonly chords = inject(ChordsService);
  private readonly i18n = inject(I18nService);
  protected readonly countOptions = [{ id: 12, name: '12' }, { id: 24, name: '24' }];
  protected readonly instrumentOptions = computed(() => INSTRUMENTS.map(i => ({
    id: i.id as InstrumentId | null,
    name: this.i18n.t(i.name),
  })));
  private readonly actionColumnWidth = 55;
  private readonly offsetWidth = (this.actionColumnWidth + 5) * 4;

  private readonly boardElementRef = inject(ElementRef<HTMLElement>);

  private sustain = signal<number>(1000);

  protected readonly tuning = this.tuningService.tuning;
  protected readonly fretsCount = this.tuningService.fretsCount;

  protected readonly canAddString = computed(() => this.tuning().length < MAX_STRINGS);
  protected readonly canRemoveString = computed(() => this.tuning().length > MIN_STRINGS);

  public frets = computed(() => [...iterableRange(1, this.fretsCount())]);

  protected widthScaleFactor = computed(() => {
    const ref = this.boardElementRef;
    if (ref == null) return 1;
    const totalRatio = this.frets().reduce((total, a) => total + NoteHelper.calculateFretRatio(a), 0);
    return this.sustain() / totalRatio;
  });

  protected readonly fretboardTotalWidth = computed(() => {
    let total = ACTION_COLUMNS * this.actionColumnWidth;
    for (const f of this.frets()) total += this.getFretWidth(f);
    return total;
  });

  protected readonly stringsAreaHeight = computed(() => this.tuning().length * STRING_ROW_HEIGHT);

  protected readonly barreOverlays = computed(() => {
    const barres = this.chords.selectedPosition()?.barres ?? [];
    return barres
      .filter(b => b.fret >= 1)
      .map(barre => {
        let xStart = ACTION_COLUMNS * this.actionColumnWidth;
        for (let f = 1; f < barre.fret; f++) xStart += this.getFretWidth(f);
        const fretWidth = this.getFretWidth(barre.fret);
        return {
          x: xStart + fretWidth / 2 - BARRE_LINE_THICKNESS / 2,
          y: barre.fromString * STRING_ROW_HEIGHT,
          width: BARRE_LINE_THICKNESS,
          height: (barre.toString - barre.fromString + 1) * STRING_ROW_HEIGHT,
        };
      });
  });

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
  };

  public changeTuning(stringNumber: number, note: { note: Note | null, octave: number | null } | null) {
    if (note?.note == null || note.octave == null) return;
    this.tuning.update((currentTuning) => {
      const result = [...currentTuning];
      result[stringNumber] = { note: note.note!, octave: note.octave! };
      return result;
    });
  }

  public appendString() {
    if (this.tuning().length >= MAX_STRINGS) return;
    this.tuning.update((currentTuning: TuningString[]) => {
      const lastStringTuning = currentTuning[currentTuning.length - 1];
      if (lastStringTuning.octave === 0 && lastStringTuning.note < 5)
        return [...currentTuning, lastStringTuning];
      return [...currentTuning, this.getNextTuningNote(lastStringTuning, -5)];
    });
  }

  public insertString() {
    if (this.tuning().length >= MAX_STRINGS) return;
    this.tuning.update((currentTuning: TuningString[]) => {
      const firstStringTuning = currentTuning[0];
      if (firstStringTuning.octave === 8 && firstStringTuning.note < 5) return [firstStringTuning, ...currentTuning];
      return [this.getNextTuningNote(firstStringTuning, 5), ...currentTuning];
    });
  }

  public onInstrumentChange(id: InstrumentId | null): void {
    if (id) this.tuningService.applyInstrument(id);
  }

  private getNextTuningNote(currentTuning: TuningString, offset: number): TuningString {
    const note = (currentTuning.note + offset + 12) % 12;
    const octave = Math.floor((currentTuning.note + offset + 12 * currentTuning.octave) / 12);
    return { note, octave };
  }

  public removeString(stringNumber: number) {
    if (this.tuning().length <= MIN_STRINGS) return;
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
