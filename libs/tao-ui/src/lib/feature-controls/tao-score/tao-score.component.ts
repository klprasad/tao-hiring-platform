import { Component, input } from '@angular/core';

@Component({
  selector: 'tao-score',
  templateUrl: './tao-score.component.html',
  styleUrl: './tao-score.component.scss',
})
export class TaoScoreComponent {
  readonly value = input(0);
  readonly label = input('Score');
}
