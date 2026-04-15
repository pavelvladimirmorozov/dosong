import { SectorParams, TextParams } from './wid-cuart-circle.types';

const SECTORS = 12;
const LABEL_ANGLE_BIAS = 0.33;  // сдвиг по часовой стрелке от центра сегмента
const LABEL_RADIUS_BIAS = 0.82; // доля глубины кольца от внутреннего края к внешнему

export class CuartCircleGeometry {
  readonly angleStep = (2 * Math.PI) / SECTORS;

  constructor(
    private readonly size: number,
    private readonly angleOffsetDeg: number
  ) {}

  get center(): number       { return this.size / 2; }
  get outerRadius(): number  { return Math.floor(this.size / 2 - 5); }
  get middleRadius(): number { return Math.floor(this.size / 3); }
  get innerRadius(): number  { return Math.floor(this.size / 6); }
  get outerTextRadius(): number { return Math.floor(this.size / 2.5); }
  get innerTextRadius(): number { return Math.floor(this.size / 4); }

  angleForSector(sector: number): number {
    return sector * this.angleStep + this.angleOffsetDeg * (Math.PI / 180);
  }

  sectorParams(sector: number, isMinor: boolean): SectorParams {
    return {
      startAngle: this.angleForSector(sector),
      endAngle: this.angleForSector(sector + 1),
      startRadius: isMinor ? this.innerRadius : this.middleRadius,
      endRadius: isMinor ? this.middleRadius : this.outerRadius,
    };
  }

  textParams(sector: number, isMinor: boolean): TextParams {
    return {
      angle: this.angleForSector(sector + 0.5),
      radius: isMinor ? this.innerTextRadius : this.outerTextRadius,
    };
  }

  labelParams(sector: number, isMinor: boolean): TextParams {
    const midAngle = this.angleForSector(sector + 0.5);
    const innerR = isMinor ? this.innerRadius : this.middleRadius;
    const outerR = isMinor ? this.middleRadius : this.outerRadius;
    return {
      angle: midAngle + this.angleStep * LABEL_ANGLE_BIAS,
      radius: innerR + (outerR - innerR) * LABEL_RADIUS_BIAS,
    };
  }
}
