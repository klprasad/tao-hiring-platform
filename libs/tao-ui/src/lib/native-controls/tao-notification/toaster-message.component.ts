import { Component, inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'tao-toaster-message',
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './toaster-message.component.html',
  styleUrl: './toaster-message.component.scss',
})
export class ToasterMessageComponent {
  protected readonly data = inject<{ message: string }>(MAT_SNACK_BAR_DATA);
  protected readonly snackBarRef = inject(MatSnackBarRef);
}
