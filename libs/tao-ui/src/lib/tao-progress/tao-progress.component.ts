import { Component, input } from '@angular/core';

@Component({
  selector: 'tao-progress',
  templateUrl: './tao-progress.component.html',
  styleUrl: './tao-progress.component.scss',
})
export class TaoProgressComponent {
  readonly value = input(0);
  readonly label = input('Progress');
}
