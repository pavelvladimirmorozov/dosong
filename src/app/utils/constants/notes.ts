import { Note, NoteInfo } from "../models/note-info";

// TODO: Разобраться какие варианты нот будут для разны аккордов
export const SHARP_NOTES: NoteInfo[] = [
  { id: Note.C, name: 'C' },
  { id: Note.Csharp, name: 'C#' },
  { id: Note.D, name: 'D' },
  { id: Note.Dsharp, name: 'D#' },
  { id: Note.E, name: 'E' },
  { id: Note.F, name: 'F' },
  { id: Note.Fsharp, name: 'F#' },
  { id: Note.G, name: 'G' },
  { id: Note.Gsharp, name: 'G#' },
  { id: Note.A, name: 'A' },
  { id: Note.Asharp, name: 'A#' },
  { id: Note.B, name: 'B' },
];

export const FLAT_NOTES: NoteInfo[] = [
  { id: Note.C, name: 'C' },
  { id: Note.Csharp, name: 'Db' },
  { id: Note.D, name: 'D' },
  { id: Note.Dsharp, name: 'Eb' },
  { id: Note.E, name: 'E' },
  { id: Note.F, name: 'F' },
  { id: Note.Fsharp, name: 'Gb' },
  { id: Note.G, name: 'G' },
  { id: Note.Gsharp, name: 'Ab' },
  { id: Note.A, name: 'A' },
  { id: Note.Asharp, name: 'Bb' },
  { id: Note.B, name: 'B' },
];
// Все бемольные тональности
// export const FLAT_KEYS_MAJOR = ['F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Cb'];
// export const FLAT_KEYS_MINOR = ['D', 'G', 'C', 'F', 'Bb', 'Eb', 'Ab'];

// Тут оставил только от диезных нот т.к. в выборе сейчас тольк они
export const FLAT_KEYS_MAJOR = [Note.F];
export const FLAT_KEYS_MINOR = [Note.D, Note.G, Note.C, Note.F];

export const DEFAULT_TUNING = [
  { note: Note.E, octave: 5 },
  { note: Note.B, octave: 4 },
  { note: Note.G, octave: 4 },
  { note: Note.D, octave: 4 },
  { note: Note.A, octave: 3 },
  { note: Note.E, octave: 3 },
];

export const STEPS = [
  "Прима",
  "Малая секунда",
  "Большая секунда",
  "Малая терция",
  "Большая терция",
  "Чистая кварта",
  "Тритон",
  "Чистая квинта",
  "Малая секста",
  "Большая секста",
  "Малая септима",
  "Большая септима",
  "Чистая октава",
];