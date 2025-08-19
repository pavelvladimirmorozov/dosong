import { Injectable, signal } from "@angular/core";
import { COLOR_MODES, NOTE_COLORS, STATIC_NOTE_COLOR, TRANSPARENT_NOTE_COLOR } from "@utils/constants";
import { Note } from "@utils/models";
import { NoteHelper } from "@utils/helpers";

@Injectable({ providedIn: 'root' })
export class NoteColorsManager {
  private readonly noteColors = signal(NOTE_COLORS);
  private readonly staticNoteColor = signal(STATIC_NOTE_COLOR);

  public readonly colorModeOptions = COLOR_MODES;
  public selectedMode = signal<number>(2);

  public getNoteColor(currentNote: Note, scaleStep?: number) {
    if (this.selectedMode() === 0) return NoteHelper.mergeColorWithOpacity(TRANSPARENT_NOTE_COLOR, 0);
    const opacity = this._getOpacity(scaleStep, this.selectedMode() === 3);

    const color = this.getColor(currentNote, this.selectedMode() === 2);

    return NoteHelper.mergeColorWithOpacity(color, opacity);
  }
  
  public getStaticNoteColor() {
    return this.staticNoteColor();
  }

  private getNoteMultiColor(currentNote: Note) {
    return this.noteColors()[currentNote];
  }

  private getColor(currentNote: Note, isSingleColorMode: boolean) {
    return isSingleColorMode
      ? this.getStaticNoteColor()
      : this.getNoteMultiColor(currentNote);
  }

  private _getOpacity(scaleStep?: number, isStaticMode: boolean = false) {
    return isStaticMode || !scaleStep || scaleStep < 0
      ? NoteHelper.calculateStaticOpacity(scaleStep)
      : NoteHelper.calculateDynamicOpacity(scaleStep);
  }
}