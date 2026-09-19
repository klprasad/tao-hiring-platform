import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { MatIconModule } from '@angular/material/icon';
import { AssessmentRoundVm } from '../../models/assessment-strategy.models';

@Component({
  imports: [MatIconModule],
  selector: 'tao-assessment-round',
  styleUrl: './assessment-round.scss',
  templateUrl: './assessment-round.html',
})
export class AssessmentRound {
  readonly round = input.required<AssessmentRoundVm>();
}
