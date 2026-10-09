import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TaoCardComponent, TaoProgressComponent } from '@tao/ui';
import { AssessmentQuestionResult } from '../../models/assessment-result.models';

@Component({
  selector: 'tao-assessment-question-result',
  standalone: true,
  imports: [TaoCardComponent, TaoProgressComponent],
  templateUrl: './assessment-question-result.html',
  styleUrl: './assessment-question-result.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssessmentQuestionResultComponent {
  readonly result = input.required<AssessmentQuestionResult>();

  trackCompetency(_: number, name: string): string {
    return name;
  }

  formatScore(value: number | null): string {
    return value === null ? 'Not scored' : `${value}%`;
  }
}
