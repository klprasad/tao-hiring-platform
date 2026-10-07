import { Component, inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'tao-toaster-message',
  imports: [MatButtonModule, MatIconModule],
  template: `
    <span class="toast-message">{{ data.message }}</span>
    <button
      mat-icon-button
      type="button"
      class="toast-dismiss"
      aria-label="Dismiss notification"
      (click)="snackBarRef.dismiss()"
    >
      <mat-icon aria-hidden="true">close</mat-icon>
    </button>
  `,
  styles: `
    :host {
      display: flex;
      align-items: center;
      gap: 12px;
      width: 100%;
    }

    .toast-message {
      flex: 1;
    }

    .toast-dismiss {
      flex: 0 0 auto;
      color: var(--mat-snack-bar-button-color, inherit);
    }
  `,
})
export class ToasterMessageComponent {
  protected readonly data = inject<{ message: string }>(MAT_SNACK_BAR_DATA);
  protected readonly snackBarRef = inject(MatSnackBarRef);
}
