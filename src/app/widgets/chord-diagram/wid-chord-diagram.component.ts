import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';

import { ChordPosition } from '@services/chords';
import { TuningService } from '@services/tuning';

interface DiagramDot {
  x: number;
  y: number;
  finger: number | null;
}

interface DiagramMarker {
  x: number;
  y: number;
  symbol: 'O' | 'X';
}

interface DiagramBarre {
  x: number;
  y: number;
  width: number;
  height: number;
  finger: number | null;
}

const STRING_GAP = 18;
const FRET_GAP = 26;
const LEFT_PAD = 24;
const TOP_PAD = 14;
const RIGHT_PAD = 8;
const BOTTOM_PAD = 6;
const FRET_COLS = 4;
const DOT_RADIUS = 7;

@Component({
  selector: 'wid-chord-diagram',
  imports: [],
  templateUrl: './wid-chord-diagram.component.html',
  styleUrl: './wid-chord-diagram.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WidChordDiagram {
  public position = input.required<ChordPosition>();

  private readonly tuning = inject(TuningService);

  protected readonly stringsCount = computed(() => this.tuning.tuning().length);

  protected readonly baseFret = computed(() => {
    const pos = this.position();
    if (pos.minFret === 0 && pos.maxFret === 0) return 1;
    return pos.minFret;
  });

  protected readonly width = computed(() => LEFT_PAD + FRET_COLS * FRET_GAP + RIGHT_PAD);
  protected readonly height = computed(() => TOP_PAD + (this.stringsCount() - 1) * STRING_GAP + BOTTOM_PAD);

  protected readonly markers = computed<DiagramMarker[]>(() => {
    const pos = this.position();
    const result: DiagramMarker[] = [];
    for (let s = 0; s < this.stringsCount(); s++) {
      const f = pos.fretsByString.get(s);
      if (f == null) {
        result.push({ x: LEFT_PAD - 11, y: this.stringY(s), symbol: 'X' });
      } else if (f === 0) {
        result.push({ x: LEFT_PAD - 11, y: this.stringY(s), symbol: 'O' });
      }
    }
    return result;
  });

  protected readonly dots = computed<DiagramDot[]>(() => {
    const pos = this.position();
    const base = this.baseFret();
    const result: DiagramDot[] = [];
    const covered = new Set<string>();
    for (const barre of pos.barres) {
      for (let s = barre.fromString; s <= barre.toString; s++) {
        if (pos.fretsByString.get(s) === barre.fret) covered.add(`${s}:${barre.fret}`);
      }
    }
    for (const [s, f] of pos.fretsByString) {
      if (f == null || f === 0) continue;
      if (covered.has(`${s}:${f}`)) continue;
      const col = f - base;
      if (col < 0 || col >= FRET_COLS) continue;
      result.push({
        x: LEFT_PAD + col * FRET_GAP + FRET_GAP / 2,
        y: this.stringY(s),
        finger: pos.fingering.get(s) ?? null,
      });
    }
    return result;
  });

  protected readonly barreShapes = computed<DiagramBarre[]>(() => {
    const pos = this.position();
    const base = this.baseFret();
    const result: DiagramBarre[] = [];
    for (const barre of pos.barres) {
      const col = barre.fret - base;
      if (col < 0 || col >= FRET_COLS) continue;
      const y1 = this.stringY(barre.fromString);
      const y2 = this.stringY(barre.toString);
      const finger = pos.fingering.get(barre.fromString) ?? null;
      const cx = LEFT_PAD + col * FRET_GAP + FRET_GAP / 2;
      result.push({
        x: cx - DOT_RADIUS,
        y: y1 - DOT_RADIUS,
        width: DOT_RADIUS * 2,
        height: y2 - y1 + DOT_RADIUS * 2,
        finger,
      });
    }
    return result;
  });

  protected readonly fretLineXs = computed(() => {
    const arr: number[] = [];
    for (let i = 0; i <= FRET_COLS; i++) arr.push(LEFT_PAD + i * FRET_GAP);
    return arr;
  });

  protected readonly stringYs = computed(() => {
    const arr: number[] = [];
    for (let s = 0; s < this.stringsCount(); s++) arr.push(this.stringY(s));
    return arr;
  });

  protected readonly stringsLeftX = LEFT_PAD;
  protected readonly stringsRightX = computed(() => LEFT_PAD + FRET_COLS * FRET_GAP);
  protected readonly stringsTopY = TOP_PAD;
  protected readonly stringsBottomY = computed(() => TOP_PAD + (this.stringsCount() - 1) * STRING_GAP);
  protected readonly showNut = computed(() => this.baseFret() === 1);
  protected readonly baseFretLabel = computed(() => `${this.baseFret()}`);

  protected stringY(s: number): number {
    return TOP_PAD + s * STRING_GAP;
  }
}
