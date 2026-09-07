import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class TaoNotificationService {
  private readonly snackBar = inject(MatSnackBar);

  show(message: string, action = 'Dismiss', duration = 4000): void {
    this.snackBar.open(message, action, { duration });
  }
}
