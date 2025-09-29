
export interface BeatElement {
  number: number;
  isActive: boolean;
  sound: Beat;
}

export interface Beat {
  frequency: number;
  duration: number;
  type: OscillatorType,
}