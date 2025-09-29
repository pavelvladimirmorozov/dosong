import { Injectable, signal, computed } from "@angular/core";
import { NoteHelper } from "@utils/helpers/note-helpers";
import { Note, Scale, ScaleQuality, ScaleSteepState } from "./scale-steps.types";
import { SHARP_NOTES, SCALE_STEPS, FLAT_KEYS_MINOR, FLAT_KEYS_MAJOR, FLAT_NOTES } from "./scale-steps.constants";

@Injectable({ providedIn: 'root' })
export class ScaleSteepsService {
  public readonly tonicOptions = SHARP_NOTES;
  public readonly scaleStepsOptions = computed(() => SCALE_STEPS);

  public selectedScale = signal<Scale>(Scale.Major);

  public selectedTonic = signal(Note.C);

  public baseNotes = computed(() => {
    const keys = this.selectedScaleType() === ScaleQuality.Minor
      ? FLAT_KEYS_MINOR
      : FLAT_KEYS_MAJOR;

    return keys.includes(this.selectedTonic()) ? FLAT_NOTES : SHARP_NOTES;
  })

  public selectedScaleType = computed(() =>
    this.scaleStepsOptions().find(x => x.id === this.selectedScale())!.type
  );

  public selectedScaleState = computed(() => {
    const baseNotes = this.baseNotes();
    const scaleStepsNotes = this.scaleStepsOptions().find(x => x.id === this.selectedScale())!.steps.map((step, index) => {
      const midiNote = step.interval != null ? NoteHelper.getNoteIndex(this.selectedTonic(), step.interval) : null;
      return <ScaleSteepState>{
        name: midiNote != null ? baseNotes[midiNote].name : 'X',
        midiNote: midiNote,
        interval: step.interval,
        type: step.type,
        stepNumber: index,
      }
    });
    scaleStepsNotes.forEach((note) => {
      if (note.name === 'F' && scaleStepsNotes.some(x => x.name === 'D#') && !scaleStepsNotes.some(x => x.name === 'E')) {
        note.name = 'E#';
      }
      if (note.name === 'C' && scaleStepsNotes.some(x => x.name === 'A#') && !scaleStepsNotes.some(x => x.name === 'B')) {
        note.name = 'B#';
      }
    });
    return scaleStepsNotes
  });

  /** Возвращает номер ступени для ноты в выбранной тональности или null */
  public getScaleStep(currentNote: Note) {
    const state = this.selectedScaleState().find(x => x.midiNote === currentNote);
    return state;
  }
}