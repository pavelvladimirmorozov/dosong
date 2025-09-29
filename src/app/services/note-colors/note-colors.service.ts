import { Injectable, signal } from "@angular/core";
import { ColorHelper } from "./note-colors.utils";
import { NoteColorsStyle } from "./note-colors.types";
import { Note } from "@services/scale-steps/scale-steps.types";
import { COLOR_MODES, NOTE_COLORS, STATIC_NOTE_COLOR, SYSTEM_COLOR, TRANSPARENT_NOTE_COLOR } from "./note-colors.constants";

@Injectable({ providedIn: 'root' })
export class NoteColorsService {
  private readonly noteColors = signal(NOTE_COLORS);
  private readonly staticNoteColor = signal(STATIC_NOTE_COLOR);

  public readonly colorModeOptions = COLOR_MODES;
  public selectedMode = signal<number>(2);

  public getNoteColor(currentNote: Note, scaleStep?: number): NoteColorsStyle {
    if (this.selectedMode() === 0) return this.getTransparentNoteColor();
    const opacity = this._getOpacity(scaleStep, this.selectedMode() === 3);
    const color = this.getColor(currentNote, this.selectedMode() === 2);

    const backgroundColor = ColorHelper.mergeColorWithOpacity(color, opacity);
    const textColor = ColorHelper.colorIsDark(backgroundColor, SYSTEM_COLOR) ? 'white' : 'black';
    return { backgroundColor, color: textColor };
  }

  public getTransparentNoteColor(): NoteColorsStyle {
    const backgroundColor = ColorHelper.mergeColorWithOpacity(TRANSPARENT_NOTE_COLOR, 0);
    const textColor = ColorHelper.colorIsDark(backgroundColor, SYSTEM_COLOR) ? 'white' : 'black';
    return { backgroundColor, color: textColor };
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
    return isStaticMode || scaleStep == null || scaleStep < 0
      ? ColorHelper.calculateStaticOpacity(scaleStep)
      : ColorHelper.calculateDynamicOpacity(scaleStep);
  }
}