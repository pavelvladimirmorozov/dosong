import { Theme } from '@services/theme/theme.constants';

export type Language = 'ru' | 'en';

export const DEFAULT_THEME: Theme = 'dark';
export const DEFAULT_DYNAMIC_NOTE_NAMING = true;
export const DEFAULT_HIGHLIGHT_MODE = 2;
export const DEFAULT_LANGUAGE: Language = 'ru';

export const LANGUAGE_OPTIONS: { id: Language; name: string }[] = [
  { id: 'ru', name: 'Русский' },
  { id: 'en', name: 'English' },
];

export const THEME_OPTIONS: { id: Theme; name: string }[] = [
  { id: 'dark', name: 'Тёмная' },
  { id: 'white', name: 'Светлая' },
];

export const NOTE_NAMING_OPTIONS: { id: boolean; name: string }[] = [
  { id: true, name: 'Динамическое' },
  { id: false, name: 'Статическое' },
];

export const HIGHLIGHT_MODE_OPTIONS: { id: number; name: string }[] = [
  { id: 0, name: 'Без подсветки' },
  { id: 2, name: 'Динамическая одноцветная' },
  { id: 1, name: 'Динамическая цветная' },
  { id: 3, name: 'Статическая цветная' },
];
