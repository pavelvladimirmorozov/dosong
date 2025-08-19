
export interface Beat {
  frequency: number;
  duration: number;
  type: 'sine' | 'square',
}

export const BEATS: Beat[] = [
    {
      frequency: 0,
      duration: 0,
      type: 'square',
    },
    {
      frequency: 1200,
      duration: 0.05,
      type: 'square',
    },
    {

      frequency: 800,
      duration: 0.05,
      type: 'sine',
    },
    {
      frequency: 1000,
      duration: 0.02,
      type: 'square',
    },
    {

      frequency: 800,
      duration: 0.05,
      type: 'sine',
    },
  ]