import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { TaoButtonComponent, TaoCardComponent, TaoProgressComponent } from '@tao/ui';
import {
  AssessmentQuestionResult,
  AssessmentRoundResult,
} from '../../models/assessment-result.models';

@Component({
  selector: 'tao-assessment-round-results',
  standalone: true,
  imports: [TaoButtonComponent, TaoCardComponent, TaoProgressComponent],
  templateUrl: './assessment-round-results.html',
  styleUrl: './assessment-round-results.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssessmentRoundResultsComponent {
  readonly result = input.required<AssessmentRoundResult>();
  readonly selectedQuestionId = input<string | null>(null);
  readonly questionSelected = output<AssessmentQuestionResult>();

  selectQuestion(question: AssessmentQuestionResult): void {
    this.questionSelected.emit(question);
  }

  trackQuestion(_: number, question: AssessmentQuestionResult): string {
    return question.questionId;
  }

  scoreLabel(score: number | null): string {
    return score === null ? 'Not scored' : `${score}%`;
  }

  completedCount(): number {
    return this.result().questions.filter((question) => question.status.toLowerCase() !== 'skipped')
      .length;
  }

  skippedCount(): number {
    return this.result().questions.filter((question) => question.status.toLowerCase() === 'skipped')
      .length;
  }
}
