import { Dialog } from '@angular/cdk/dialog';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { ComConfirmDialog, ConfirmDialogData } from '@components/confirm-dialog';

import { I18nService } from '@services/i18n';

export interface ConfirmAskOptions {
  confirmKey?: string;
  cancelKey?: string;
}

@Injectable({ providedIn: 'root' })
export class ConfirmationService {
  private readonly dialog = inject(Dialog);
  private readonly i18n = inject(I18nService);

  /** Открывает модальный диалог подтверждения. Возвращает true, если пользователь согласился. */
  public ask(messageKey: string, opts?: ConfirmAskOptions): Promise<boolean> {
    const ref = this.dialog.open<boolean, ConfirmDialogData, ComConfirmDialog>(ComConfirmDialog, {
      data: {
        message: this.i18n.t(messageKey),
        confirmLabel: this.i18n.t(opts?.confirmKey ?? 'common.ok'),
        cancelLabel: this.i18n.t(opts?.cancelKey ?? 'common.cancel'),
      },
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-dark-backdrop',
      disableClose: false,
    });
    return firstValueFrom(ref.closed).then(v => v === true);
  }
}
