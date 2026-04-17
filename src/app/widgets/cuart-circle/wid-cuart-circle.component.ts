import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
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
import { SectorParams, SectorVisualState } from './wid-cuart-circle.types';
import { CuartCircleGeometry } from './cuart-circle-geometry';

@Component({
  selector: 'wid-cuart-circle',
  imports: [],
  templateUrl: './wid-cuart-circle.component.html',
  styleUrl: './wid-cuart-circle.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WidCuartCircle implements AfterViewInit {
  // Смещение на 105° против часовой стрелки
  angleOffset = input(-105);

  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly colorsManager = inject(NoteColorsService);
  private readonly scaleStepsManager = inject(ScaleSteepsService);

  private canvasElement = viewChild.required<ElementRef<HTMLCanvasElement>>('circleCanvas');
  canvasSize = signal(400);

  private canvas = computed(() => this.canvasElement().nativeElement);
  private ctx = computed(() => this.canvasElement().nativeElement.getContext('2d')!);

  private chordFontSize = computed(() => Math.floor(this.canvasSize() / 30));
  private chordFontStyle = computed(() => `Bold ${this.chordFontSize()}px Arial`);
  private gammaFontStyle = computed(() => `Bold ${this.chordFontSize()}px Arial`);

  private geometry = computed(() => new CuartCircleGeometry(this.canvasSize(), this.angleOffset()));

  drawCircleEffect = effect(() => this.draw());

  ngAfterViewInit(): void {
    this.updateSize();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.updateSize();
  }

  private updateSize(): void {
    const width = this.elementRef.nativeElement.clientWidth;
    this.canvasSize.set(width);
  }

  private draw(): void {
    const size = this.canvasSize();
    this.canvas().width = size;
    this.canvas().height = size;
    this.ctx().clearRect(0, 0, size, size);

    for (let sector = 0; sector < 12; sector++) {
      this.drawSector(sector, true);
      this.drawSector(sector, false);
    }
  }

  private drawSector(sector: number, isMinor: boolean): void {
    const geo = this.geometry();
    const sectorParams = geo.sectorParams(sector, isMinor);
    const textPos = geo.textParams(sector, isMinor);
    const visual = this.resolveSectorVisualState(sector, isMinor);

    this.drawSectorBorder(sectorParams);

    if (visual.fillColor) {
      this.fillSector(sectorParams, visual.fillColor);
    }
    if (visual.labelNumeral) {
      const labelPos = geo.labelParams(sector, isMinor);
      this.drawText(labelPos.radius, labelPos.angle, visual.labelNumeral, this.colorsManager.themeColor(), this.gammaFontStyle());
    }
    this.drawText(textPos.radius, textPos.angle, visual.chord.name, visual.textColor);
  }

  // Единственное место, где запрашиваются сервисы — возвращает чистые данные без рендеринга
  private resolveSectorVisualState(sector: number, isMinor: boolean): SectorVisualState {
    const chord = isMinor ? MINOR_CHORDS[sector] : MAJOR_CHORDS[sector];
    const step = this.scaleStepsManager.getScaleStep(chord.id);
    const defaultColor = this.colorsManager.themeColor();

    if (!step || step.stepNumber == null || step.type === ScaleStepQuality.None) {
      return { chord, fillColor: null, textColor: defaultColor, labelNumeral: null };
    }
    if (step.type === ScaleStepQuality.Any) {
      return { chord, fillColor: this.colorsManager.themeMutedColor(), textColor: defaultColor, labelNumeral: null };
    }
    if ((step.type === ScaleStepQuality.Minor) === isMinor) {
      const colors = this.colorsManager.getNoteColor(chord.id, step.stepNumber);
      return {
        chord,
        fillColor: colors.backgroundColor,
        textColor: colors.color,
        labelNumeral: ROMAN_NUMERALS[step.stepNumber],
      };
    }
    return { chord, fillColor: null, textColor: defaultColor, labelNumeral: null };
  }

  //#region Canvas drawing primitives

  private buildSectorPath(sectorParams: SectorParams): void {
    const ctx = this.ctx();
    const center = this.geometry().center;
    const { startRadius, endRadius, startAngle, endAngle } = sectorParams;

    ctx.beginPath();
    ctx.moveTo(center + startRadius * Math.cos(startAngle), center + startRadius * Math.sin(startAngle));
    ctx.arc(center, center, endRadius, startAngle, endAngle);
    ctx.lineTo(center + startRadius * Math.cos(endAngle), center + startRadius * Math.sin(endAngle));
    ctx.arc(center, center, startRadius, endAngle, startAngle, true);
  }

  private drawSectorBorder(sectorParams: SectorParams): void {
    this.buildSectorPath(sectorParams);
    this.ctx().stroke();
  }

  private fillSector(sectorParams: SectorParams, fillStyle: string): void {
    this.buildSectorPath(sectorParams);
    this.ctx().fillStyle = fillStyle;
    this.ctx().fill();
    this.ctx().stroke();
  }

  private drawText(radius: number, angle: number, text: string, color?: string, font?: string): void {
    const ctx = this.ctx();
    const geo = this.geometry();
    ctx.font = font ?? this.chordFontStyle();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = color ?? this.colorsManager.themeColor();
    ctx.fillText(text, geo.center + radius * Math.cos(angle), geo.center + radius * Math.sin(angle));
  }

  //#endregion
}
