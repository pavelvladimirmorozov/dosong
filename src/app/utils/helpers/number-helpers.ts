export type RawNumberInput = string | number | null | undefined;

/**
 * Привести значение к числу. Возвращает null, если значение пустое или не парсится.
 */
export function toNumber(raw: RawNumberInput): number | null {
  if (raw === null || raw === undefined || raw === '') return null;
  const parsed = typeof raw === 'number' ? raw : Number(raw);
  return Number.isNaN(parsed) ? null : parsed;
}

/**
 * Зажать число в диапазон [min, max]. Любую из границ можно опустить.
 */
export function clamp(value: number, min?: number, max?: number): number {
  let result = value;
  if (min !== undefined && result < min) result = min;
  if (max !== undefined && result > max) result = max;
  return result;
}

/**
 * Распарсить сырое значение в число с клампингом в [min, max].
 * Возвращает null, если значение не парсится.
 */
export function parseClampedNumber(raw: RawNumberInput, min?: number, max?: number): number | null {
  const parsed = toNumber(raw);
  if (parsed === null) return null;
  return clamp(parsed, min, max);
}

/**
 * То же, что parseClampedNumber, но округляет результат до целого.
 */
export function parseClampedInt(raw: RawNumberInput, min?: number, max?: number): number | null {
  const parsed = toNumber(raw);
  if (parsed === null) return null;
  return clamp(Math.round(parsed), min, max);
}
