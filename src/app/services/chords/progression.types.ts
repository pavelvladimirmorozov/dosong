import { Note, Scale, ScaleStepQuality } from '@services/scale-steps/scale-steps.types';
import { TuningString } from '@services/tuning';

import { ChordModifier } from './chords.modifiers';

/** Снимок настроек, действовавших при создании прогрессии (тональность + строй). */
export interface ProgressionContext {
  tonic: Note;
  scale: Scale;
  tuning: TuningString[];
  fretsCount: number;
}

export interface ProgressionSlot {
  id: string;
  /** Корень аккорда. null = пустой слот (пауза). */
  root: Note | null;
  baseQuality: ScaleStepQuality.Major | ScaleStepQuality.Minor;
  modifier: ChordModifier;
  beats: number;
  positionId: string | null;
}

export interface Progression {
  id: string;
  name: string;
  slots: ProgressionSlot[];
  context?: ProgressionContext;
}

export const SLOT_BEATS_OPTIONS: readonly number[] = [1, 2, 3, 4, 6, 8];
