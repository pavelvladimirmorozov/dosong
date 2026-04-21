const SECTORS = 12;
const LABEL_ANGLE_BIAS = 0.33;
const LABEL_RADIUS_BIAS = 0.82;

export interface Point { x: number; y: number; }

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

  sectorPath(sector: number, isMinor: boolean): string {
    const a1 = this.angleForSector(sector);
    const a2 = this.angleForSector(sector + 1);
    const rInner = isMinor ? this.innerRadius : this.middleRadius;
    const rOuter = isMinor ? this.middleRadius : this.outerRadius;
    const p1 = this.point(rInner, a1);
    const p2 = this.point(rOuter, a1);
    const p3 = this.point(rOuter, a2);
    const p4 = this.point(rInner, a2);
    return `M ${p1.x} ${p1.y} L ${p2.x} ${p2.y} A ${rOuter} ${rOuter} 0 0 1 ${p3.x} ${p3.y} L ${p4.x} ${p4.y} A ${rInner} ${rInner} 0 0 0 ${p1.x} ${p1.y} Z`;
  }

  chordTextPoint(sector: number, isMinor: boolean): Point {
    const angle = this.angleForSector(sector + 0.5);
    const radius = isMinor ? this.innerTextRadius : this.outerTextRadius;
    return this.point(radius, angle);
  }

  numeralTextPoint(sector: number, isMinor: boolean): Point {
    const midAngle = this.angleForSector(sector + 0.5);
    const innerR = isMinor ? this.innerRadius : this.middleRadius;
    const outerR = isMinor ? this.middleRadius : this.outerRadius;
    const angle = midAngle + this.angleStep * LABEL_ANGLE_BIAS;
    const radius = innerR + (outerR - innerR) * LABEL_RADIUS_BIAS;
    return this.point(radius, angle);
  }

  private point(radius: number, angle: number): Point {
    return {
      x: this.center + radius * Math.cos(angle),
      y: this.center + radius * Math.sin(angle),
    };
  }
}
