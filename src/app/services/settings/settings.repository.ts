import { effect, inject, Injectable, signal, WritableSignal } from '@angular/core';

import { LocalStorageService } from '@services/local-storage/local-storage.service';
import { Theme } from '@services/theme/theme.constants';

import {
  DEFAULT_DYNAMIC_NOTE_NAMING,
  DEFAULT_FRETBOARD_WIDGETS,
  DEFAULT_HIGHLIGHT_MODE,
  DEFAULT_LANGUAGE,
  DEFAULT_OCTAVE_HIGHLIGHT,
  DEFAULT_THEME,
  FretboardWidgetId,
  FretboardWidgetSetting,
  Language,
} from './settings.constants';

const KEYS = {
  theme: 'theme',
  dynamicNoteNaming: 'note-naming-dynamic',
  highlightMode: 'highlight-mode',
  octaveHighlight: 'octave-highlight',
  language: 'language',
  fretboardWidgets: 'fretboard-widgets',
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
  public readonly fretboardWidgets = this.createFretboardWidgetsSignal();

  private createPersistedSignal<T>(key: string, defaultValue: T): WritableSignal<T> {
    const value = signal<T>(this.storage.get<T>(key, defaultValue));
    effect(() => {
      this.storage.set(key, value());
    });
    return value;
  }

  private createFretboardWidgetsSignal(): WritableSignal<FretboardWidgetSetting[]> {
    const value = signal<FretboardWidgetSetting[]>(
      this.normalizeFretboardWidgets(this.storage.get<unknown>(
        KEYS.fretboardWidgets,
        DEFAULT_FRETBOARD_WIDGETS,
      )),
    );
    effect(() => {
      this.storage.set(KEYS.fretboardWidgets, value());
    });
    return value;
  }

  private normalizeFretboardWidgets(value: unknown): FretboardWidgetSetting[] {
    const seen = new Set<FretboardWidgetId>();
    const normalized: FretboardWidgetSetting[] = [];

    if (Array.isArray(value)) {
      for (const item of value) {
        const candidate = item as { id?: unknown; visible?: unknown };
        if (!this.isFretboardWidgetId(candidate.id) || seen.has(candidate.id)) continue;

        const defaultWidget = DEFAULT_FRETBOARD_WIDGETS.find(widget => widget.id === candidate.id);
        normalized.push({
          id: candidate.id,
          visible: typeof candidate.visible === 'boolean'
            ? candidate.visible
            : defaultWidget?.visible ?? true,
        });
        seen.add(candidate.id);
      }
    }

    for (const widget of DEFAULT_FRETBOARD_WIDGETS) {
      if (seen.has(widget.id)) continue;
      normalized.push({ ...widget });
    }

    return normalized;
  }

  private isFretboardWidgetId(value: unknown): value is FretboardWidgetId {
    return DEFAULT_FRETBOARD_WIDGETS.some(widget => widget.id === value);
  }
}
