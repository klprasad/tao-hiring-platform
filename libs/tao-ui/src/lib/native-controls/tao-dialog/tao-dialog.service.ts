import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { map, Observable } from 'rxjs';
import { TaoDialogComponent, TaoDialogData } from './tao-dialog.component';

@Injectable({ providedIn: 'root' })
export class TaoDialogService {
  private readonly dialog = inject(MatDialog);

  showConfirmBox(title: string, message: string): Observable<boolean> {
    return this.open({ type: 'confirm', title, message })
      .afterClosed()
      .pipe(map((confirmed) => confirmed === true));
  }

  showAlertBox(title: string, message: string): void {
    this.open({ type: 'alert', title, message });
  }

  private open(data: TaoDialogData) {
    return this.dialog.open<TaoDialogComponent, TaoDialogData, boolean>(TaoDialogComponent, {
      data,
      maxWidth: '480px',
      ariaLabel: data.title,
    });
  }
}
