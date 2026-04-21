import { Note } from "@services/scale-steps/scale-steps.types";

export const MAJOR_CHORD_ORDER: Note[] = [
  Note.C, Note.G, Note.D, Note.A, Note.E, Note.B,
  Note.Fsharp, Note.Csharp, Note.Gsharp, Note.Dsharp, Note.Asharp, Note.F,
];

export const MINOR_CHORD_ORDER: Note[] = [
  Note.A, Note.E, Note.B, Note.Fsharp, Note.Csharp, Note.Gsharp,
  Note.Dsharp, Note.Asharp, Note.F, Note.C, Note.G, Note.D,
];
