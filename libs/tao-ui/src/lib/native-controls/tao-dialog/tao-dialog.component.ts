import { Component, input, output } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { TaoButtonComponent } from '../tao-button/tao-button.component';

@Component({
  selector: 'tao-dialog',
  imports: [MatDialogModule, TaoButtonComponent],
  templateUrl: './tao-dialog.component.html',
  styleUrl: './tao-dialog.component.scss',
})
export class TaoDialogComponent {
  readonly title = input('Confirm action');
  readonly message = input('Are you sure?');
  readonly open = input(false);
  readonly confirmed = output<void>();
  readonly cancelled = output<void>();
}
