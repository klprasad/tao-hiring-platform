import { Component, input } from '@angular/core';

@Component({
  selector: 'tao-stat-card',
  templateUrl: './tao-stat-card.component.html',
  styleUrl: './tao-stat-card.component.scss',
})
export class TaoStatCardComponent {
  readonly label = input('');
  readonly value = input('');
  readonly detail = input('');
  readonly trend = input('');
}
