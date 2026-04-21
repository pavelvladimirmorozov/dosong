import { Note } from '@services/scale-steps/scale-steps.types';

import { Point } from './cuart-circle-geometry';

export interface SectorChord {
  id: Note;
  name: string;
}

export interface SectorRenderState {
  sector: number;
  isMinor: boolean;
  chord: SectorChord;
  path: string;
  chordTextPos: Point;
  numeralTextPos: Point;
  fillColor: string | null;
  textColor: string;
  strokeColor: string;
  numeral: string | null;
}
