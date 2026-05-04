import { Theme } from '@services/theme/theme.constants';

export type Language = 'ru' | 'en';
export type FretboardWidgetId = 'gamma' | 'fretboard' | 'circle' | 'chords' | 'song';

export interface FretboardWidgetSetting {
  id: FretboardWidgetId;
  visible: boolean;
}

export const DEFAULT_THEME: Theme = 'dark';
export const DEFAULT_DYNAMIC_NOTE_NAMING = true;
export const DEFAULT_HIGHLIGHT_MODE = 2;
export const DEFAULT_OCTAVE_HIGHLIGHT = false;
export const DEFAULT_LANGUAGE: Language = 'ru';
export const DEFAULT_FRETBOARD_WIDGETS: FretboardWidgetSetting[] = [
  { id: 'gamma', visible: true },
  { id: 'fretboard', visible: true },
  { id: 'circle', visible: true },
  { id: 'chords', visible: true },
  { id: 'song', visible: true },
];

export const LANGUAGE_OPTIONS: { id: Language; name: string }[] = [
  { id: 'ru', name: 'language.ru' },
  { id: 'en', name: 'language.en' },
];

export const HIGHLIGHT_MODE_OPTIONS: { id: number; name: string }[] = [
  { id: 0, name: 'highlight.off' },
  { id: 2, name: 'highlight.dynamicSingle' },
  { id: 1, name: 'highlight.dynamicMulti' },
  { id: 3, name: 'highlight.staticMulti' },
];
