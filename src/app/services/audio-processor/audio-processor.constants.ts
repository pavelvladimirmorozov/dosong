import { Beat } from "./audio-processor.types";

// const majorOctaveFrequencies = [
//   { note: 'C', frequency: 65.41 },   // До
//   { note: 'C#', frequency: 69.30 },  // До-диез
//   { note: 'D', frequency: 73.42 },   // Ре
//   { note: 'D#', frequency: 77.78 },  // Ре-диез
//   { note: 'E', frequency: 82.41 },   // Ми
//   { note: 'F', frequency: 87.31 },   // Фа
//   { note: 'F#', frequency: 92.50 },  // Фа-диез
//   { note: 'G', frequency: 98.00 },   // Соль
//   { note: 'G#', frequency: 103.83 }, // Соль-диез
//   { note: 'A', frequency: 110.00 },  // Ля
//   { note: 'A#', frequency: 116.54 }, // Ля-диез
//   { note: 'B', frequency: 123.47 }   // Си
// ];


export const BEATS: Beat[] = [
    {
      frequency: 0,
      duration: 0,
      type: 'sine',
    },
    {
      frequency: 55,
      duration: 0.3,
      type: 'sine',
    },
    {
      frequency: 65.41,
      duration: 0.3,
      type: 'sine',
    },
    {

      frequency: 110,
      duration: 0.3,
      type: 'sine', 
    },
    {
      frequency: 164.8,
      duration: 0.3,
      type: 'sine',
    },
    {

      frequency: 220,
      duration: 0.5,
      type: 'sine',
    },
  ]