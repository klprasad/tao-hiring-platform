import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TaoButtonComponent } from '../tao-button/tao-button.component';

export type TaoDialogType = 'alert' | 'confirm';

export interface TaoDialogData {
  type?: TaoDialogType;
  title: string;
  message: string;
}

@Component({
  selector: 'tao-dialog',
  imports: [MatDialogModule, TaoButtonComponent],
  templateUrl: './tao-dialog.component.html',
})
export class TaoDialogComponent {
  readonly data = inject<TaoDialogData>(MAT_DIALOG_DATA);
  readonly type = this.data.type ?? 'confirm';
  private readonly dialogRef = inject<MatDialogRef<TaoDialogComponent, boolean>>(MatDialogRef);

  confirm(): void {
    this.dialogRef.close(true);
  }

  cancel(): void {
    this.dialogRef.close(false);
  }
}
