import { ChangeDetectionStrategy, Component } from '@angular/core';
@Component({
  selector: 'tao-expired',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './expired.page.html',
  styleUrl: './expired.page.scss',
})
export class ExpiredPage {}
