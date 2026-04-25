import { ScaleStepQuality } from '@services/scale-steps/scale-steps.types';

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

export function qualitySuffix(quality: ScaleStepQuality): string {
  if (quality === ScaleStepQuality.Diminished) return '°';
  if (quality === ScaleStepQuality.Augmented) return '+';
  return '';
}
