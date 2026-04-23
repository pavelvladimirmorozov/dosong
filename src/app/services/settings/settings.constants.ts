import { Theme } from '@services/theme/theme.constants';

export type Language = 'ru' | 'en';

export const DEFAULT_THEME: Theme = 'dark';
export const DEFAULT_DYNAMIC_NOTE_NAMING = true;
export const DEFAULT_HIGHLIGHT_MODE = 2;
export const DEFAULT_LANGUAGE: Language = 'ru';

export const LANGUAGE_OPTIONS: { id: Language; name: string }[] = [
  { id: 'ru', name: 'language.ru' },
  { id: 'en', name: 'language.en' },
];

export const THEME_OPTIONS: { id: Theme; name: string }[] = [
  { id: 'dark', name: 'theme.dark' },
  { id: 'white', name: 'theme.light' },
];

export const NOTE_NAMING_OPTIONS: { id: boolean; name: string }[] = [
  { id: true, name: 'noteNaming.dynamic' },
  { id: false, name: 'noteNaming.static' },
];

export const HIGHLIGHT_MODE_OPTIONS: { id: number; name: string }[] = [
  { id: 0, name: 'highlight.off' },
  { id: 2, name: 'highlight.dynamicSingle' },
  { id: 1, name: 'highlight.dynamicMulti' },
  { id: 3, name: 'highlight.staticMulti' },
];
