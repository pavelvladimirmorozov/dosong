import { effect, signal, WritableSignal } from '@angular/core';

import { LocalStorageService } from '@services/local-storage/local-storage.service';

export function persistedSignal<T>(
  storage: LocalStorageService,
  key: string,
  defaultValue: T,
): WritableSignal<T> {
  const value = signal<T>(storage.get<T>(key, defaultValue));
  effect(() => {
    storage.set(key, value());
  });
  return value;
}
