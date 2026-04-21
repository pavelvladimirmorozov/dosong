import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { SectorRenderState } from '../wid-cuart-circle.types';

@Component({
  selector: 'g[widCuartCircleSector]',
  templateUrl: './cuart-circle-sector.component.html',
  styleUrl: './cuart-circle-sector.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CuartCircleSector {
  public state = input.required<SectorRenderState>();
  public sectorClick = output<SectorRenderState>();

  protected onClick(): void {
    this.sectorClick.emit(this.state());
  }
}
