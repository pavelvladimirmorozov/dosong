import { Beat } from "./audio-processor.types";

// Прогрессия: тишина → мягкий низкий тик → резкий высокий downbeat.
// Короткая длительность (50–60 мс) чтобы звуки не наслаивались даже при 300 BPM.
export const BEATS: Beat[] = [
  // 0 — тишина (пропуск доли)
  { frequency: 0, duration: 0, type: 'sine' },

  // 1 — мягкий низкий тик
  { frequency: 440, duration: 0.05, type: 'sine' },

  // 2 — обычный
  { frequency: 660, duration: 0.05, type: 'triangle' },

  // 3 — средний
  { frequency: 880, duration: 0.05, type: 'triangle' },

  // 4 — сильный акцент
  { frequency: 1400, duration: 0.06, type: 'triangle' },

  // 5 — downbeat (резкий)
  { frequency: 2000, duration: 0.06, type: 'square' },
];
