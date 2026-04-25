import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';

import { decorateChordName, qualitySuffix } from '@services/chords';
import { NoteColorsService } from '@services/note-colors/note-colors.service';
import { NoteNamesManager } from '@services/note-names/note-names.service';
import { ScaleSteepsService } from '@services/scale-steps/scale-steps.service';
import { Note, ScaleQuality, ScaleStepQuality } from '@services/scale-steps/scale-steps.types';
import { ROMAN_NUMERALS } from '@utils/constants';

import { CuartCircleGeometry } from './cuart-circle-geometry';
import { CuartCircleSector } from './cuart-circle-sector/cuart-circle-sector.component';
import { MAJOR_CHORD_ORDER, MINOR_CHORD_ORDER } from './wid-cuart-circle.constants';
import { SectorChord, SectorRenderState } from './wid-cuart-circle.types';

const VIEWBOX_SIZE = 400;

@Component({
  selector: 'wid-cuart-circle',
  imports: [CuartCircleSector],
  templateUrl: './wid-cuart-circle.component.html',
  styleUrl: './wid-cuart-circle.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WidCuartCircle {
  // Смещение на 105° против часовой стрелки
  public angleOffset = input(-105);
  public sectorSelected = output<Note>();

  private readonly colorsManager = inject(NoteColorsService);
  private readonly scaleStepsManager = inject(ScaleSteepsService);
  private readonly noteNamesManager = inject(NoteNamesManager);

  protected readonly viewBox = `0 0 ${VIEWBOX_SIZE} ${VIEWBOX_SIZE}`;
  private readonly geometry = computed(() => new CuartCircleGeometry(VIEWBOX_SIZE, this.angleOffset()));

  protected readonly sectors = computed<SectorRenderState[]>(() => {
    const geo = this.geometry();
    const noteNames = this.noteNamesManager.noteNames();
    const result: SectorRenderState[] = [];
    for (let sector = 0; sector < 12; sector++) {
      result.push(this.buildSectorState(sector, false, geo, noteNames));
      result.push(this.buildSectorState(sector, true, geo, noteNames));
    }
    return result;
  });

  protected onSectorClick(state: SectorRenderState): void {
    this.scaleStepsManager.selectedTonic.set(state.chord.id);
    const targetQuality = state.isMinor ? ScaleQuality.Minor : ScaleQuality.Major;
    if (this.scaleStepsManager.selectedQuality() !== targetQuality) {
      this.scaleStepsManager.setQuality(targetQuality);
    }
    this.sectorSelected.emit(state.chord.id);
  }

  private buildSectorState(
    sector: number,
    isMinor: boolean,
    geo: CuartCircleGeometry,
    noteNames: { name: string }[],
  ): SectorRenderState {
    const chordId = isMinor ? MINOR_CHORD_ORDER[sector] : MAJOR_CHORD_ORDER[sector];
    const baseName = noteNames[chordId].name;
    const chord: SectorChord = { id: chordId, name: isMinor ? baseName + 'm' : baseName };
    const step = this.scaleStepsManager.getScaleStep(chordId);
    const defaultColor = this.colorsManager.themeColor();
    const base = {
      sector,
      isMinor,
      chord,
      path: geo.sectorPath(sector, isMinor),
      chordTextPos: geo.chordTextPoint(sector, isMinor),
      numeralTextPos: geo.numeralTextPoint(sector, isMinor),
      strokeColor: defaultColor,
    };

    if (!step || step.stepNumber == null || step.type === ScaleStepQuality.None) {
      return { ...base, fillColor: null, textColor: defaultColor, numeral: null };
    }
    if (step.type === ScaleStepQuality.Any) {
      return { ...base, fillColor: this.colorsManager.themeMutedColor(), textColor: defaultColor, numeral: null };
    }

    // Уменьшенные аккорды живут в минорном кольце, увеличенные — в мажорном
    const ringMatches =
      (isMinor && (step.type === ScaleStepQuality.Minor || step.type === ScaleStepQuality.Diminished)) ||
      (!isMinor && (step.type === ScaleStepQuality.Major || step.type === ScaleStepQuality.Augmented));

    if (!ringMatches) {
      return { ...base, fillColor: null, textColor: defaultColor, numeral: null };
    }

    const colors = this.colorsManager.getNoteColor(chordId, step.stepNumber);
    return {
      ...base,
      chord: { ...chord, name: decorateChordName(baseName, isMinor, step.type) },
      fillColor: colors.noteColor,
      textColor: colors.textColor,
      numeral: ROMAN_NUMERALS[step.stepNumber] + qualitySuffix(step.type),
    };
  }
}
