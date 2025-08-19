import { computed, inject, Injectable, signal } from "@angular/core";
import { FLAT_KEYS_MAJOR, FLAT_KEYS_MINOR, FLAT_NOTES, ScaleType, SHARP_NOTES } from "@utils/constants";
import { ScaleSteepsManager } from "./scale-steps-manager";
import { Note, NoteInfo } from "@utils/models";

@Injectable({ providedIn: 'root' })
export class NoteNamesManager {
  private readonly scaleSteepsManager = inject(ScaleSteepsManager);

  public useGammaNotes = signal(true);

  // TODO: Реализовать правильное наименование нот
  public noteNames = computed(() => {
    return SHARP_NOTES;
    // if (!this.useGammaNotes()) return SHARP_NOTES;
    // const tonic = this.scaleSteepsManager.selectedTonic();
    // const noteNames = (this.shouldUseFlats(tonic) ? FLAT_NOTES : SHARP_NOTES).map((x) => ({...x}));

    // const scaleSteps = this.scaleSteepsManager.getScaleStep();

    // const scaleStepsNotes = noteNames.filter(x => scaleSteps.includes(x.id))
    // scaleStepsNotes.forEach((note) => {
    //   if (note.name === 'F' && scaleStepsNotes.some(x => x.name === 'D#') && !scaleStepsNotes.some(x => x.name === 'E'))
    //     note.name = 'E#';
    //   if (note.name === 'C' && scaleStepsNotes.some(x => x.name === 'A#') && !scaleStepsNotes.some(x => x.name === 'B'))
    //     note.name = 'B#';
    // });

    // console.log('noteNames.after', noteNames);
    // return noteNames;
  });

  private shouldUseFlats(note: Note) {
    const keys = this.scaleSteepsManager.selectedScaleType() === ScaleType.Minor
      ? FLAT_KEYS_MINOR
      : FLAT_KEYS_MAJOR;

    return keys.includes(note);
  }
}