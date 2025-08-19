import { ChordScale, Scale, ScaleType } from "@utils/constants/scale-steps";

export interface Gamma {
  id: Scale | ChordScale ;
  name: string,
  steps: (number | null)[];
  isMinorStep: boolean | null| (boolean | null)[];
  type: ScaleType;
}