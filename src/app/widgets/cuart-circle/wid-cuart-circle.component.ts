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
import { MAJOR_CHORDS, MINOR_CHORDS, ROMAN_NUMERALS } from '@utils/constants';
import { NoteColorsManager } from '@services/note-colors-manager';
import { ScaleSteepsManager } from '@services/scale-steps-manager';

@Component({
  selector: 'wid-cuart-circle',
  imports: [],
  templateUrl: './wid-cuart-circle.component.html',
  styleUrl: './wid-cuart-circle.component.scss'
})
export class WidCuartCircle implements AfterViewInit {
  // Смещение на 105° против часовой стрелке
  angleOffset = input(-105);

  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly colorsManager = inject(NoteColorsManager);
  private readonly scaleSteepsManager = inject(ScaleSteepsManager);
  canvasElenemt = viewChild.required<ElementRef<HTMLCanvasElement>>('circleCanvas');
  canvasSize = signal(400);

  // Тональности
  majorKeys = MAJOR_CHORDS;
  minorKeys = MINOR_CHORDS;

  canvas = computed(() => this.canvasElenemt().nativeElement);
  ctx = computed(() => this.canvasElenemt().nativeElement.getContext('2d')!);

  chordFontSize = computed(() => Math.floor(this.canvasSize() / 30));
  chordFontStyle = computed(() => `Bold ${this.chordFontSize()}px Arial`);

  gammaFontSize = computed(() => Math.floor(this.chordFontSize() / 1.5));
  gammaFontStyle = computed(() => `Bold ${this.gammaFontSize()}px Arial`);

  center = computed(() => this.canvasSize() / 2);
  outerRadius = computed(() => Math.floor(this.canvasSize() / 2 - 5));
  middleRadius = computed(() => Math.floor(this.canvasSize() / 3));
  innerRadius = computed(() => Math.floor(this.canvasSize() / 6));;
  angleStep = (2 * Math.PI) / 12;

  ngAfterViewInit(): void {
    this.updateSize();
  }

  @HostListener('window:resize')
  public onResize(): void {
    this.updateSize();
  }

  drawCircleEffect = effect(() => this.draw());

  private draw() {
    this.canvas().width = this.canvasSize();
    this.canvas().height = this.canvasSize();

    this.ctx().clearRect(0, 0, this.canvasSize(), this.canvasSize());
    for (let sector = 0; sector < 12; sector++) {
      this.drawSector(sector, true);
      this.drawSector(sector, false);
    }
  }

  drawSector(sector: number, isMinor: boolean) {
    const startAngle = sector * this.angleStep + this.angleOffset() * (Math.PI / 180);
    const endAngle = (sector + 1) * this.angleStep + this.angleOffset() * (Math.PI / 180);

    const startRadius = isMinor ? this.innerRadius() : this.middleRadius();
    const endRadius = isMinor ? this.middleRadius() : this.outerRadius();

    const labelAangleOffset = isMinor ? 0.15 : 0.1;
    const labelAngle = startAngle + this.angleStep * labelAangleOffset;
    const labelRadius = startRadius + (endRadius - startRadius) * 0.80;

    const textAngle = startAngle + this.angleStep / 2;
    const textRadius = isMinor
      ? (this.innerRadius() + this.middleRadius()) / 2
      : (this.middleRadius() + this.outerRadius()) / 2;

    const chord = isMinor
      ? this.minorKeys[sector]
      : this.majorKeys[sector];

    const chordName = chord.name;
    const chordTonic = chord.id;

    this.ctx().beginPath();
    this.ctx().moveTo(
      this.center() + startRadius * Math.cos(startAngle),
      this.center() + startRadius * Math.sin(startAngle)
    );
    this.ctx().arc(this.center(), this.center(), endRadius, startAngle, endAngle);
    this.ctx().lineTo(
      this.center() + startRadius * Math.cos(endAngle),
      this.center() + startRadius * Math.sin(endAngle)
    );
    this.ctx().arc(this.center(), this.center(), startRadius, endAngle, startAngle, true);
    this.ctx().stroke();

    // TODO: Рефакторинг услоий, вынести метод отрисовки
    // Информация о ступени
    const selectedScaleIsMinor = this.scaleSteepsManager.selectedScaleIsMinor();
    if (selectedScaleIsMinor != null) {
      const scaleStep = this.scaleSteepsManager.getScaleStep(chordTonic);

      const color = this.colorsManager.getNoteColor(chordTonic, scaleStep);
      this.ctx().fillStyle = color;
      const isSingleChord = typeof selectedScaleIsMinor === 'boolean';
      const isSingleChordSuitable = scaleStep === 0 && selectedScaleIsMinor === isMinor
      if (isSingleChord && isSingleChordSuitable) {
        this.ctx().fill();
        this.drawText(labelRadius, labelAngle, ROMAN_NUMERALS[scaleStep], '#fff');
      }
      if (!isSingleChord) {
        const tonicIsMinor = this.scaleSteepsManager.getScaleStepIsMinor(scaleStep);
        if (scaleStep != null && scaleStep >= 0) {
          this.ctx().fillStyle = tonicIsMinor == null ? '#aaa' : color;
          if (tonicIsMinor === isMinor || tonicIsMinor == null) {
            this.ctx().fill();
            this.drawText(labelRadius, labelAngle, ROMAN_NUMERALS[scaleStep], '#fff');
          }
        }
      }
    }

    this.drawText(textRadius, textAngle, chordName);
  }

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

  private updateSize() {
    const ref = this.elementRef;
    if (ref != null) {
      const width = ref.nativeElement.clientWidth
      this.canvasSize.set(width);
    }
  }
}
