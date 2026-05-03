import { ComSelectOption } from '@components/select/com-select-option';

import { ScaleStepQuality } from '@services/scale-steps/scale-steps.types';

export enum ChordModifier {
  None,
  Sus2,
  Sus4,
  Six,
  Seven,
  Maj7,
  Add9,
  Nine,
  Dim,
  Dim7,
  M7b5,
  Aug,
}

const MAJOR_TRIAD: readonly number[] = [0, 4, 7];
const MINOR_TRIAD: readonly number[] = [0, 3, 7];

function triadFor(quality: ScaleStepQuality): readonly number[] {
  return quality === ScaleStepQuality.Minor ? MINOR_TRIAD : MAJOR_TRIAD;
}

export function getChordIntervals(quality: ScaleStepQuality, modifier: ChordModifier): readonly number[] {
  switch (modifier) {
    case ChordModifier.None:    return triadFor(quality);
    case ChordModifier.Sus2:    return [0, 2, 7];
    case ChordModifier.Sus4:    return [0, 5, 7];
    case ChordModifier.Six:     return [...triadFor(quality), 9];
    case ChordModifier.Seven:   return [...triadFor(quality), 10];
    case ChordModifier.Maj7:    return [...triadFor(quality), 11];
    case ChordModifier.Add9:    return [...triadFor(quality), 2];
    case ChordModifier.Nine:    return [...triadFor(quality), 10, 2];
    case ChordModifier.Dim:     return [0, 3, 6];
    case ChordModifier.Dim7:    return [0, 3, 6, 9];
    case ChordModifier.M7b5:    return [0, 3, 6, 10];
    case ChordModifier.Aug:     return [0, 4, 8];
  }
}

export function formatModifierSuffix(modifier: ChordModifier): string {
  switch (modifier) {
    case ChordModifier.None:    return '';
    case ChordModifier.Sus2:    return 'sus2';
    case ChordModifier.Sus4:    return 'sus4';
    case ChordModifier.Six:     return '6';
    case ChordModifier.Seven:   return '7';
    case ChordModifier.Maj7:    return 'maj7';
    case ChordModifier.Add9:    return 'add9';
    case ChordModifier.Nine:    return '9';
    case ChordModifier.Dim:     return 'dim';
    case ChordModifier.Dim7:    return 'dim7';
    case ChordModifier.M7b5:    return 'm7b5';
    case ChordModifier.Aug:     return 'aug';
  }
}

export const MODIFIER_OPTIONS: ComSelectOption<ChordModifier>[] = [
  { id: ChordModifier.None,  name: 'chordModifier.none' },
  { id: ChordModifier.Sus2,  name: 'chordModifier.sus2' },
  { id: ChordModifier.Sus4,  name: 'chordModifier.sus4' },
  { id: ChordModifier.Six,   name: 'chordModifier.six' },
  { id: ChordModifier.Seven, name: 'chordModifier.seven' },
  { id: ChordModifier.Maj7,  name: 'chordModifier.maj7' },
  { id: ChordModifier.Add9,  name: 'chordModifier.add9' },
  { id: ChordModifier.Nine,  name: 'chordModifier.nine' },
  { id: ChordModifier.Dim,   name: 'chordModifier.dim' },
  { id: ChordModifier.Dim7,  name: 'chordModifier.dim7' },
  { id: ChordModifier.M7b5,  name: 'chordModifier.m7b5' },
  { id: ChordModifier.Aug,   name: 'chordModifier.aug' },
];

export interface ChordSpec {
  baseQuality: ScaleStepQuality.Major | ScaleStepQuality.Minor;
  modifier: ChordModifier;
}

/** Преобразует тип ступени из SCALE_STEPS в пару (baseQuality, modifier) для слота прогрессии. */
export function chordSpecFromStepType(type: ScaleStepQuality): ChordSpec {
  switch (type) {
    case ScaleStepQuality.Major:      return { baseQuality: ScaleStepQuality.Major, modifier: ChordModifier.None };
    case ScaleStepQuality.Minor:      return { baseQuality: ScaleStepQuality.Minor, modifier: ChordModifier.None };
    case ScaleStepQuality.Diminished: return { baseQuality: ScaleStepQuality.Minor, modifier: ChordModifier.Dim };
    case ScaleStepQuality.Augmented:  return { baseQuality: ScaleStepQuality.Major, modifier: ChordModifier.Aug };
    default:                          return { baseQuality: ScaleStepQuality.Major, modifier: ChordModifier.None };
  }
}
