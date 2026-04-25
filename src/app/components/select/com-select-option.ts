export interface ComSelectOption<T> {
  id?: T | null;
  name: string;
  class?: string | null;
}

export type ComSelectOptionStyle<T> = (option: ComSelectOption<T>) => Record<string, string> | null | undefined;