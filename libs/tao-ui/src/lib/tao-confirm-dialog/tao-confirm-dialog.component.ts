import { Component, input, output } from '@angular/core';

@Component({
  selector: 'tao-confirm-dialog',
  templateUrl: './tao-confirm-dialog.component.html',
  styleUrl: './tao-confirm-dialog.component.scss',
})
export class TaoConfirmDialogComponent {
  readonly title = input('Confirm action');
  readonly message = input('Are you sure?');
  readonly confirmed = output<void>();
  readonly cancelled = output<void>();
}
