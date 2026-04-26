import { computed, effect, inject, Injectable, signal } from '@angular/core';

import { I18nService } from '@services/i18n';
import { NoteColorsService } from '@services/note-colors/note-colors.service';
import { NoteColorsStyle } from '@services/note-colors/note-colors.types';
import { NoteNamesManager } from '@services/note-names/note-names.service';
import { ScaleSteepsService } from '@services/scale-steps/scale-steps.service';
import { Note, ScaleStepQuality } from '@services/scale-steps/scale-steps.types';
import { TuningService } from '@services/tuning';
import { ROMAN_NUMERALS } from '@utils/constants';
import { NoteHelper } from '@utils/helpers';

import { CHORD_INTERVALS } from './chords.constants';
import { decorateChordName, qualitySuffix } from './chords.utils';

const POSITION_WINDOW = 4;
const BARRE_MIN_STRINGS = 3;
const MIN_USED_STRINGS = 3;
const MAX_FINGERS = 4;

export interface DiatonicChord {
  root: Note;
  isMinor: boolean;
  name: string;
  numeral: string;
  stepNumber: number;
  type: ScaleStepQuality;
  notes: ReadonlySet<Note>;
  color: NoteColorsStyle;
}

export interface ChordPositionBarre {
  fret: number;
  fromString: number;
  toString: number;
}

export interface ChordPosition {
  id: string;
  minFret: number;
  maxFret: number;
  fretsByString: ReadonlyMap<number, number | null>;
  fingering: ReadonlyMap<number, number | null>;
  barres: readonly ChordPositionBarre[];
  label: string;
}

interface VoicingCandidate {
  picks: (number | null)[];
  fretsByString: Map<number, number | null>;
  fingering: Map<number, number | null>;
  barres: ChordPositionBarre[];
  minFret: number;
  maxFret: number;
  score: number;
}

@Injectable({ providedIn: 'root' })
export class ChordsService {
  private readonly scaleSteeps = inject(ScaleSteepsService);
  private readonly colors = inject(NoteColorsService);
  private readonly noteNames = inject(NoteNamesManager);
  private readonly tuning = inject(TuningService);
  private readonly i18n = inject(I18nService);

  public readonly diatonicChords = computed<DiatonicChord[]>(() => {
    const noteNames = this.noteNames.noteNames();
    const result: DiatonicChord[] = [];
    for (const step of this.scaleSteeps.selectedScaleState()) {
      const chord = this.buildChord(step.midiNote, step.interval, step.type, step.stepNumber, noteNames);
      if (chord) result.push(chord);
    }
    return result;
  });

  public readonly selectedChord = signal<DiatonicChord | null>(null);

  public readonly highlightedNotes = computed<ReadonlySet<Note>>(
    () => this.selectedChord()?.notes ?? new Set<Note>(),
  );

  public readonly availablePositions = computed<ChordPosition[]>(() => {
    const chord = this.selectedChord();
    if (!chord) return [];
    return this.computePositions(chord);
  });

  public readonly selectedPositionId = signal<string | null>(null);

  public readonly selectedPosition = computed<ChordPosition | null>(() => {
    const id = this.selectedPositionId();
    if (id == null) return null;
    return this.availablePositions().find(p => p.id === id) ?? null;
  });

  constructor() {
    effect(() => {
      this.scaleSteeps.selectedTonic();
      this.scaleSteeps.selectedScale();
      this.selectedChord.set(null);
    });

    effect(() => {
      this.selectedChord();
      this.tuning.tuning();
      this.tuning.fretsCount();
      this.selectedPositionId.set(null);
    });
  }

  public toggle(chord: DiatonicChord): void {
    const current = this.selectedChord();
    const same = current && current.root === chord.root && current.isMinor === chord.isMinor;
    this.selectedChord.set(same ? null : chord);
  }

  public isSelected(chord: DiatonicChord): boolean {
    const current = this.selectedChord();
    return current != null && current.root === chord.root && current.isMinor === chord.isMinor;
  }

  public isChordFret(stringIndex: number, fret: number): boolean {
    const position = this.selectedPosition();
    if (position) {
      return position.fretsByString.get(stringIndex) === fret;
    }
    const chord = this.selectedChord();
    if (!chord) return false;
    return chord.notes.has(this.tuning.noteAt(stringIndex, fret));
  }

  public isStringMuted(stringIndex: number): boolean {
    const position = this.selectedPosition();
    if (!position) return false;
    return position.fretsByString.get(stringIndex) == null;
  }

  private buildChord(
    midiNote: Note | null,
    interval: number | null,
    type: ScaleStepQuality,
    stepNumber: number,
    noteNames: { name: string }[],
  ): DiatonicChord | null {
    if (midiNote == null || interval == null) return null;
    if (type === ScaleStepQuality.None || type === ScaleStepQuality.Any) return null;

    const intervals = CHORD_INTERVALS[type];
    if (intervals.length === 0) return null;

    const isMinor = type === ScaleStepQuality.Minor || type === ScaleStepQuality.Diminished;
    const baseName = noteNames[midiNote].name;

    return {
      root: midiNote,
      isMinor,
      name: decorateChordName(baseName, isMinor, type),
      numeral: ROMAN_NUMERALS[stepNumber] + qualitySuffix(type),
      stepNumber,
      type,
      notes: new Set(intervals.map(i => NoteHelper.getNoteIndex(midiNote, i))),
      color: this.colors.getNoteColor(midiNote, stepNumber),
    };
  }

  private computePositions(chord: DiatonicChord): ChordPosition[] {
    const tuning = this.tuning.tuning();
    const fretsCount = this.tuning.fretsCount();
    const stringsCount = tuning.length;
    const minStrings = Math.min(MIN_USED_STRINGS, stringsCount);
    const intervals = CHORD_INTERVALS[chord.type];
    const root = chord.root;
    const third = NoteHelper.getNoteIndex(chord.root, intervals[1]);
    const fifth = NoteHelper.getNoteIndex(chord.root, intervals[2]);

    const positions: ChordPosition[] = [];
    const seen = new Set<string>();

    for (let windowStart = 0; windowStart <= fretsCount; windowStart++) {
      const windowEnd = Math.min(fretsCount, windowStart + POSITION_WINDOW - 1);
      const candidatesPerString = this.candidatesInWindow(chord, windowStart, windowEnd, stringsCount);
      const best = this.findBestVoicing(candidatesPerString, root, third, fifth, minStrings);
      if (!best) continue;

      const id = this.positionKey(best.fretsByString);
      if (seen.has(id)) continue;
      seen.add(id);

      positions.push({
        id,
        minFret: best.minFret,
        maxFret: best.maxFret,
        fretsByString: best.fretsByString,
        fingering: best.fingering,
        barres: best.barres,
        label: this.positionLabel(best.minFret, best.maxFret),
      });
    }

    positions.sort((a, b) => a.minFret - b.minFret || a.maxFret - b.maxFret);
    return positions;
  }

  private candidatesInWindow(chord: DiatonicChord, windowStart: number, windowEnd: number, stringsCount: number): number[][] {
    const result: number[][] = [];
    for (let s = 0; s < stringsCount; s++) {
      const cands: number[] = [];
      for (let f = windowStart; f <= windowEnd; f++) {
        if (chord.notes.has(this.tuning.noteAt(s, f))) cands.push(f);
      }
      result.push(cands);
    }
    return result;
  }

  private findBestVoicing(
    candidatesPerString: number[][],
    root: Note,
    third: Note,
    fifth: Note,
    minStrings: number,
  ): VoicingCandidate | null {
    const N = candidatesPerString.length;
    let best: VoicingCandidate | null = null;

    for (let low = 0; low + minStrings - 1 < N; low++) {
      for (let high = low + minStrings - 1; high < N; high++) {
        let canFill = true;
        for (let s = low; s <= high; s++) {
          if (candidatesPerString[s].length === 0) { canFill = false; break; }
        }
        if (!canFill) continue;

        const indices: number[] = new Array(high - low + 1).fill(0);
        while (true) {
          const picks: (number | null)[] = new Array(N).fill(null);
          for (let i = 0; i <= high - low; i++) {
            picks[low + i] = candidatesPerString[low + i][indices[i]];
          }
          const result = this.evaluateVoicing(picks, root, third, fifth);
          if (result && (!best || result.score > best.score)) best = result;

          let pos = indices.length - 1;
          while (pos >= 0 && indices[pos] >= candidatesPerString[low + pos].length - 1) {
            indices[pos] = 0;
            pos--;
          }
          if (pos < 0) break;
          indices[pos]++;
        }
      }
    }

    return best;
  }

  private evaluateVoicing(
    picks: (number | null)[],
    root: Note,
    third: Note,
    fifth: Note,
  ): VoicingCandidate | null {
    let hasRoot = false, hasThird = false, hasFifth = false;
    let bassPitch = Infinity;
    let bassNote: Note | null = null;
    let minClosedFret = Infinity;
    let maxClosedFret = -Infinity;
    let usedStrings = 0;

    for (let s = 0; s < picks.length; s++) {
      const f = picks[s];
      if (f == null) continue;
      usedStrings++;
      const note = this.tuning.noteAt(s, f);
      if (note === root) hasRoot = true;
      if (note === third) hasThird = true;
      if (note === fifth) hasFifth = true;
      const pitch = this.tuning.midiAt(s, f);
      if (pitch < bassPitch) {
        bassPitch = pitch;
        bassNote = note;
      }
      if (f > 0) {
        if (f < minClosedFret) minClosedFret = f;
        if (f > maxClosedFret) maxClosedFret = f;
      }
    }

    if (!hasRoot || !hasThird || !hasFifth) return null;

    const span = maxClosedFret === -Infinity ? 0 : maxClosedFret - minClosedFret;
    if (span >= POSITION_WINDOW) return null;

    const fretsByString = new Map<number, number | null>();
    for (let s = 0; s < picks.length; s++) fretsByString.set(s, picks[s]);

    const safeMinFret = minClosedFret === Infinity ? 0 : minClosedFret;
    const barres = this.findAllBarres(fretsByString, safeMinFret);
    const indexBarre = barres.find(b => b.fret === safeMinFret) ?? null;
    const fingering = this.computeFingering(fretsByString, indexBarre);
    if (fingering === null) return null;

    let score = 0;
    if (bassNote === root) score += 100;
    else if (bassNote === fifth) score += 30;
    else score -= 10;
    score += usedStrings * 5;
    score -= span * 3;
    if (indexBarre) score -= 2;
    if (safeMinFret <= 3) score += 5;

    return {
      picks,
      fretsByString,
      fingering,
      barres,
      minFret: safeMinFret,
      maxFret: maxClosedFret === -Infinity ? 0 : maxClosedFret,
      score,
    };
  }

  private computeFingering(
    fretsByString: ReadonlyMap<number, number | null>,
    barre: ChordPositionBarre | null,
  ): Map<number, number | null> | null {
    const fingering = new Map<number, number | null>();
    for (const s of fretsByString.keys()) fingering.set(s, null);

    if (barre) {
      for (let s = barre.fromString; s <= barre.toString; s++) {
        if (fretsByString.get(s) === barre.fret) fingering.set(s, 1);
      }
    }

    const fretGroups = new Map<number, number[]>();
    for (const [s, f] of fretsByString) {
      if (f == null || f === 0) continue;
      if (fingering.get(s) != null) continue;
      const arr = fretGroups.get(f) ?? [];
      arr.push(s);
      fretGroups.set(f, arr);
    }

    const sortedFrets = [...fretGroups.keys()].sort((a, b) => a - b);
    let nextFinger = barre ? 2 : 1;

    for (const fret of sortedFrets) {
      const strings = fretGroups.get(fret)!.sort((a, b) => a - b);
      const isContiguous = strings.every((s, i) => i === 0 || s === strings[i - 1] + 1);

      if (isContiguous && strings.length > 1) {
        if (nextFinger > MAX_FINGERS) return null;
        for (const s of strings) fingering.set(s, nextFinger);
        nextFinger++;
      } else {
        for (const s of strings) {
          if (nextFinger > MAX_FINGERS) return null;
          fingering.set(s, nextFinger);
          nextFinger++;
        }
      }
    }

    return fingering;
  }

  private findAllBarres(
    fretsByString: ReadonlyMap<number, number | null>,
    minClosedFret: number,
  ): ChordPositionBarre[] {
    const result: ChordPositionBarre[] = [];

    const fretToStrings = new Map<number, number[]>();
    for (const [s, f] of fretsByString) {
      if (f == null || f === 0) continue;
      const arr = fretToStrings.get(f) ?? [];
      arr.push(s);
      fretToStrings.set(f, arr);
    }

    for (const [fret, strings] of fretToStrings) {
      strings.sort((a, b) => a - b);
      if (strings.length < 2) continue;

      // Index barre at the lowest closed fret extends across all strings in [from..to]
      // that play at >= fret (they're "under" the index finger).
      if (fret === minClosedFret) {
        const fromString = strings[0];
        const toString = strings[strings.length - 1];
        if (toString - fromString + 1 >= BARRE_MIN_STRINGS) {
          let valid = true;
          for (let s = fromString; s <= toString; s++) {
            const pick = fretsByString.get(s);
            if (pick == null || pick < fret) { valid = false; break; }
          }
          if (valid) {
            result.push({ fret, fromString, toString });
            continue;
          }
        }
      }

      // Mini-barre: any contiguous run of >=2 strings sharing this fret.
      let runStart = strings[0];
      let runEnd = strings[0];
      for (let i = 1; i < strings.length; i++) {
        if (strings[i] === runEnd + 1) {
          runEnd = strings[i];
        } else {
          if (runEnd > runStart) result.push({ fret, fromString: runStart, toString: runEnd });
          runStart = strings[i];
          runEnd = strings[i];
        }
      }
      if (runEnd > runStart) result.push({ fret, fromString: runStart, toString: runEnd });
    }

    return result;
  }

  private positionLabel(minFret: number, maxFret: number): string {
    if (minFret === 0 && maxFret === 0) return this.i18n.t('chords.openShort');
    if (minFret === maxFret) return `${minFret}`;
    return `${minFret}–${maxFret}`;
  }

  private positionKey(fretsByString: ReadonlyMap<number, number | null>): string {
    const parts: string[] = [];
    for (const [s, f] of fretsByString) parts.push(`${s}:${f ?? '-'}`);
    return parts.join('|');
  }
}
