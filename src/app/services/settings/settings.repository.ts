import { effect, inject, Injectable, signal, WritableSignal } from '@angular/core';

import { LocalStorageService } from '@services/local-storage/local-storage.service';
import { Theme } from '@services/theme/theme.constants';

import {
  DEFAULT_DYNAMIC_NOTE_NAMING,
  DEFAULT_HIGHLIGHT_MODE,
  DEFAULT_LANGUAGE,
  DEFAULT_OCTAVE_HIGHLIGHT,
  DEFAULT_THEME,
  Language,
} from './settings.constants';

const KEYS = {
  theme: 'theme',
  dynamicNoteNaming: 'note-naming-dynamic',
  highlightMode: 'highlight-mode',
  octaveHighlight: 'octave-highlight',
  language: 'language',
} as const;

@Injectable({ providedIn: 'root' })
export class SettingsRepository {
  private readonly storage = inject(LocalStorageService);

  public readonly theme = this.createPersistedSignal<Theme>(KEYS.theme, DEFAULT_THEME);
  public readonly dynamicNoteNaming = this.createPersistedSignal<boolean>(
    KEYS.dynamicNoteNaming,
    DEFAULT_DYNAMIC_NOTE_NAMING,
  );
  public readonly highlightMode = this.createPersistedSignal<number>(
    KEYS.highlightMode,
    DEFAULT_HIGHLIGHT_MODE,
  );
  public readonly octaveHighlight = this.createPersistedSignal<boolean>(
    KEYS.octaveHighlight,
    DEFAULT_OCTAVE_HIGHLIGHT,
  );
  public readonly language = this.createPersistedSignal<Language>(
    KEYS.language,
    DEFAULT_LANGUAGE,
  );

  private createPersistedSignal<T>(key: string, defaultValue: T): WritableSignal<T> {
    const value = signal<T>(this.storage.get<T>(key, defaultValue));
    effect(() => {
      this.storage.set(key, value());
    });
    return value;
  }
}
