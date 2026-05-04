import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';

import { ComSelect } from '@components/select';

import { SongContextService } from '@services/chords';
import { ScaleSteepsService } from '@services/scale-steps/scale-steps.service';
import { Note, ScaleKind, ScaleQuality } from '@services/scale-steps/scale-steps.types';

@Component({
  selector: 'wid-tonality',
  imports: [ComSelect],
  templateUrl: './wid-tonality.component.html',
  styleUrl: './wid-tonality.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WidTonality {
  protected readonly scaleSteepsManager = inject(ScaleSteepsService);
  private readonly songContext = inject(SongContextService);

  protected readonly tonicViewValue = signal<Note>(this.scaleSteepsManager.selectedTonic());
  protected readonly qualityViewValue = signal(this.scaleSteepsManager.selectedQuality());
  protected readonly kindViewValue = signal(this.scaleSteepsManager.selectedKind());

  constructor() {
    effect(() => this.tonicViewValue.set(this.scaleSteepsManager.selectedTonic()));
    effect(() => this.qualityViewValue.set(this.scaleSteepsManager.selectedQuality()));
    effect(() => this.kindViewValue.set(this.scaleSteepsManager.selectedKind()));
  }

  protected async onTonicChange(value: Note | null): Promise<void> {
    if (value == null || value === this.scaleSteepsManager.selectedTonic()) return;
    this.tonicViewValue.set(value);
    const ok = await this.songContext.confirmTonalityChange();
    if (!ok) {
      this.tonicViewValue.set(this.scaleSteepsManager.selectedTonic());
      return;
    }
    this.scaleSteepsManager.selectedTonic.set(value);
  }

  protected async onQualityChange(value: ScaleQuality | null): Promise<void> {
    if (value == null || value === this.scaleSteepsManager.selectedQuality()) return;
    this.qualityViewValue.set(value);
    const ok = await this.songContext.confirmTonalityChange();
    if (!ok) {
      this.qualityViewValue.set(this.scaleSteepsManager.selectedQuality());
      return;
    }
    this.scaleSteepsManager.setQuality(value);
  }

  protected async onKindChange(value: ScaleKind | null): Promise<void> {
    if (value == null || value === this.scaleSteepsManager.selectedKind()) return;
    this.kindViewValue.set(value);
    const ok = await this.songContext.confirmTonalityChange();
    if (!ok) {
      this.kindViewValue.set(this.scaleSteepsManager.selectedKind());
      return;
    }
    this.scaleSteepsManager.setKind(value);
  }
}
