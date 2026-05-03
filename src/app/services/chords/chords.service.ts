import { computed, effect, inject, Injectable, signal } from '@angular/core';

import { I18nService } from '@services/i18n';
import { LocalStorageService } from '@services/local-storage/local-storage.service';
import { NoteColorsService } from '@services/note-colors/note-colors.service';
import { NoteColorsStyle } from '@services/note-colors/note-colors.types';
import { NoteNamesManager } from '@services/note-names/note-names.service';
import { ScaleSteepsService } from '@services/scale-steps/scale-steps.service';
import { Note, ScaleKind, ScaleQuality, ScaleStepQuality } from '@services/scale-steps/scale-steps.types';
import { TuningService } from '@services/tuning';
import { ROMAN_NUMERALS } from '@utils/constants';
import { NoteHelper } from '@utils/helpers';
import { persistedSignal } from '@utils/helpers/persisted-signal';

import { SCALE_STEPS } from '../scale-steps/scale-steps.constants';
import { CHORD_INTERVALS } from './chords.constants';
import { ChordModifier, chordSpecFromStepType, getChordIntervals } from './chords.modifiers';
import { decorateChordName, formatChordName, qualitySuffix } from './chords.utils';
import { Progression, ProgressionContext, ProgressionSlot } from './progression.types';

const POSITION_WINDOW = 4;
const BARRE_MIN_STRINGS = 3;
const MIN_USED_STRINGS = 3;
const MAX_FINGERS = 4;
const MIN_DISTINCT_CHORD_TONES = 3;

const POOL_KINDS: readonly ScaleKind[] = [ScaleKind.Natural, ScaleKind.Harmonic, ScaleKind.Melodic];

export interface DiatonicChord {
  root: Note;
  isMinor: boolean;
  name: string;
  numeral: string;
  stepNumber: number;
  type: ScaleStepQuality;
  notes: ReadonlySet<Note>;
  color: NoteColorsStyle;
  intervals: readonly number[];
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

interface ManualPickSpec {
  root: Note;
  /** Тип ступени из палитры — фиксирует, какая клетка палитры подсвечена, независимо от выбранного модификатора. */
  originalType: ScaleStepQuality;
  baseQuality: ScaleStepQuality.Major | ScaleStepQuality.Minor;
  modifier: ChordModifier;
}

@Injectable({ providedIn: 'root' })
export class ChordsService {
  private readonly scaleSteeps = inject(ScaleSteepsService);
  private readonly colors = inject(NoteColorsService);
  private readonly noteNames = inject(NoteNamesManager);
  private readonly tuning = inject(TuningService);
  private readonly i18n = inject(I18nService);
  private readonly storage = inject(LocalStorageService);

  public readonly diatonicChords = computed<DiatonicChord[]>(() => {
    const noteNames = this.noteNames.noteNames();
    const result: DiatonicChord[] = [];
    for (const step of this.scaleSteeps.selectedScaleState()) {
      const chord = this.buildChord(step.midiNote, step.interval, step.type, step.stepNumber, noteNames);
      if (chord) result.push(chord);
    }
    return result;
  });

  /** Заимствованные аккорды из связанных гамм того же качества — плоский уникальный список без дубликатов с основной гаммой. */
  public readonly chordPoolExtras = computed<DiatonicChord[]>(() => {
    const quality = this.scaleSteeps.selectedQuality();
    if (quality === ScaleQuality.None) return [];

    const tonic = this.scaleSteeps.selectedTonic();
    const mainKind = this.scaleSteeps.selectedKind();
    const noteNames = this.noteNames.noteNames();
    const seen = new Set(this.diatonicChords().map(c => `${c.root}:${c.type}`));

    const result: DiatonicChord[] = [];
    for (const kind of POOL_KINDS) {
      if (kind === mainKind) continue;
      const scale = SCALE_STEPS.find(s => s.type === quality && s.kind === kind);
      if (!scale) continue;

      scale.steps.forEach((step, index) => {
        if (step.interval == null) return;
        const midiNote = NoteHelper.getNoteIndex(tonic, step.interval);
        const chord = this.buildChord(midiNote, step.interval, step.type, index, noteNames);
        if (!chord) return;
        const key = `${chord.root}:${chord.type}`;
        if (seen.has(key)) return;
        seen.add(key);
        result.push(chord);
      });
    }
    return result;
  });

  // #region Прогрессии песен
  public readonly progressions = persistedSignal<Progression[]>(this.storage, 'chord-progressions', []);
  public readonly activeProgressionId = persistedSignal<string | null>(this.storage, 'active-progression-id', null);

  public readonly activeProgression = computed<Progression | null>(() => {
    const id = this.activeProgressionId();
    if (id == null) return null;
    return this.progressions().find(p => p.id === id) ?? null;
  });

  public createProgression(name: string): string {
    const id = this.generateId();
    const progression: Progression = { id, name, slots: [] };
    this.progressions.update(list => [...list, progression]);
    this.activeProgressionId.set(id);
    return id;
  }

  public renameProgression(id: string, name: string): void {
    this.progressions.update(list => list.map(p => p.id === id ? { ...p, name } : p));
  }

  public deleteProgression(id: string): void {
    this.progressions.update(list => list.filter(p => p.id !== id));
    if (this.activeProgressionId() === id) {
      this.activeProgressionId.set(null);
    }
  }

  public setProgressionContext(id: string, context: ProgressionContext): void {
    this.progressions.update(list => list.map(p => p.id === id ? { ...p, context } : p));
  }

  public addSlot(slot: Omit<ProgressionSlot, 'id'>): void {
    const id = this.activeProgressionId();
    if (id == null) return;
    const newSlot: ProgressionSlot = { ...slot, id: this.generateId() };
    this.progressions.update(list =>
      list.map(p => p.id === id ? { ...p, slots: [...p.slots, newSlot] } : p),
    );
  }

  public updateSlot(slotId: string, patch: Partial<Omit<ProgressionSlot, 'id'>>): void {
    const id = this.activeProgressionId();
    if (id == null) return;
    this.progressions.update(list =>
      list.map(p => p.id === id
        ? { ...p, slots: p.slots.map(s => s.id === slotId ? { ...s, ...patch } : s) }
        : p),
    );
  }

  public removeSlot(slotId: string): void {
    const id = this.activeProgressionId();
    if (id == null) return;
    this.progressions.update(list =>
      list.map(p => p.id === id
        ? { ...p, slots: p.slots.filter(s => s.id !== slotId) }
        : p),
    );
  }

  public moveSlot(slotId: string, direction: -1 | 1): void {
    const id = this.activeProgressionId();
    if (id == null) return;
    this.progressions.update(list =>
      list.map(p => {
        if (p.id !== id) return p;
        const idx = p.slots.findIndex(s => s.id === slotId);
        if (idx < 0) return p;
        const target = idx + direction;
        if (target < 0 || target >= p.slots.length) return p;
        const slots = [...p.slots];
        [slots[idx], slots[target]] = [slots[target], slots[idx]];
        return { ...p, slots };
      }),
    );
  }

  public buildChordFromSlot(slot: ProgressionSlot): DiatonicChord | null {
    if (slot.root == null) return null;
    const intervals = getChordIntervals(slot.baseQuality, slot.modifier);
    const noteNames = this.noteNames.noteNames();
    const baseName = noteNames[slot.root].name;
    const isMinor = slot.baseQuality === ScaleStepQuality.Minor;
    const name = formatChordName(baseName, isMinor, slot.modifier);
    const scaleStepInfo = this.scaleSteeps.getScaleStep(slot.root);
    const stepNumber = scaleStepInfo?.stepNumber ?? -1;
    const type = this.resolveStepQuality(slot.baseQuality, slot.modifier);
    const root = slot.root;
    return {
      root,
      isMinor,
      name,
      numeral: stepNumber >= 0 ? ROMAN_NUMERALS[stepNumber] + qualitySuffix(type) : '',
      stepNumber,
      type,
      notes: new Set(intervals.map(i => NoteHelper.getNoteIndex(root, i))),
      color: this.colors.getNoteColor(root, scaleStepInfo?.stepNumber),
      intervals,
    };
  }
  // #endregion

  // #region Выбор аккорда (manual + playback)
  /** Спецификация выбранного из палитры аккорда: корень + базовое качество + модификатор. originalType хранится для подсветки клетки палитры независимо от выбранного модификатора. */
  private readonly manualPick = signal<ManualPickSpec | null>(null);
  /** Длительность в долях для следующего добавления в прогрессию. Сохраняется между добавлениями. */
  public readonly manualPickBeats = signal<number>(4);

  public readonly manualPickModifier = computed<ChordModifier>(() => this.manualPick()?.modifier ?? ChordModifier.None);
  public readonly hasManualPick = computed<boolean>(() => this.manualPick() !== null);

  public readonly manualPickChord = computed<DiatonicChord | null>(() => {
    const spec = this.manualPick();
    if (!spec) return null;
    return this.buildChordFromSlot({
      id: '__manual_pick__',
      root: spec.root,
      baseQuality: spec.baseQuality,
      modifier: spec.modifier,
      beats: 4,
      positionId: null,
    });
  });

  /** Управляется ProgressionPlaybackService. */
  public readonly playbackActive = signal<boolean>(false);
  /** Аккорд из текущего слота прогрессии — записывается ProgressionPlaybackService. */
  public readonly playbackChord = signal<DiatonicChord | null>(null);

  public readonly selectedChord = computed<DiatonicChord | null>(() =>
    this.playbackActive() ? this.playbackChord() : this.manualPickChord(),
  );

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

  public toggle(chord: DiatonicChord): void {
    const current = this.manualPick();
    const same = current && current.root === chord.root && current.originalType === chord.type;
    if (same) {
      this.manualPick.set(null);
      return;
    }
    const spec = chordSpecFromStepType(chord.type);
    this.manualPick.set({
      root: chord.root,
      originalType: chord.type,
      baseQuality: spec.baseQuality,
      modifier: spec.modifier,
    });
  }

  public isSelected(chord: DiatonicChord): boolean {
    const current = this.manualPick();
    return current != null && current.root === chord.root && current.originalType === chord.type;
  }

  public setManualModifier(modifier: ChordModifier): void {
    const current = this.manualPick();
    if (!current) return;
    this.manualPick.set({ ...current, modifier });
  }

  public addSelectedToProgression(): void {
    if (this.activeProgressionId() == null) return;
    const spec = this.manualPick();
    if (spec == null) {
      // Пустой слот (пауза) — без аккорда, только длительность.
      this.addSlot({
        root: null,
        baseQuality: ScaleStepQuality.Major,
        modifier: ChordModifier.None,
        beats: this.manualPickBeats(),
        positionId: null,
      });
      return;
    }
    this.addSlot({
      root: spec.root,
      baseQuality: spec.baseQuality,
      modifier: spec.modifier,
      beats: this.manualPickBeats(),
      positionId: this.selectedPositionId(),
    });
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
  // #endregion

  constructor() {
    effect(() => {
      this.scaleSteeps.selectedTonic();
      this.scaleSteeps.selectedScale();
      this.manualPick.set(null);
    });

    effect(() => {
      this.manualPick();
      this.tuning.tuning();
      this.tuning.fretsCount();
      this.selectedPositionId.set(null);
    });
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
      intervals,
    };
  }

  private resolveStepQuality(
    baseQuality: ScaleStepQuality.Major | ScaleStepQuality.Minor,
    modifier: ChordModifier,
  ): ScaleStepQuality {
    if (modifier === ChordModifier.Dim || modifier === ChordModifier.Dim7 || modifier === ChordModifier.M7b5) {
      return ScaleStepQuality.Diminished;
    }
    if (modifier === ChordModifier.Aug) return ScaleStepQuality.Augmented;
    return baseQuality;
  }

  private computePositions(chord: DiatonicChord): ChordPosition[] {
    const tuning = this.tuning.tuning();
    const fretsCount = this.tuning.fretsCount();
    const stringsCount = tuning.length;
    const minStrings = Math.min(MIN_USED_STRINGS, stringsCount);
    const intervals = chord.intervals;
    const root = chord.root;
    const third = intervals.length > 1 ? NoteHelper.getNoteIndex(chord.root, intervals[1]) : root;
    const fifth = intervals.length > 2 ? NoteHelper.getNoteIndex(chord.root, intervals[2]) : root;

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
    let hasRoot = false;
    let bassPitch = Infinity;
    let bassNote: Note | null = null;
    let minClosedFret = Infinity;
    let maxClosedFret = -Infinity;
    let usedStrings = 0;
    const distinctNotes = new Set<Note>();

    for (let s = 0; s < picks.length; s++) {
      const f = picks[s];
      if (f == null) continue;
      usedStrings++;
      const note = this.tuning.noteAt(s, f);
      distinctNotes.add(note);
      if (note === root) hasRoot = true;
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

    if (!hasRoot) return null;
    if (distinctNotes.size < MIN_DISTINCT_CHORD_TONES) return null;

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
    else if (bassNote === third) score += 10;
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

  private generateId(): string {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
    return `id-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  }
}

