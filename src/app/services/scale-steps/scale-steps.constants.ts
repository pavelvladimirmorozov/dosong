import { ComSelectOption } from "@components/select/com-select-option";

import { FLAT, SHARP } from "@utils/constants";

import { ScaleSteps, Scale, ScaleKind, ScaleQuality, ScaleStepQuality, NoteInfo, Note } from "./scale-steps.types";

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
    name: "scale.chromatic",
    type: ScaleQuality.None,
    kind: ScaleKind.Chromatic,
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
    name: "scale.major",
    type: ScaleQuality.Major,
    kind: ScaleKind.Natural,
    steps: [
      { interval: 0, type: ScaleStepQuality.Major },
      { interval: 2, type: ScaleStepQuality.Minor },
      { interval: 4, type: ScaleStepQuality.Minor },
      { interval: 5, type: ScaleStepQuality.Major },
      { interval: 7, type: ScaleStepQuality.Major },
      { interval: 9, type: ScaleStepQuality.Minor },
      { interval: 11, type: ScaleStepQuality.Diminished }
    ],
  },
  {
    id: Scale.Minor,
    name: "scale.minor",
    type: ScaleQuality.Minor,
    kind: ScaleKind.Natural,
    steps: [
      { interval: 0, type: ScaleStepQuality.Minor },
      { interval: 2, type: ScaleStepQuality.Diminished },
      { interval: 3, type: ScaleStepQuality.Major },
      { interval: 5, type: ScaleStepQuality.Minor },
      { interval: 7, type: ScaleStepQuality.Minor },
      { interval: 8, type: ScaleStepQuality.Major },
      { interval: 10, type: ScaleStepQuality.Major },
    ],
  },
  {
    id: Scale.HarmonicMinor,
    name: "scale.harmonicMinor",
    type: ScaleQuality.Minor,
    kind: ScaleKind.Harmonic,
    steps: [
      { interval: 0, type: ScaleStepQuality.Minor },
      { interval: 2, type: ScaleStepQuality.Diminished },
      { interval: 3, type: ScaleStepQuality.Augmented },
      { interval: 5, type: ScaleStepQuality.Minor },
      { interval: 7, type: ScaleStepQuality.Major },
      { interval: 8, type: ScaleStepQuality.Major },
      { interval: 11, type: ScaleStepQuality.Diminished },
    ],
  },
  {
    id: Scale.MelodicMinor,
    name: "scale.melodicMinor",
    type: ScaleQuality.Minor,
    kind: ScaleKind.Melodic,
    steps: [
      { interval: 0, type: ScaleStepQuality.Minor },
      { interval: 2, type: ScaleStepQuality.Minor },
      { interval: 3, type: ScaleStepQuality.Augmented },
      { interval: 5, type: ScaleStepQuality.Major },
      { interval: 7, type: ScaleStepQuality.Major },
      { interval: 9, type: ScaleStepQuality.Diminished },
      { interval: 11, type: ScaleStepQuality.Diminished },
    ],
  },
  {
    id: Scale.HarmonicMajor,
    name: "scale.harmonicMajor",
    type: ScaleQuality.Major,
    kind: ScaleKind.Harmonic,
    steps: [
      { interval: 0, type: ScaleStepQuality.Major },
      { interval: 2, type: ScaleStepQuality.Diminished },
      { interval: 4, type: ScaleStepQuality.Minor },
      { interval: 5, type: ScaleStepQuality.Minor },
      { interval: 7, type: ScaleStepQuality.Major },
      { interval: 8, type: ScaleStepQuality.Augmented },
      { interval: 11, type: ScaleStepQuality.Diminished },
    ],
  },
  {
    id: Scale.MelodicMajor,
    name: "scale.melodicMajor",
    type: ScaleQuality.Major,
    kind: ScaleKind.Melodic,
    steps: [
      { interval: 0, type: ScaleStepQuality.Major },
      { interval: 2, type: ScaleStepQuality.Diminished },
      { interval: 4, type: ScaleStepQuality.Diminished },
      { interval: 5, type: ScaleStepQuality.Minor },
      { interval: 7, type: ScaleStepQuality.Minor },
      { interval: 8, type: ScaleStepQuality.Augmented },
      { interval: 10, type: ScaleStepQuality.Major },
    ],
  },
  {
    id: Scale.MajorPentatonic,
    name: "scale.majorPentatonic",
    type: ScaleQuality.Major,
    kind: ScaleKind.Pentatonic,
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
    name: "scale.minorPentatonic",
    type: ScaleQuality.Minor,
    kind: ScaleKind.Pentatonic,
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
    name: "scale.blues",
    type: ScaleQuality.Major,
    kind: ScaleKind.Blues,
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
    name: "scale.egyptianPentatonic",
    type: ScaleQuality.None,
    kind: ScaleKind.Egyptian,
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
    name: "scale.japanesePentatonic",
    type: ScaleQuality.None,
    kind: ScaleKind.Japanese,
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

export const SCALE_QUALITY_OPTIONS: ComSelectOption<ScaleQuality>[] = [
  { id: ScaleQuality.Major, name: "quality.major" },
  { id: ScaleQuality.Minor, name: "quality.minor" },
  { id: ScaleQuality.None,  name: "quality.none" },
];

export const SCALE_KIND_OPTIONS: ComSelectOption<ScaleKind>[] = [
  { id: ScaleKind.Natural,    name: "kind.natural" },
  { id: ScaleKind.Harmonic,   name: "kind.harmonic" },
  { id: ScaleKind.Melodic,    name: "kind.melodic" },
  { id: ScaleKind.Pentatonic, name: "kind.pentatonic" },
  { id: ScaleKind.Blues,      name: "kind.blues" },
  { id: ScaleKind.Chromatic,  name: "kind.chromatic" },
  { id: ScaleKind.Japanese,   name: "kind.japanese" },
  { id: ScaleKind.Egyptian,   name: "kind.egyptian" },
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
  { id: Note.Csharp, name: `C${SHARP}` },
  { id: Note.D, name: 'D' },
  { id: Note.Dsharp, name: `D${SHARP}` },
  { id: Note.E, name: 'E' },
  { id: Note.F, name: 'F' },
  { id: Note.Fsharp, name: `F${SHARP}` },
  { id: Note.G, name: 'G' },
  { id: Note.Gsharp, name: `G${SHARP}` },
  { id: Note.A, name: 'A' },
  { id: Note.Asharp, name: `A${SHARP}` },
  { id: Note.B, name: 'B' },
];

export const FLAT_NOTES: NoteInfo[] = [
  { id: Note.C, name: 'C' },
  { id: Note.Csharp, name: `D${FLAT}` },
  { id: Note.D, name: 'D' },
  { id: Note.Dsharp, name: `E${FLAT}` },
  { id: Note.E, name: 'E' },
  { id: Note.F, name: 'F' },
  { id: Note.Fsharp, name: `G${FLAT}` },
  { id: Note.G, name: 'G' },
  { id: Note.Gsharp, name: `A${FLAT}` },
  { id: Note.A, name: 'A' },
  { id: Note.Asharp, name: `B${FLAT}` },
  { id: Note.B, name: 'B' },
];

export const UNIVERSAL_NOTES: NoteInfo[] = [
  { id: Note.C, name: 'C' },
  { id: Note.Csharp, name: `C${SHARP}` },
  { id: Note.D, name: 'D' },
  { id: Note.Dsharp, name: `E${FLAT}` },
  { id: Note.E, name: 'E' },
  { id: Note.F, name: 'F' },
  { id: Note.Fsharp, name: `F${SHARP}` },
  { id: Note.G, name: 'G' },
  { id: Note.Gsharp, name: `A${FLAT}` },
  { id: Note.A, name: 'A' },
  { id: Note.Asharp, name: `B${FLAT}` },
  { id: Note.B, name: 'B' },
];

// TODO: Добавить для бемолей
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

// TODO: Строить аккорды из гамм
// {
//   chords = {
//     major_scale_based: [
//       {
//         name: "major",
//         symbol: "",
//         formula: "1-3-5",
//         scale_type: "major",
//         steps: {
//           take: [1, 3, 5],
//           alterations: []
//         },
//       },
//       {
//         name: "augmented", 
//         symbol: "aug",
//         formula: "1-3-♯5",
//         scale_type: "major",
//         steps: {
//           take: [1, 3],
//           alterations: ["♯5"]
//         },
//       },
//       {
//         name: "major_seventh",
//         symbol: "maj7", 
//         formula: "1-3-5-7",
//         scale_type: "major",
//         steps: {
//           take: [1, 3, 5, 7],
//           alterations: []
//         },
//       },
//       {
//         name: "dominant_seventh",
//         symbol: "7",
//         formula: "1-3-5-♭7", 
//         scale_type: "major",
//         steps: {
//           take: [1, 3, 5],
//           alterations: ["♭7"]
//         },
//       }
//     ],
    
//     minor_scale_based: [
//       {
//         name: "minor",
//         symbol: "m", 
//         formula: "1-3-5",
//         scale_type: "minor",
//         steps: {
//           take: [1, 3, 5],
//           alterations: []
//         },
//       },
//       {
//         name: "minor_seventh",
//         symbol: "m7",
//         formula: "1-3-5-7", 
//         scale_type: "minor",
//         steps: {
//           take: [1, 3, 5, 7],
//           alterations: []
//         },
//       },
//       {
//         name: "minor_major_seventh",
//         symbol: "m(maj7)",
//         formula: "1-3-5-♯7",
//         scale_type: "minor", 
//         steps: {
//           take: [1, 3, 5],
//           alterations: ["♯7"]
//         },
//       },
//       {
//         name: "diminished",
//         symbol: "dim",
//         formula: "1-3-♭5",
//         scale_type: "minor",
//         steps: {
//           take: [1, 3],
//           alterations: ["♭5"]
//         },
//       },
//       {
//         name: "half_diminished", 
//         symbol: "m7♭5",
//         formula: "1-3-♭5-7",
//         scale_type: "minor",
//         steps: {
//           take: [1, 3, 7],
//           alterations: ["♭5"]
//         },
//       }
//     ],
    
//     cross_scale: [
//       {
//         name: "minor_sixth",
//         symbol: "m6",
//         formula: "1-3-5-6", 
//         scale_type: "melodic_minor",
//         steps: {
//           take: [1, 3, 5, 6],
//           alterations: []
//         },
//       },
//       {
//         name: "diminished_seventh",
//         symbol: "dim7",
//         formula: "1-3-♭5-6",
//         scale_type: "diminished", 
//         steps: {
//           take: [1, 3, 6],
//           alterations: ["♭5"]
//         },
//       }
//     ]
//   },
// }