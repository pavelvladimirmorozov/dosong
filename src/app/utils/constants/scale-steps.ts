import { Gamma } from "@utils/models";

export enum Scale { Chromatic, Major, Minor, HarmonicMinor, MelodicMinor, MajorPentatonic, MinorPentatonic, Blues, Egyptian, Japanese }
export enum ChordScale { MajorChord, MinorChord, Minor7Chord, MajorMaj7Chord, MinorMaj7Chord, MajorDim75Chord, MajorDim7Chord }
export enum ScaleMode { Gamma, Chord }
export enum ScaleStepType { Minor, Major, Any }
export enum ScaleType { Minor, Major, None }

export const SCALE_MODE_OPTIONS  = [
  {
    id: ScaleMode.Gamma,
    name: "Гамма",
  },
  {
    id: ScaleMode.Chord,
    name: "Аккорд",
  },
];

export const SCALE_STEPS: Gamma[] = [
  {
    id: Scale.Chromatic,
    name: "Хроматизм",
    steps: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    isMinorStep: null,
    type: ScaleType.None,
  },
  {
    id: Scale.Major,
    name: "Натуральный мажор",
    steps: [0, 2, 4, 5, 7, 9, 11],
    // TODO: Заменить boolean на ScaleStepType
    // TODO: Возможно стоит объединить со steps в одну модель
    isMinorStep: [false, true, true, false, false, true, null], 
    type: ScaleType.Major,
  },
  {
    id: Scale.Minor,
    name: "Натуральный минор",
    steps: [0, 2, 3, 5, 7, 8, 10],
    isMinorStep: [true, null, false, true, true, false, false],
    type: ScaleType.Minor,
  },
  {
    id: Scale.HarmonicMinor,
    name: "Гармонический минор",
    steps: [0, 2, 3, 5, 7, 8, 11],
    isMinorStep: [true, null, null, true, false, false, null],
    type: ScaleType.Minor,
  },
  {
    id: Scale.MelodicMinor,
    name: "Мелодический минор",
    steps: [0, 2, 3, 5, 7, 9, 11],
    isMinorStep: [true, true, null, false, false, null, null],
    type: ScaleType.Minor,
  },
  {
    id: Scale.MajorPentatonic,
    name: "Мажорная пентатоника",
    steps: [0, 2, 4, null, 7, null, 9],
    isMinorStep: [false, true, true, null, false, null, true],
    type: ScaleType.Major,
  },
  {
    id: Scale.MinorPentatonic,
    name: "Минорная пентатоника",
    steps: [0, null, 3, 5, 7, null, 10],
    isMinorStep: [true, null, false, true, true, null, false],
    type: ScaleType.Minor,
  },
  {
    id: Scale.Blues,
    name: "Блюзовая гамма",
    steps: [0, 3, 5, 6, 7, 10],
    isMinorStep: [false, false, false, null, false, false],
    type: ScaleType.Major,
  },
  {
    id: Scale.Egyptian,
    name: "Египетская пентатоника",
    steps: [0, 2, null, 5, null, 7, 10],
    isMinorStep: [true, null, false, false, true],
    type: ScaleType.Major,
  },
  {
    id: Scale.Japanese,
    name: "Японская пентатоника",
    steps: [0, 1, null, 5, 6, null, 10],
    isMinorStep: [true, false, null, true, false],
    type: ScaleType.Major,
  },
];

export const CHORDS_SCALE_STEPS: Gamma[]  = [
  {
    id: ChordScale.MajorChord,
    name: "Мажорный аккорд",
    steps: [0, 4, 7],
    isMinorStep: false,
    type: ScaleType.Major,
  },
  {
    id: ChordScale.MinorChord,
    name: "Минорный аккорд",
    steps: [0, 3, 7],
    isMinorStep: true,
    type: ScaleType.Minor,
  },
  {
    id: ChordScale.Minor7Chord,
    name: "Минорный септаккорд (m7)",
    steps: [0, 3, 7, 10],
    isMinorStep: null,
    type: ScaleType.Minor,
  },
  {
    id: ChordScale.Minor7Chord,
    name: "Мажорный септаккорд (7)",
    steps: [0, 4, 7, 10],
    isMinorStep: null,
    type: ScaleType.Major,
  },
  {
    id: ChordScale.MajorMaj7Chord,
    name: "Большой мажорный септаккорд (maj7)",
    steps: [0, 4, 7, 11],
    isMinorStep: null,
    type: ScaleType.Major,
  },
  {
    id: ChordScale.MinorMaj7Chord,
    name: "Большой минорный септаккорд (mmaj7)",
    steps: [0, 3, 7, 10],
    isMinorStep: null,
    type: ScaleType.Minor,
  },
  {
    id: ChordScale.MajorDim75Chord,
    name: "Уменьшенный септаккорд (dim7-5)",
    steps: [0, 3, 6, 9],
    isMinorStep: null,
    type: ScaleType.Major,
  },
  {
    id: ChordScale.MajorDim7Chord,
    name: "Полууменьшенный септаккорд (dim)",
    steps: [0, 3, 6, 8],
    isMinorStep: null,
    type: ScaleType.Major,
  },
];