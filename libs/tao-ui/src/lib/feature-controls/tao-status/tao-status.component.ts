import { Component, input } from '@angular/core';

@Component({
  selector: 'tao-status',
  templateUrl: './tao-status.component.html',
  styleUrl: './tao-status.component.scss',
})
export class TaoStatusComponent {
  readonly label = input('Status');
  readonly tone = input<'success' | 'warning' | 'danger' | 'info' | 'neutral'>('neutral');
}
