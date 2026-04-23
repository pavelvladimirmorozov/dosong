import { Injectable } from '@angular/core';

const STORAGE_PREFIX = 'dosong-';

@Injectable({ providedIn: 'root' })
export class LocalStorageService {
  public get<T>(key: string, defaultValue: T): T {
    try {
      const raw = localStorage.getItem(STORAGE_PREFIX + key);
      if (raw === null) return defaultValue;
      return JSON.parse(raw) as T;
    } catch {
      return defaultValue;
    }
  }

  public set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
    } catch {
      // storage may be unavailable (private mode, quota) — fall through silently
    }
  }

  public remove(key: string): void {
    try {
      localStorage.removeItem(STORAGE_PREFIX + key);
    } catch {
      // noop
    }
  }
}
