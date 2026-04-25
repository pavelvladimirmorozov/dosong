import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';

import { ChordsService } from '@services/chords';

import { SectorRenderState } from '../wid-cuart-circle.types';

@Component({
  selector: 'g[widCuartCircleSector]',
  templateUrl: './cuart-circle-sector.component.html',
  styleUrl: './cuart-circle-sector.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.cuart-circle-sector--highlighted]': 'isHighlighted()',
  },
})
export class CuartCircleSector {
  public state = input.required<SectorRenderState>();
  public sectorClick = output<SectorRenderState>();

  private readonly chords = inject(ChordsService);

  protected readonly isHighlighted = computed(() => {
    const selected = this.chords.selectedChord();
    if (!selected) return false;
    const s = this.state();
    return selected.root === s.chord.id && selected.isMinor === s.isMinor;
  });

  protected onClick(): void {
    this.sectorClick.emit(this.state());
  }
}
