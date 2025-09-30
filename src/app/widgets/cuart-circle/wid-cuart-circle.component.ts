import {
  AfterViewInit,
  Component,
  computed, effect,
  ElementRef,
  HostListener,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { NoteColorsService } from '@services/note-colors/note-colors.service';
import { ScaleSteepsService } from '@services/scale-steps/scale-steps.service';
import { ScaleStepQuality } from '@services/scale-steps/scale-steps.types';
import { MAJOR_CHORDS, MINOR_CHORDS } from './wid-cuart-circle.constants';
import { ROMAN_NUMERALS } from '@utils/constants';
import { SectorParams, TextParams } from './wid-cuart-circle.types';

@Component({
  selector: 'wid-cuart-circle',
  imports: [],
  templateUrl: './wid-cuart-circle.component.html',
  styleUrl: './wid-cuart-circle.component.scss'
})
export class WidCuartCircle implements AfterViewInit {
  // Смещение на 105° против часовой стрелке
  angleOffset = input(-105);

  majorKeys = MAJOR_CHORDS;
  minorKeys = MINOR_CHORDS;

  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly colorsManager = inject(NoteColorsService);
  private readonly scaleSteepsManager = inject(ScaleSteepsService);
  canvasElenemt = viewChild.required<ElementRef<HTMLCanvasElement>>('circleCanvas');
  canvasSize = signal(400);

  canvas = computed(() => this.canvasElenemt().nativeElement);
  ctx = computed(() => this.canvasElenemt().nativeElement.getContext('2d')!);

  chordFontSize = computed(() => Math.floor(this.canvasSize() / 30));
  chordFontStyle = computed(() => `Bold ${this.chordFontSize()}px Arial`);

  gammaFontSize = computed(() => Math.floor(this.chordFontSize() / 1.5));
  gammaFontStyle = computed(() => `Bold ${this.gammaFontSize()}px Arial`);

  center = computed(() => this.canvasSize() / 2);
  outerRadius = computed(() => Math.floor(this.canvasSize() / 2 - 5));
  middleRadius = computed(() => Math.floor(this.canvasSize() / 3));
  innerRadius = computed(() => Math.floor(this.canvasSize() / 6));
  innerTextRadius = computed(() => Math.floor(this.canvasSize() / 4));
  outerTextRadius = computed(() => Math.floor(this.canvasSize() / 2.5));
  angleStep = (2 * Math.PI) / 12;

  ngAfterViewInit(): void {
    this.updateSize();
  }

  @HostListener('window:resize')
  public onResize(): void {
    this.updateSize();
  }

  private updateSize() {
    const ref = this.elementRef;
    if (ref != null) {
      const width = ref.nativeElement.clientWidth
      this.canvasSize.set(width);
    }
  }

  drawCircleEffect = effect(() => this.draw());

  protected draw() {
    this.canvas().width = this.canvasSize();
    this.canvas().height = this.canvasSize();

    this.ctx().clearRect(0, 0, this.canvasSize(), this.canvasSize());
    for (let sector = 0; sector < 12; sector++) {
      this.drawSector(sector, true);
      this.drawSector(sector, false);
    }
  }

  protected drawSector(sector: number, isMinor: boolean) {
    const sectorParams = this.calculateSectorParams(sector, isMinor);
    this.drawSectorBorder(sectorParams);

    const chord = isMinor ? this.minorKeys[sector] : this.majorKeys[sector];
    const tonicScaleStep = this.scaleSteepsManager.getScaleStep(chord.id);

    const { radius, angle } = this.calculateTextParams(sector, isMinor);

    if (tonicScaleStep == null || tonicScaleStep.stepNumber == null) {
      this.drawText(radius, angle, chord.name);
    } else if (tonicScaleStep.type === ScaleStepQuality.Any || tonicScaleStep.type === ScaleStepQuality.None) {
      this.fillSector(sectorParams, '#aaa');

      this.drawText(radius, angle, chord.name);
    } else if ((tonicScaleStep.type === ScaleStepQuality.Minor) === isMinor) {
      const color = this.colorsManager.getNoteColor(chord.id, tonicScaleStep.stepNumber);
      this.fillSector(sectorParams, color.backgroundColor);

      const labelParams = this.calculateLabelParams(sector, isMinor);
      this.drawText(labelParams.radius, labelParams.angle, ROMAN_NUMERALS[tonicScaleStep.stepNumber], '#fff');

      this.drawText(radius, angle, chord.name, color.color);
    } else {
      const { radius, angle } = this.calculateTextParams(sector, isMinor);
      this.drawText(radius, angle, chord.name);
    }
  }

  //#region Draw
  private drawText(radius: number, angle: number, text: string, color: string = "#000") {
    this.ctx().font = this.chordFontStyle();
    this.ctx().textAlign = 'center';
    this.ctx().fillStyle = color;
    this.ctx().fillText(
      text,
      this.center() + radius * Math.cos(angle),
      this.center() + radius * Math.sin(angle)
    );
  }

  drawSectorBorder(sectorParams: SectorParams) {
    this.selectSectorBorder(sectorParams);
    this.ctx().stroke();
  }

  fillSector(sectorParams: SectorParams, fillStyle: string) {
    this.selectSectorBorder(sectorParams);
    this.ctx().fillStyle = fillStyle;
    this.ctx().fill();
  }

  selectSectorBorder(sectorParams: SectorParams) {
    this.ctx().beginPath();
    this.ctx().moveTo(
      this.center() + sectorParams.startRadius * Math.cos(sectorParams.startAngle),
      this.center() + sectorParams.startRadius * Math.sin(sectorParams.startAngle)
    );
    this.ctx().arc(
      this.center(),
      this.center(),
      sectorParams.endRadius,
      sectorParams.startAngle,
      sectorParams.endAngle
    );
    this.ctx().lineTo(
      this.center() + sectorParams.startRadius * Math.cos(sectorParams.endAngle),
      this.center() + sectorParams.startRadius * Math.sin(sectorParams.endAngle)
    );
    this.ctx().arc(
      this.center(),
      this.center(),
      sectorParams.startRadius,
      sectorParams.endAngle,
      sectorParams.startAngle,
      true);
    this.ctx().stroke();
  }
  //#endregion Draw

  //#region Calculate params
  private calculateSectorParams(sector: number, isMinor: boolean): SectorParams {
    return {
      startAngle: this.calculateAngeleForSector(sector),
      endAngle: this.calculateAngeleForSector(sector + 1),
      startRadius: isMinor ? this.innerRadius() : this.middleRadius(),
      endRadius: isMinor ? this.middleRadius() : this.outerRadius(),
    }
  }

  private calculateTextParams(sector: number, isMinor: boolean): TextParams {
    return {
      angle: this.calculateAngeleForSector(sector + 0.5),
      radius: isMinor ? this.innerTextRadius() : this.outerTextRadius(),
    }
  }

  private calculateLabelParams(sector: number, isMinor: boolean): TextParams {
    const radiusScale = sector > 3 && sector < 9 ? 1.17 : 1.13;
    const angleScale = sector > 3 && sector < 9 ? 0.8 : 0.85;
    return {
      angle: this.calculateAngeleForSector(sector + angleScale),
      radius: isMinor ? this.innerTextRadius() * radiusScale : this.outerTextRadius() * radiusScale,
    }
  }

  private calculateAngeleForSector(sector: number) {
    return sector * this.angleStep + this.angleOffset() * (Math.PI / 180)
  }
  //#endregion Calculate params
}
