import { inject, Injectable } from '@angular/core';

import { ConfirmationService } from '@services/confirmation';
import { ScaleSteepsService } from '@services/scale-steps/scale-steps.service';
import { TuningService } from '@services/tuning';

import { ChordsService } from './chords.service';
import { ProgressionContext } from './progression.types';

@Injectable({ providedIn: 'root' })
export class SongContextService {
  private readonly chords = inject(ChordsService);
  private readonly scaleSteeps = inject(ScaleSteepsService);
  private readonly tuning = inject(TuningService);
  private readonly confirmation = inject(ConfirmationService);

  /** Создаёт прогрессию с зафиксированным текущим контекстом (тональность + строй). */
  public createProgression(name: string): string {
    const id = this.chords.createProgression(name);
    this.chords.setProgressionContext(id, this.snapshotCurrent());
    return id;
  }

  /**
   * Безопасно переключает активную прогрессию.
   * - id === null или прогрессия без контекста — переключаемся без подтверждений.
   * - У целевой есть контекст, отличающийся от текущего — спрашиваем подтверждение и применяем контекст.
   * Возвращает true, если переключение состоялось.
   */
  public async selectProgression(id: string | null): Promise<boolean> {
    if (id == null) {
      this.chords.activeProgressionId.set(null);
      return true;
    }
    const target = this.chords.progressions().find(p => p.id === id);
    if (!target) return false;

    if (target.context && this.contextDiffersFromCurrent(target.context)) {
      const ok = await this.confirmation.ask('progression.confirmApplyContext');
      if (!ok) return false;
      this.applyContext(target.context);
    }

    this.chords.activeProgressionId.set(id);
    return true;
  }

  /**
   * Гард для попыток сменить тональность извне (gamma, cuart-circle).
   * - Активной прогрессии нет — true сразу.
   * - Есть — спрашиваем подтверждение «завершить песню». На «да» сбрасываем активную прогрессию и возвращаем true.
   */
  public async confirmTonalityChange(): Promise<boolean> {
    if (this.chords.activeProgressionId() == null) return true;
    const ok = await this.confirmation.ask('progression.confirmFinishSong');
    if (ok) this.chords.activeProgressionId.set(null);
    return ok;
  }

  private snapshotCurrent(): ProgressionContext {
    return {
      tonic: this.scaleSteeps.selectedTonic(),
      scale: this.scaleSteeps.selectedScale(),
      tuning: this.tuning.tuning().map(s => ({ ...s })),
      fretsCount: this.tuning.fretsCount(),
    };
  }

  private contextDiffersFromCurrent(ctx: ProgressionContext): boolean {
    if (ctx.tonic !== this.scaleSteeps.selectedTonic()) return true;
    if (ctx.scale !== this.scaleSteeps.selectedScale()) return true;
    if (ctx.fretsCount !== this.tuning.fretsCount()) return true;
    const a = ctx.tuning;
    const b = this.tuning.tuning();
    if (a.length !== b.length) return true;
    for (let i = 0; i < a.length; i++) {
      if (a[i].note !== b[i].note || a[i].octave !== b[i].octave) return true;
    }
    return false;
  }

  private applyContext(ctx: ProgressionContext): void {
    this.scaleSteeps.selectedTonic.set(ctx.tonic);
    this.scaleSteeps.selectedScale.set(ctx.scale);
    this.tuning.tuning.set(ctx.tuning.map(s => ({ ...s })));
    this.tuning.fretsCount.set(ctx.fretsCount);
  }
}
