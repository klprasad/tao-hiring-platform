import { Component, input } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'tao-progress',
  imports: [MatProgressBarModule],
  templateUrl: './tao-progress.component.html',
  styleUrl: './tao-progress.component.scss',
})
export class TaoProgressComponent {
  readonly value = input(0);
  readonly label = input('Progress');
}
