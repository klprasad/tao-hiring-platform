import { Component, input } from '@angular/core';

@Component({
  selector: 'tao-round-card',
  templateUrl: './tao-round-card.component.html',
  styleUrl: './tao-round-card.component.scss',
})
export class TaoRoundCardComponent {
  readonly order = input(1);
  readonly title = input('Assessment round');
  readonly detail = input('Round details');
}
