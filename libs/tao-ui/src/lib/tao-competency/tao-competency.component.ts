import { Component, input } from '@angular/core';
import { TaoConfidenceComponent } from '../tao-confidence/tao-confidence.component';

@Component({
  selector: 'tao-competency',
  imports: [TaoConfidenceComponent],
  templateUrl: './tao-competency.component.html',
  styleUrl: './tao-competency.component.scss',
})
export class TaoCompetencyComponent {
  readonly name = input('Competency');
  readonly level = input('Strong');
  readonly score = input(0);
}
