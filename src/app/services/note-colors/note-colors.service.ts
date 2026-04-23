import { computed, Injectable, inject, signal } from "@angular/core";

import { Note } from "@services/scale-steps/scale-steps.types";
import { SettingsRepository } from "@services/settings";
import { THEME_COLORS } from "@services/theme/theme.constants";
import { ThemeService } from "@services/theme/theme.service";

import { COLOR_MODES, NOTE_COLORS, OCTAVE_COLORS, STATIC_NOTE_COLOR, TRANSPARENT_NOTE_COLOR } from "./note-colors.constants";
import { NoteColorsStyle } from "./note-colors.types";
import { ColorHelper } from "./note-colors.utils";

@Injectable({ providedIn: 'root' })
export class NoteColorsService {
  private readonly themeService = inject(ThemeService);
  private readonly settings = inject(SettingsRepository);
  private readonly noteColors = signal(NOTE_COLORS);
  private readonly staticNoteColor = signal(STATIC_NOTE_COLOR);
  public readonly themeBackground = computed(() => THEME_COLORS[this.themeService.currentTheme()].bg);
  public readonly themeColor = computed(() => THEME_COLORS[this.themeService.currentTheme()].text);
  public readonly themeMutedColor = computed(() => THEME_COLORS[this.themeService.currentTheme()].muted);

  public readonly colorModeOptions = COLOR_MODES;
  public readonly selectedMode = this.settings.highlightMode;
  public readonly octaveHighlight = this.settings.octaveHighlight;

  public getOctaveColor(octave?: number): string | null {
    if (!this.octaveHighlight() || !octave) return null;
    const idx = Math.max(0, Math.min(octave, OCTAVE_COLORS.length - 1));
    return OCTAVE_COLORS[idx];
  }

  public getOctaveStyle(octave: number) {
    const color = this.getOctaveColor(octave);
    if (color == null) return null;
    const textColor = ColorHelper.colorIsDark(color, this.themeBackground()) ? 'white' : 'black';
    return { backgroundColor: color, color: textColor };
  }

  public getNoteColor(currentNote: Note, scaleStep?: number, octaveNumber?: number): NoteColorsStyle {
    if (this.selectedMode() === 0) return this.getTransparentNoteColor();
    const opacity = this._getOpacity(scaleStep, this.selectedMode() === 3);
    const color = this.getColor(currentNote, this.selectedMode() === 2);
    const octaveColor = this.getOctaveColor(octaveNumber);
    const noteColor = ColorHelper.mergeColorWithOpacity(color, opacity);
    const textColor = ColorHelper.colorIsDark(noteColor, this.themeBackground()) ? 'white' : 'black';
    return { 
      noteColor, 
      textColor, 
      octaveColor, 
    };
  }

  public getTransparentNoteColor(): NoteColorsStyle {
    const backgroundColor = ColorHelper.mergeColorWithOpacity(TRANSPARENT_NOTE_COLOR, 0);
    const textColor = ColorHelper.colorIsDark(backgroundColor, this.themeBackground()) ? 'white' : 'black';
    return { noteColor: backgroundColor, textColor: textColor, 'octaveColor': backgroundColor };
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

  private _getOpacity(scaleStep?: number, isStaticMode = false) {
    return isStaticMode || scaleStep == null
      ? ColorHelper.calculateStaticOpacity(scaleStep)
      : ColorHelper.calculateDynamicOpacity(scaleStep);
  }
}
