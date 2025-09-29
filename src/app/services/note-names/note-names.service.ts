import { computed, inject, Injectable, signal } from "@angular/core";
import { NoteHelper } from "@utils/helpers";
import { ScaleSteepsService } from "../scale-steps/scale-steps.service";
import { NoteInfo, ScaleSteepState } from "../scale-steps/scale-steps.types";
import { SHARP_NOTES } from "../scale-steps/scale-steps.constants";

@Injectable({ providedIn: 'root' })
export class NoteNamesManager {
  private readonly scaleSteepsManager = inject(ScaleSteepsService);

  public useGammaNotes = signal(true);
  
  public noteNames = computed(() => {
    if (!this.useGammaNotes()) return SHARP_NOTES;
    return this.merge(
      this.scaleSteepsManager.baseNotes(),
      this.scaleSteepsManager.selectedScaleState()
    );
  });

  public getNoteName(note: number): string {
    const noteIndex = NoteHelper.getNoteIndex(note);
    return this.noteNames()[noteIndex].name;
  }
  
  // TODO: Добавить выбор нот на основе гаммы
  // public noteOptions = computed(() => {
  //   if (!this.useGammaNotes()) return SHARP_NOTES;
  //   return UNIVERSAL_NOTES;
  // });

  private merge(arr1: NoteInfo[], arr2: ScaleSteepState[]) {
    const map = new Map();
    arr1.forEach(item => {
      map.set(item.id, { ...item });
    });
    arr2.forEach(item => {
      const keyValue = item.midiNote;
      if (map.has(keyValue)) {
        map.set(keyValue, { ...map.get(keyValue), name: item.name });
      }
    });
    return Array.from(map.values());
  }

}