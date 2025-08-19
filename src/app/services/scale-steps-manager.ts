import { Injectable, signal, computed, effect } from "@angular/core";
import { SCALE_STEPS, SHARP_NOTES, CHORDS_SCALE_STEPS, SCALE_MODE_OPTIONS, ChordScale, Scale, ScaleMode } from "@utils/constants";
import { Note } from "@utils/models";
import { NoteHelper } from "@utils/helpers/note-helpers";

@Injectable({ providedIn: 'root' })
export class ScaleSteepsManager {
  public modeOptions = SCALE_MODE_OPTIONS;
  public readonly tonicOptions = SHARP_NOTES;
  public readonly scaleStepsOptions = computed(() =>
    this.selectedMode() === ScaleMode.Gamma ? SCALE_STEPS : CHORDS_SCALE_STEPS
  );

  public selectedMode = signal<ScaleMode>(ScaleMode.Gamma);
  private selectedModeChangeEffect = effect(() => {
    this.selectedScale.set(
      // TODOLow: Возможно стоит селать отдельные компоненты для выбора аккордов и гамм
      this.selectedMode() === ScaleMode.Chord ? ChordScale.MajorChord : Scale.Major
    );
  });

  public selectedScale = signal<Scale | ChordScale>(Scale.Major);

  public selectedTonic = signal(Note.C);

  public selectedScaleSteps = computed(() =>
  // TODO: Переделать на filter, чтобы не зависеть от порядка или перейти на словари
    this.scaleStepsOptions()[this.selectedScale()].steps
  );

  public selectedScaleIsMinor = computed(() =>
    this.scaleStepsOptions()[this.selectedScale()].isMinorStep
  );

  public selectedScaleType = computed(() =>
    this.scaleStepsOptions()[this.selectedScale()].type
  );

  /** Возвращает номер ступени для ноты (в выбранной тональности) */
  public getScaleStep(currentNote: Note) {
    return NoteHelper.calculateScaleStep(this.selectedScaleSteps(), this.selectedTonic(), currentNote);
  }

  public getScaleStepIsMinor(scaleStep: number): boolean | null {
    const result = this.selectedScaleIsMinor();
    if (typeof result === 'boolean')
      return result;
    return result?.[scaleStep] ?? null;
  }
}