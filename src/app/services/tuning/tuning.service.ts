import { computed, inject, Injectable } from '@angular/core';

import { LocalStorageService } from '@services/local-storage/local-storage.service';
import { Note } from '@services/scale-steps/scale-steps.types';
import { NoteHelper } from '@utils/helpers';
import { persistedSignal } from '@utils/helpers/persisted-signal';

import { DEFAULT_TUNING, INSTRUMENTS, InstrumentId } from './tuning.constants';

export interface TuningString {
  note: Note;
  octave: number;
}

@Injectable({ providedIn: 'root' })
export class TuningService {
  private readonly storage = inject(LocalStorageService);

  public readonly tuning = persistedSignal<TuningString[]>(this.storage, 'tuning', DEFAULT_TUNING);
  public readonly fretsCount = persistedSignal<number>(this.storage, 'frets-count', 12);

  public readonly stringsCount = computed(() => this.tuning().length);

  public readonly selectedInstrument = computed<InstrumentId | null>(() => {
    const t = this.tuning();
    return INSTRUMENTS.find(i => sameTuning(i.tuning, t))?.id ?? null;
  });

  public noteAt(stringIndex: number, fret: number): Note {
    const start = this.tuning()[stringIndex];
    return NoteHelper.getNoteIndex(start.note, fret);
  }

  public midiAt(stringIndex: number, fret: number): number {
    const start = this.tuning()[stringIndex];
    return start.note + fret + 12 * start.octave;
  }

  public applyInstrument(id: InstrumentId): void {
    const instrument = INSTRUMENTS.find(i => i.id === id);
    if (!instrument) return;
    this.tuning.set(instrument.tuning.map(s => ({ ...s })));
  }
}

function sameTuning(a: TuningString[], b: TuningString[]): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i].note !== b[i].note || a[i].octave !== b[i].octave) return false;
  }
  return true;
}
