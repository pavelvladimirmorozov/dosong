import { computed, inject, Injectable, signal } from "@angular/core";

import { DOUBLE_SHARP, FLAT, SHARP } from "@utils/constants";
import { NoteHelper, NoteSpelling } from "@utils/helpers";

import {
  SHARP_NOTES,
  FLAT_NOTES,
  FLAT_KEYS_MAJOR,
  FLAT_KEYS_MINOR,
} from "../scale-steps/scale-steps.constants";
import { ScaleSteepsService } from "../scale-steps/scale-steps.service";
import { NoteInfo, ScaleQuality } from "../scale-steps/scale-steps.types";

const DIATONIC_STEP_COUNT = 7;

@Injectable({ providedIn: 'root' })
export class NoteNamesManager {
  private readonly scaleSteepsManager = inject(ScaleSteepsService);

  public useGammaNotes = signal(true);

  public noteNames = computed<NoteInfo[]>(() => {
    if (!this.useGammaNotes()) return SHARP_NOTES;

    const tonicId = this.scaleSteepsManager.selectedTonic();
    const scale = this.scaleSteepsManager.selectedScaleDef();
    const spelled = this.spellScaleNotes(tonicId, scale.steps);
    const fallback = this.pickFallback(tonicId, scale.type, spelled);

    return SHARP_NOTES.map(({ id }) => ({
      id,
      name: spelled.get(id) ?? fallback[id].name,
    }));
  });

  public getNoteName(note: number): string {
    return this.noteNames()[NoteHelper.getNoteIndex(note)].name;
  }

  private spellScaleNotes(
    tonicId: number,
    steps: { interval: number | null }[],
  ): Map<number, string> {
    const result = new Map<number, string>();
    // Буквенное именование работает только для 7-ступенных ладов (диатоника и пентатоники).
    // Для хроматизма/блюза (≠7 ступеней) полагаемся на fallback-таблицу.
    if (steps.length !== DIATONIC_STEP_COUNT) return result;

    const tonic = NoteSpelling.parse(SHARP_NOTES[tonicId].name);

    steps.forEach((step, index) => {
      if (step.interval == null) return;
      const midi = (tonicId + step.interval) % 12;
      if (result.has(midi)) return;
      result.set(midi, NoteSpelling.spellStep(tonic, index, step.interval));
    });
    return result;
  }

  private pickFallback(
    tonicId: number,
    scaleType: ScaleQuality,
    spelled: Map<number, string>,
  ): NoteInfo[] {
    const names = Array.from(spelled.values());
    const hasFlat = names.some(n => n.includes(FLAT));
    const hasSharp = names.some(n => n.includes(SHARP) || n.includes(DOUBLE_SHARP));
    if (hasFlat && !hasSharp) return FLAT_NOTES;
    if (hasSharp && !hasFlat) return SHARP_NOTES;

    // Смешанный случай или нет спеллинга (хроматизм/блюз) — ориентируемся на тонику:
    const flatKeys = scaleType === ScaleQuality.Minor ? FLAT_KEYS_MINOR : FLAT_KEYS_MAJOR;
    return flatKeys.includes(tonicId) ? FLAT_NOTES : SHARP_NOTES;
  }
}
