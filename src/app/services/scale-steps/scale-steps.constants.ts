import { ScaleSteps, Scale, ScaleQuality, ScaleStepQuality, NoteInfo, Note } from "./scale-steps.types";

// export const SCALE_MODE_OPTIONS  = [
//   {
//     id: ScaleMode.Gamma,
//     name: "Гамма",
//   },
//   {
//     id: ScaleMode.Chord,
//     name: "Аккорд",
//   },
// ];

export const SCALE_STEPS: ScaleSteps[] = [
  {
    id: Scale.Chromatic,
    name: "Хроматизм",
    type: ScaleQuality.None,
    steps: [
      { interval: 0, type: ScaleStepQuality.None },
      { interval: 1, type: ScaleStepQuality.None },
      { interval: 2, type: ScaleStepQuality.None },
      { interval: 3, type: ScaleStepQuality.None },
      { interval: 4, type: ScaleStepQuality.None },
      { interval: 5, type: ScaleStepQuality.None },
      { interval: 6, type: ScaleStepQuality.None },
      { interval: 7, type: ScaleStepQuality.None },
      { interval: 8, type: ScaleStepQuality.None },
      { interval: 9, type: ScaleStepQuality.None },
      { interval: 10, type: ScaleStepQuality.None },
      { interval: 11, type: ScaleStepQuality.None },
    ],
  },
  {
    id: Scale.Major,
    name: "Натуральный мажор",
    type: ScaleQuality.Major,
    steps: [
      { interval: 0, type: ScaleStepQuality.Major },
      { interval: 2, type: ScaleStepQuality.Minor },
      { interval: 4, type: ScaleStepQuality.Minor },
      { interval: 5, type: ScaleStepQuality.Major },
      { interval: 7, type: ScaleStepQuality.Major },
      { interval: 9, type: ScaleStepQuality.Minor },
      { interval: 11, type: ScaleStepQuality.Any }
    ],
  },
  {
    id: Scale.Minor,
    name: "Натуральный минор",
    type: ScaleQuality.Minor,
    steps: [
      { interval: 0, type: ScaleStepQuality.Minor },
      { interval: 2, type: ScaleStepQuality.Any },
      { interval: 3, type: ScaleStepQuality.Major },
      { interval: 5, type: ScaleStepQuality.Minor },
      { interval: 7, type: ScaleStepQuality.Minor },
      { interval: 8, type: ScaleStepQuality.Major },
      { interval: 10, type: ScaleStepQuality.Major },
    ],
  },
  {
    id: Scale.HarmonicMinor,
    name: "Гармонический минор",
    type: ScaleQuality.Minor,
    steps: [
      { interval: 0, type: ScaleStepQuality.Minor },
      { interval: 2, type: ScaleStepQuality.Any },
      { interval: 3, type: ScaleStepQuality.Any },
      { interval: 5, type: ScaleStepQuality.Minor },
      { interval: 7, type: ScaleStepQuality.Major },
      { interval: 8, type: ScaleStepQuality.Major },
      { interval: 11, type: ScaleStepQuality.Any },
    ],
  },
  {
    id: Scale.MelodicMinor,
    name: "Мелодический минор",
    type: ScaleQuality.Minor,
    steps: [
      { interval: 0, type: ScaleStepQuality.Minor },
      { interval: 2, type: ScaleStepQuality.Minor },
      { interval: 3, type: ScaleStepQuality.Any },
      { interval: 5, type: ScaleStepQuality.Major },
      { interval: 7, type: ScaleStepQuality.Major },
      { interval: 9, type: ScaleStepQuality.Any },
      { interval: 11, type: ScaleStepQuality.Any },
    ],
  },
  {
    id: Scale.MajorPentatonic,
    name: "Мажорная пентатоника",
    type: ScaleQuality.Major,
    steps: [
      { interval: 0, type: ScaleStepQuality.Major },
      { interval: 2, type: ScaleStepQuality.Minor },
      { interval: 4, type: ScaleStepQuality.Minor },
      { interval: null, type: ScaleStepQuality.Any },
      { interval: 7, type: ScaleStepQuality.Major },
      { interval: null, type: ScaleStepQuality.Any },
      { interval: 9, type: ScaleStepQuality.Minor },
    ],
  },
  {
    id: Scale.MinorPentatonic,
    name: "Минорная пентатоника",
    type: ScaleQuality.Minor,
    steps: [
      { interval: 0, type: ScaleStepQuality.Minor },
      { interval: null, type: ScaleStepQuality.Any },
      { interval: 3, type: ScaleStepQuality.Major },
      { interval: 5, type: ScaleStepQuality.Minor },
      { interval: 7, type: ScaleStepQuality.Minor },
      { interval: null, type: ScaleStepQuality.Any },
      { interval: 10, type: ScaleStepQuality.Major },
    ],
  },
  {
    id: Scale.Blues,
    name: "Блюзовая гамма",
    type: ScaleQuality.Major,
    steps: [
      { interval: 0, type: ScaleStepQuality.Major },
      { interval: 3, type: ScaleStepQuality.Major },
      { interval: 5, type: ScaleStepQuality.Major },
      { interval: 6, type: ScaleStepQuality.Any },
      { interval: 7, type: ScaleStepQuality.Major },
      { interval: 10, type: ScaleStepQuality.Major },
    ],
  },
  {
    id: Scale.Egyptian,
    name: "Египетская пентатоника",
    type: ScaleQuality.Major,
    steps: [
      { interval: 0, type: ScaleStepQuality.Minor },
      { interval: 2, type: ScaleStepQuality.Any },
      { interval: null, type: ScaleStepQuality.Major },
      { interval: 5, type: ScaleStepQuality.Major },
      { interval: null, type: ScaleStepQuality.Minor },
      { interval: 7, type: ScaleStepQuality.Any },
      { interval: 10, type: ScaleStepQuality.Any },
    ],
  },
  {
    id: Scale.Japanese,
    name: "Японская пентатоника",
    type: ScaleQuality.Major,
    steps: [
      { interval: 0, type: ScaleStepQuality.Minor },
      { interval: 1, type: ScaleStepQuality.Major },
      { interval: null, type: ScaleStepQuality.Any },
      { interval: 5, type: ScaleStepQuality.Minor },
      { interval: 6, type: ScaleStepQuality.Major },
      { interval: null, type: ScaleStepQuality.Any },
      { interval: 10, type: ScaleStepQuality.Any },
    ],
  },
];

// export const CHORDS_SCALE_STEPS  = [
//   {
//     id: ChordScale.MajorChord,
//     name: "Мажорный аккорд",
//     steps: [0, 4, 7],
//     tonicType: ScaleStepQuality.Major,
//     type: ScaleQuality.Major,
//   },
//   {
//     id: ChordScale.MinorChord,
//     name: "Минорный аккорд",
//     steps: [0, 3, 7],
//     tonicType: ScaleStepQuality.Minor,
//     type: ScaleQuality.Minor,
//   },
//   {
//     id: ChordScale.Minor7Chord,
//     name: "Минорный септаккорд (m7)",
//     steps: [0, 3, 7, 10],
//     tonicType: ScaleStepQuality.Any,
//     type: ScaleQuality.Minor,
//   },
//   {
//     id: ChordScale.Major7Chord,
//     name: "Мажорный септаккорд (7)",
//     steps: [0, 4, 7, 10],
//     tonicType: ScaleStepQuality.Any,
//     type: ScaleQuality.Major,
//   },
//   {
//     id: ChordScale.MajorMaj7Chord,
//     name: "Большой мажорный септаккорд (maj7)",
//     steps: [0, 4, 7, 11],
//     tonicType: ScaleStepQuality.Any,
//     type: ScaleQuality.Major,
//   },
//   {
//     id: ChordScale.MinorMaj7Chord,
//     name: "Большой минорный септаккорд (mmaj7)",
//     steps: [0, 3, 7, 10],
//     tonicType: ScaleStepQuality.Any,
//     type: ScaleQuality.Minor,
//   },
//   {
//     id: ChordScale.MajorDim75Chord,
//     name: "Уменьшенный септаккорд (dim7-5)",
//     steps: [0, 3, 6, 9],
//     tonicType: ScaleStepQuality.Any,
//     type: ScaleQuality.Major,
//   },
//   {
//     id: ChordScale.MajorDim7Chord,
//     name: "Полууменьшенный септаккорд (dim)",
//     steps: [0, 3, 6, 8],
//     tonicType: ScaleStepQuality.Any,
//     type: ScaleQuality.Major,
//   },
// ];

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

export const UNIVERSAL_NOTES: NoteInfo[] = [
  { id: Note.C, name: 'C' },
  { id: Note.Csharp, name: 'C#' },
  { id: Note.D, name: 'D' },
  { id: Note.Dsharp, name: 'Eb' },
  { id: Note.E, name: 'E' },
  { id: Note.F, name: 'F' },
  { id: Note.Fsharp, name: 'F#' },
  { id: Note.G, name: 'G' },
  { id: Note.Gsharp, name: 'Ab' },
  { id: Note.A, name: 'A' },
  { id: Note.Asharp, name: 'Bb' },
  { id: Note.B, name: 'B' },
];

// TODO: Доавить для диезов
// Тут оставил только от диезных нот т.к. в выборе сейчас тольк они
export const FLAT_KEYS_MAJOR = [Note.F];
export const FLAT_KEYS_MINOR = [Note.D, Note.G, Note.C, Note.F];

// major = {
//   sharpKeys: [ "C", "G", "D", "A", "E", "B", "F♯", "C♯"],
//   flatKeys: [ "C", "F", "B♭", "E♭", "A♭", "D♭", "G♭", "C♭"]
// },
// minor = {
//   sharpKeys: [ "A", "E", "B", "F♯", "C♯", "G♯", "D♯", "A♯"],
//   flatKeys: [ "A", "D", "G", "C", "F", "B♭", "E♭", "A♭"]
// }

// Only major: C♭ D♭ G♭
// Only minor: A♯ D♯ G♯
// Not: B# E#
// Both: A B♭ B C C♯ D E♭ E F F♯ G A♭


export const INTERVALS = [
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