import { Injectable, signal, computed, inject } from "@angular/core";

import { I18nService } from "@services/i18n";
import { NoteHelper } from "@utils/helpers/note-helpers";

import {
  SHARP_NOTES,
  SCALE_STEPS,
  SCALE_QUALITY_OPTIONS,
  SCALE_KIND_OPTIONS,
} from "./scale-steps.constants";
import { Note, Scale, ScaleKind, ScaleQuality, ScaleSteepState } from "./scale-steps.types";

@Injectable({ providedIn: 'root' })
export class ScaleSteepsService {
  private readonly i18n = inject(I18nService);

  public readonly tonicOptions = SHARP_NOTES;
  public readonly scaleStepsOptions = computed(() => SCALE_STEPS);
  public readonly qualityOptions = computed(() => this.i18n.translateOptions(SCALE_QUALITY_OPTIONS));

  public selectedScale = signal<Scale>(Scale.Major);

  public selectedTonic = signal(Note.C);

  public selectedScaleDef = computed(() =>
    this.scaleStepsOptions().find(x => x.id === this.selectedScale())!
  );

  public selectedScaleType = computed(() => this.selectedScaleDef().type);
  public selectedQuality = computed(() => this.selectedScaleDef().type);
  public selectedKind = computed(() => this.selectedScaleDef().kind);

  /** Виды, доступные для текущего качества (оттенка) */
  public availableKindOptions = computed(() => {
    const quality = this.selectedQuality();
    const kindsForQuality = new Set(SCALE_STEPS.filter(s => s.type === quality).map(s => s.kind));
    const filtered = SCALE_KIND_OPTIONS.filter(opt => opt.id != null && kindsForQuality.has(opt.id));
    return this.i18n.translateOptions(filtered);
  });

  public selectedScaleState = computed<ScaleSteepState[]>(() => {
    const tonic = this.selectedTonic();
    return this.selectedScaleDef().steps.map((step, index) => ({
      midiNote: step.interval != null ? NoteHelper.getNoteIndex(tonic, step.interval) : null,
      interval: step.interval,
      type: step.type,
      stepNumber: index,
    }));
  });

  /** Переключает качество, сохраняя текущий вид если возможно, иначе откат на первый доступный */
  public setQuality(quality: ScaleQuality | null): void {
    if (quality == null) return;
    const currentKind = this.selectedKind();
    const match = SCALE_STEPS.find(s => s.type === quality && s.kind === currentKind)
      ?? SCALE_STEPS.find(s => s.type === quality);
    if (match) this.selectedScale.set(match.id);
  }

  /** Переключает вид, сохраняя текущее качество если возможно, иначе ищет любой лад с таким видом */
  public setKind(kind: ScaleKind | null): void {
    if (kind == null) return;
    const currentQuality = this.selectedQuality();
    const match = SCALE_STEPS.find(s => s.type === currentQuality && s.kind === kind)
      ?? SCALE_STEPS.find(s => s.kind === kind);
    if (match) this.selectedScale.set(match.id);
  }

  /** Возвращает номер ступени для ноты в выбранной тональности или null */
  public getScaleStep(currentNote: Note) {
    const state = this.selectedScaleState().find(x => x.midiNote === currentNote);
    return state ?? null;
  }
}
