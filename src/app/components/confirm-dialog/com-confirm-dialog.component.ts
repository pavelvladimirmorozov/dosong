import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { ChangeDetectionStrategy, Component, ViewEncapsulation, inject } from '@angular/core';

import { ComButton } from '@components/button';

export interface ConfirmDialogData {
  message: string;
  confirmLabel: string;
  cancelLabel: string;
}

@Component({
  selector: 'com-confirm-dialog',
  imports: [ComButton],
  templateUrl: './com-confirm-dialog.component.html',
  styleUrl: './com-confirm-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { class: 'com-confirm-dialog' },
})
export class ComConfirmDialog {
  protected readonly data = inject<ConfirmDialogData>(DIALOG_DATA);
  private readonly dialogRef = inject<DialogRef<boolean>>(DialogRef);

  protected confirm(): void {
    this.dialogRef.close(true);
  }

  protected cancel(): void {
    this.dialogRef.close(false);
  }
}
