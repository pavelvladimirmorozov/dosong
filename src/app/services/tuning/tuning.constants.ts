import { Note } from '@services/scale-steps/scale-steps.types';

import type { TuningString } from './tuning.service';

export type InstrumentId =
  | 'guitar'
  | 'bass'
  | 'guitar7'
  | 'ukulele'
  | 'domra'
  | 'balalaika'
  | 'mandolin'
  | 'banjo';

export interface Instrument {
  id: InstrumentId;
  name: string;
  tuning: TuningString[];
}

export const MIN_STRINGS = 3;
export const MAX_STRINGS = 7;

// Тюнинги задаются от высокой струны к низкой (струна 0 — верхняя на грифе и в диаграмме).
// Октавы в проекте сдвинуты на +1 от стандартной нотации MIDI: гитарное низкое E IRL = E2 → у нас E3.
// У реэнтрантных строев (укулеле, банджо) часть струн физически выше соседних по высоте — алгоритм
// поиска аккордов корректно учитывает это через TuningService.midiAt().

export const INSTRUMENTS: Instrument[] = [
  {
    id: 'guitar',
    name: 'instrument.guitar',
    tuning: [
      { note: Note.E, octave: 5 },
      { note: Note.B, octave: 4 },
      { note: Note.G, octave: 4 },
      { note: Note.D, octave: 4 },
      { note: Note.A, octave: 3 },
      { note: Note.E, octave: 3 },
    ],
  },
  {
    id: 'bass',
    name: 'instrument.bass',
    tuning: [
      { note: Note.G, octave: 3 },
      { note: Note.D, octave: 3 },
      { note: Note.A, octave: 2 },
      { note: Note.E, octave: 2 },
    ],
  },
  {
    id: 'guitar7',
    name: 'instrument.guitar7',
    tuning: [
      { note: Note.D, octave: 5 },
      { note: Note.B, octave: 4 },
      { note: Note.G, octave: 4 },
      { note: Note.D, octave: 4 },
      { note: Note.B, octave: 3 },
      { note: Note.G, octave: 3 },
      { note: Note.D, octave: 3 },
    ],
  },
  {
    id: 'ukulele',
    name: 'instrument.ukulele',
    tuning: [
      { note: Note.A, octave: 5 },
      { note: Note.E, octave: 5 },
      { note: Note.C, octave: 5 },
      { note: Note.G, octave: 5 },
    ],
  },
  {
    id: 'domra',
    name: 'instrument.domra',
    tuning: [
      { note: Note.D, octave: 6 },
      { note: Note.A, octave: 5 },
      { note: Note.E, octave: 5 },
    ],
  },
  {
    id: 'balalaika',
    name: 'instrument.balalaika',
    tuning: [
      { note: Note.A, octave: 5 },
      { note: Note.E, octave: 5 },
      { note: Note.E, octave: 5 },
    ],
  },
  {
    id: 'mandolin',
    name: 'instrument.mandolin',
    tuning: [
      { note: Note.E, octave: 6 },
      { note: Note.A, octave: 5 },
      { note: Note.D, octave: 5 },
      { note: Note.G, octave: 4 },
    ],
  },
  {
    id: 'banjo',
    name: 'instrument.banjo',
    tuning: [
      { note: Note.D, octave: 5 },
      { note: Note.B, octave: 4 },
      { note: Note.G, octave: 4 },
      { note: Note.D, octave: 4 },
      { note: Note.G, octave: 5 },
    ],
  },
];

export const DEFAULT_TUNING: TuningString[] = INSTRUMENTS[0].tuning;
