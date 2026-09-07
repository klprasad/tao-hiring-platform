import { Component, input } from '@angular/core';

@Component({
  selector: 'tao-status-chip',
  templateUrl: './tao-status-chip.component.html',
  styleUrl: './tao-status-chip.component.scss',
})
export class TaoStatusChipComponent {
  readonly label = input('Status');
  readonly tone = input<'active' | 'warning' | 'danger' | 'neutral'>('neutral');
}
