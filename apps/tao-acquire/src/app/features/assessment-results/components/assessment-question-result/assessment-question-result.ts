import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { TaoButtonComponent, TaoCardComponent, TaoProgressComponent } from '@tao/ui';
import { AssessmentQuestionResult } from '../../models/assessment-result.models';

@Component({
  selector: 'tao-assessment-question-result',
  standalone: true,
  imports: [TaoCardComponent, TaoProgressComponent, TaoButtonComponent],
  templateUrl: './assessment-question-result.html',
  styleUrl: './assessment-question-result.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssessmentQuestionResultComponent {
  readonly result = input.required<AssessmentQuestionResult>();
  readonly roundType = input.required<string>();
  readonly responseRequested = output<void>();

  isCodingRound(): boolean {
    return this.roundType().trim().toLowerCase().includes('coding');
  }

  canViewResponse(): boolean {
    return this.isCodingRound() ? this.result().hasCandidateCode : this.result().hasConversation;
  }

  trackCompetency(_: number, name: string): string {
    return name;
  }

  formatScore(value: number | null): string {
    return value === null ? 'Not scored' : `${value}%`;
  }
}
