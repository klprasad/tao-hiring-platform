import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';

import { MatIconModule } from '@angular/material/icon';

import { AssessmentRound } from '../../components/assessment-round/assessment-round';
import { ActivatedRoute, Router } from '@angular/router';
import { AssessmentStrategyService } from '../../data-access/assessment-strategy.service';
import { catchError, EMPTY, map } from 'rxjs';
import {
  AssessmentRoundVm,
  AssessmentStrategyStatus,
  AssessmentVm,
  mapAssessmentDtoToVm,
  updateAssessmentRoundRequest,
} from '../../models/assessment-strategy.models';
import { TaoButtonComponent } from '@tao/ui';

@Component({
  selector: 'tao-assessment-overview',
  imports: [MatIconModule, AssessmentRound, TaoButtonComponent],
  templateUrl: './assessment-overview.html',
  styleUrl: './assessment-overview.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssessmentOverview implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly service = inject(AssessmentStrategyService);
  readonly editingRoundOrder = signal<number | null>(null);
  readonly errorMessage = signal('');

  readonly assessment = signal<AssessmentVm | null>(null);
  readonly status = AssessmentStrategyStatus;
  /**
   * Campaign the assessment strategy belongs to.
   */
  readonly campaignId = this.resolveCampaignId();

  /**
   * Assessment strategy ID.
   */
  readonly strategyId = computed(() => this.assessment()?.id);

  /**
   * Assessment rounds.
   */
  readonly rounds = computed(() => this.assessment()?.rounds ?? []);

  /**
   * Total number of rounds.
   */
  readonly totalRounds = computed(() => {
    return this.rounds().length;
  });

  /**
   * Total duration across all rounds.
   */
  readonly totalDurationInMinutes = computed(() => {
    return this.rounds().reduce((total, round) => total + round.durationInMinutes, 0);
  });

  /**
   * Total number of questions across all rounds.
   */
  readonly totalQuestions = computed(() => {
    return this.rounds().reduce((total, round) => total + round.targetQuestionCount, 0);
  });

  /**
   * Human-readable duration.
   */
  readonly totalDurationLabel = computed(() => {
    const minutes = this.totalDurationInMinutes();

    if (minutes === 0) {
      return '0 min';
    }

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (hours === 0) {
      return `${remainingMinutes} min`;
    }

    if (remainingMinutes === 0) {
      return `${hours} hr`;
    }

    return `${hours} hr ${remainingMinutes} min`;
  });

  /**
   * Overall difficulty based on the assessment rounds.
   */
  readonly difficultyLabel = computed(() => {
    const difficulties = this.rounds().map((round) => round.difficulty);

    const uniqueDifficulties = [...new Set(difficulties)];

    const order: Record<string, number> = {
      Easy: 1,
      Medium: 2,
      Hard: 3,
    };

    return uniqueDifficulties.sort((a, b) => (order[a] ?? 0) - (order[b] ?? 0)).join('–');
  });

  /**
   * Status displayed in the UI.
   */
  readonly statusLabel = computed(() => {
    switch (this.assessment()?.status) {
      case 'Generated':
        return 'Generated';

      case 'Approved':
        return 'Approved';

      case 'Rejected':
        return 'Rejected';

      case 'Draft':
        return 'Draft';

      default:
        return 'Draft';
    }
  });

  /**
   * Whether the assessment is approved.
   */
  readonly isApproved = computed(() => {
    return this.assessment()?.status === 'Approved';
  });
  startEditingRound(order: number): void {
    this.editingRoundOrder.set(order);
  }
  ngOnInit(): void {
    this.loadAssessmentStrategy();
  }

  createStrategy(): void {
    if (!this.campaignId) {
      this.errorMessage.set('A campaign is required to create an assessment strategy.');
      return;
    }

    this.errorMessage.set('');

    this.service
      .createAssessmentStrategy(this.campaignId)
      .pipe(
        map(mapAssessmentDtoToVm),
        catchError(() => {
          this.errorMessage.set('The assessment strategy could not be created. Please try again.');
          return EMPTY;
        }),
      )
      .subscribe((response) => {
        if (response) this.assessment.set(response);
        else {
          this.loadAssessmentStrategy();
        }
      });
  }

  loadAssessmentStrategy() {
    this.service
      .getAssessmentStrategy(this.campaignId)
      .pipe(
        map(mapAssessmentDtoToVm),
        catchError(() => {
          this.errorMessage.set('The assessment strategy could not be created. Please try again.');
          return EMPTY;
        }),
      )
      .subscribe((response) => {
        if (response) this.assessment.set(response);
        else {
          this.createStrategy();
        }
      });
  }
  approveStrategy(): void {
    const id = this.strategyId();

    // Replace this with your auth store.
    const approvedByUserId = ''; // this.authStore.user()?.id;

    if (!id) {
      return;
    }

    if (!approvedByUserId) {
      this.errorMessage.set('You must be signed in to approve an assessment strategy.');
      return;
    }

    this.errorMessage.set('');

    this.service
      .approveAssessmentStrategy(id, { approvedByUserId })
      .pipe(
        catchError(() => {
          this.errorMessage.set('The assessment strategy could not be approved. Please try again.');
          return EMPTY;
        }),
      )
      .subscribe(() => {
        const currentAssessment = this.assessment();

        if (currentAssessment) {
          this.assessment.set({
            ...currentAssessment,
            status: 'Approved',
            approvedByUserId,
            approvedOn: new Date().toISOString(),
          });
        }
      });
  }

  private resolveCampaignId(): string {
    return (
      this.route.snapshot.paramMap.get('campaignId') ??
      this.route.parent?.snapshot.paramMap.get('campaignId') ??
      this.route.snapshot.queryParamMap.get('campaignId') ??
      ''
    );
  }
  saveRound(updatedRound: AssessmentRoundVm): void {
    const assessment = this.assessment();

    if (!assessment) {
      return;
    }

    const updatedRounds = assessment.rounds.map((round) =>
      round.order === updatedRound.order ? updatedRound : round,
    );

    const payload: updateAssessmentRoundRequest = {
      assessmentName: assessment.assessmentName,
      rounds: updatedRounds,
    };
    this.service
      .updateAssessmentRounds(assessment.id, payload)
      .pipe(
        map(mapAssessmentDtoToVm),
        catchError(() => {
          this.errorMessage.set('The assessment strategy could not be approved. Please try again.');
          return EMPTY;
        }),
      )
      .subscribe((response) => {
        if (response) this.assessment.set(response);
      });
    this.editingRoundOrder.set(null);
  }
  cancelEditingRound(): void {
    this.editingRoundOrder.set(null);
  }
  cancel(): void {
    const campaignId = this.route.snapshot.paramMap.get('campaignId');
    this.router.navigate(['/campaigns', campaignId]);
  }
}
