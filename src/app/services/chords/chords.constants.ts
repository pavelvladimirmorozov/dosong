import { ScaleStepQuality } from '@services/scale-steps/scale-steps.types';

export const CHORD_INTERVALS: Record<ScaleStepQuality, readonly number[]> = {
  [ScaleStepQuality.Major]:      [0, 4, 7],
  [ScaleStepQuality.Minor]:      [0, 3, 7],
  [ScaleStepQuality.Diminished]: [0, 3, 6],
  [ScaleStepQuality.Augmented]:  [0, 4, 8],
  [ScaleStepQuality.None]:       [],
  [ScaleStepQuality.Any]:        [],
};
