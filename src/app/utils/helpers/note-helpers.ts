import { SHARP_NOTES } from "../constants/notes";
import { Note, NoteInfo } from "../models/note-info";

export class NoteHelper {
  public static getNoteIndex(startIndex: number, offset: number = 0): Note {
    return (startIndex + offset) % SHARP_NOTES.length;
  }

  public static getNote(startNoteIndex: number, offset: number = 0): NoteInfo | null {
    const noteIndex = NoteHelper.getNoteIndex(startNoteIndex, offset);
    const note = SHARP_NOTES[noteIndex];
    return note ?? null;
  }

  public static getNoteName(note: number | undefined | null): string {
    if (note == null) return 'X'
    return NoteHelper.getNote(note)?.name ?? '?';
  }

  public static calculateFretRatio(offset: number): number {
    if (offset === 0) return 0;
    return 1 / Math.pow(2, (offset - 0.5) / 12);
  }

  public static calculateScaleStep(formula: (number | null)[], tonicNoteIndex: Note, currentNoteIndex: Note) {
    const tonicaOffset = (12 - tonicNoteIndex + currentNoteIndex) % 12;
    return formula.indexOf(tonicaOffset) ?? -1;
  }

  public static calculateDynamicOpacity(scaleStep: number) {
    if (scaleStep === 0) return 255;
    return (scaleStep > 0)
      ? Math.round(255 * (3 / (scaleStep + 4)))
      : 0;
  }

  public static calculateStaticOpacity(scaleStep?: number) {
    return scaleStep && scaleStep < 0 ? 0 : 255;
  }

  public static mergeColorWithOpacity(color: string, opacity: number) {
    return color.slice(0, 7) + opacity.toString(16).padStart(2, '0');
  }

  public static formatSteps(scaleSteps: (number | null)[]) {
    let prev = 0;
    return scaleSteps.filter((x) => x != null).map((current) => {
      const step = current - prev;
      prev = current;
      return (step / 2) < 1 ? 'полутон' : (step / 2) > 1 ? `${step / 2} тона` : 'тон';
    });
  }
}
