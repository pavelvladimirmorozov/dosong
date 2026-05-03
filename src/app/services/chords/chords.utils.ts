import { ScaleStepQuality } from '@services/scale-steps/scale-steps.types';

import { ChordModifier, formatModifierSuffix } from './chords.modifiers';

export function decorateChordName(baseName: string, isMinor: boolean, quality: ScaleStepQuality): string {
  const triad = isMinor ? baseName + 'm' : baseName;
  if (quality === ScaleStepQuality.Diminished) {
    return triad.endsWith('m') ? triad.slice(0, -1) + 'dim' : triad + 'dim';
  }
  if (quality === ScaleStepQuality.Augmented) {
    return triad + 'aug';
  }
  return triad;
}

export function formatChordName(
  baseName: string,
  isMinor: boolean,
  modifier: ChordModifier,
): string {
  const suffix = formatModifierSuffix(modifier);
  if (modifier === ChordModifier.Dim || modifier === ChordModifier.Aug || modifier === ChordModifier.Dim7 || modifier === ChordModifier.M7b5) {
    return baseName + suffix;
  }
  const triad = isMinor ? baseName + 'm' : baseName;
  return triad + suffix;
}

export function qualitySuffix(quality: ScaleStepQuality): string {
  if (quality === ScaleStepQuality.Diminished) return '°';
  if (quality === ScaleStepQuality.Augmented) return '+';
  return '';
}
