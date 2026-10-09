import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToasterMessageComponent } from './toaster-message.component';

@Injectable({ providedIn: 'root' })
export class ToasterService {
  private readonly snackBar = inject(MatSnackBar);

  success(message: string, duration = 4000): void {
    this.show(message, 'tao-toast--success', duration, 'polite');
  }

  error(message: string, duration = 30000): void {
    this.show(message, 'tao-toast--error', duration, 'assertive');
  }
  info(message: string, duration = 4000): void {
    this.show(message, 'tao-toast--info', duration, 'polite');
  }

  private show(
    message: string,
    panelClass: string,
    duration: number,
    politeness: 'polite' | 'assertive',
  ): void {
    this.snackBar.openFromComponent(ToasterMessageComponent, {
      data: { message },
      announcementMessage: message,
      duration,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass,
      politeness,
    });
  }
}
