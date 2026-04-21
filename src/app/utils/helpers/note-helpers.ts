import { Note, ScaleStep } from "@services/scale-steps/scale-steps.types";
import { DOUBLE_SHARP, FLAT, SHARP } from "@utils/constants";

export class NoteHelper {
  public static getNoteIndex(startIndex: number, offset = 0): Note {
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

const LETTERS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'] as const;
const LETTER_MIDI = [0, 2, 4, 5, 7, 9, 11];

export interface ParsedNoteName {
  letterIdx: number;
  accidental: number;
}

export class NoteSpelling {
  public static parse(name: string): ParsedNoteName {
    const letterIdx = LETTERS.indexOf(name[0].toUpperCase() as typeof LETTERS[number]);
    let accidental = 0;
    for (let i = 1; i < name.length; i++) {
      const ch = name[i];
      if (ch === SHARP || ch === '#') accidental++;
      else if (ch === FLAT || ch === 'b') accidental--;
      else if (ch === DOUBLE_SHARP) accidental += 2;
    }
    return { letterIdx, accidental };
  }

  public static format(letterIdx: number, accidental: number): string {
    const letter = LETTERS[letterIdx];
    if (accidental === 0) return letter;
    if (accidental === 1) return letter + SHARP;
    if (accidental === 2) return letter + DOUBLE_SHARP;
    if (accidental > 0) return letter + SHARP.repeat(accidental);
    return letter + FLAT.repeat(-accidental);
  }

  /** Диатоническое именование: буква = (буква тоники + stepIdx) mod 7, альтерация подбирается по MIDI-разнице */
  public static spellStep(tonic: ParsedNoteName, stepIdx: number, intervalSemitones: number): string {
    const tonicMidi = (LETTER_MIDI[tonic.letterIdx] + tonic.accidental + 24) % 12;
    const letterIdx = (tonic.letterIdx + stepIdx) % 7;
    const targetMidi = (tonicMidi + intervalSemitones) % 12;
    let diff = targetMidi - LETTER_MIDI[letterIdx];
    if (diff > 6) diff -= 12;
    else if (diff < -6) diff += 12;
    return NoteSpelling.format(letterIdx, diff);
  }
}
