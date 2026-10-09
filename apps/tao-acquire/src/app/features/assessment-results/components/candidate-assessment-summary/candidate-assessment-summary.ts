import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { TaoButtonComponent, TaoCardComponent, TaoProgressComponent } from '@tao/ui';
import {
  AssessmentCandidate,
  AssessmentCompetency,
  AssessmentRoundSummary,
  AssessmentSummary,
} from '../../models/assessment-result.models';

@Component({
  selector: 'tao-candidate-assessment-summary',
  standalone: true,
  imports: [TaoButtonComponent, TaoCardComponent, TaoProgressComponent],
  templateUrl: './candidate-assessment-summary.html',
  styleUrl: './candidate-assessment-summary.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CandidateAssessmentSummaryComponent {
  readonly candidate = input.required<AssessmentCandidate>();
  readonly summary = input.required<AssessmentSummary>();
  readonly selectedRoundId = input<string | null>(null);
  readonly roundSelected = output<AssessmentRoundSummary>();

  selectRound(round: AssessmentRoundSummary): void {
    this.roundSelected.emit(round);
  }

  recommendationLabel(value: string): string {
    switch (value) {
      case 'Recommended':
        return 'Recommended';
      case 'NotRecommended':
        return 'Not recommended';
      case 'NeedsReview':
        return 'Needs review';
      default:
        return value;
    }
  }

  recommendationClass(value: string): string {
    switch (value) {
      case 'Recommended':
        return 'is-positive';
      case 'NotRecommended':
        return 'is-negative';
      default:
        return 'is-neutral';
    }
  }

  trackCompetency(_: number, competency: AssessmentCompetency): string {
    return competency.name;
  }

  trackRound(_: number, round: AssessmentRoundSummary): string {
    return round.roundId;
  }
}
