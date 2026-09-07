import { Component, input } from '@angular/core';

@Component({
  selector: 'tao-card',
  templateUrl: './tao-card.component.html',
  styleUrl: './tao-card.component.scss',
})
export class TaoCardComponent {
  readonly title = input('');
}
