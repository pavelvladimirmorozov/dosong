export enum Scale { Chromatic, Major, Minor, HarmonicMinor, MelodicMinor, MajorPentatonic, MinorPentatonic, Blues, Egyptian, Japanese, HarmonicMajor, MelodicMajor }
export enum ScaleStepQuality { Minor, Major, Diminished, Augmented, Any, None };
export enum ScaleQuality { Minor, Major, None }
export enum ScaleKind { Natural, Harmonic, Melodic, Pentatonic, Blues, Chromatic, Japanese, Egyptian }
export enum Note { C, Csharp, D, Dsharp, E, F, Fsharp, G, Gsharp, A, Asharp, B }

export interface ScaleSteps {
  id: Scale;
  name: string,
  type: ScaleQuality;
  kind: ScaleKind;
  steps: ScaleStep[];
}

export interface ScaleStep {
  interval: number | null;
  type: ScaleStepQuality;
};

export interface ScaleSteepState {
  midiNote: Note | null;
  interval: number | null;
  type: ScaleStepQuality;
  stepNumber: number;
};

export interface NoteInfo {
  id: Note;
  name: string;
}