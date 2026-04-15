import { Note } from '@services/scale-steps/scale-steps.types';

export interface SectorParams {
  startAngle: number;
  endAngle: number;
  startRadius: number;
  endRadius: number;
}

export interface TextParams {
  angle: number;
  radius: number;
}

export interface SectorVisualState {
  chord: { id: Note; name: string };
  fillColor: string | null;
  textColor: string;
  labelNumeral: string | null;
}