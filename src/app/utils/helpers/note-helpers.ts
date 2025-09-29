import { Note, ScaleStep } from "@services/scale-steps/scale-steps.types";

export class NoteHelper {
  public static getNoteIndex(startIndex: number, offset: number = 0): Note {
    return (startIndex + offset) % 12;
  }

  public static calculateFretRatio(offset: number): number {
    if (offset === 0) return 0;
    return 1 / Math.pow(2, (offset - 0.5) / 12);
  }
  public static formatSteps(scaleSteps: ScaleStep[]) {
    let prev = 0;
    return scaleSteps.filter((x) => x?.interval != null).map((current) => {
      const step = current.interval! - prev;
      prev = current.interval!;
      return (step / 2) < 1 ? 'полутон' : (step / 2) > 1 ? `${step / 2} тона` : 'тон';
    });
  }
}
