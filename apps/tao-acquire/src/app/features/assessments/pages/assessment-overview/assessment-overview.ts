import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';

import { MatIconModule } from '@angular/material/icon';
import { AssessmentVm, mapAssessmentToVm } from '../../models/assessment-strategy.models';
import { AssessmentRound } from '../../components/assessment-round/assessment-round';
import { ActivatedRoute } from '@angular/router';
import { AssessmentStrategyService } from '../../data-access/assessment-strategy.service';
import { catchError, EMPTY, map } from 'rxjs';

@Component({
  imports: [MatIconModule, AssessmentRound],
  selector: 'tao-assessment-overview',
  styleUrl: './assessment-overview.scss',
  templateUrl: './assessment-overview.html',
})
export class AssessmentOverview implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly service = inject(AssessmentStrategyService);

  readonly errorMessage = signal('');
  readonly isCreating = signal(false);
  readonly isApproving = signal(false);
  readonly strategyId = signal<string | undefined>(undefined);

  /**
   * Campaign the assessment strategy belongs to.
   *
   * Comes from `/campaigns/:campaignId/assessment-strategy` (route param), or
   * from the `campaignId` query parameter when opened standalone.
   */
  readonly campaignId = this.resolveCampaignId();

  readonly assessment = signal<AssessmentVm | null>(null);
  readonly statusLabel = computed(() => {
    switch (this.assessment()?.status) {
      case 1:
        return 'Active';

      case 2:
        return 'Completed';

      default:
        return 'Draft';
    }
  });

  readonly totalDurationLabel = computed(() => {
    const assessment = this.assessment();

    if (!assessment) {
      return '';
    }
    const minutes = assessment.totalDurationInMinutes;

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

  ngOnInit(): void {
    this.createStrategy();
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
        map(mapAssessmentToVm),
        catchError(() => {
          this.errorMessage.set('The assessment strategy could not be created. Please try again.');
          return EMPTY;
        }),
      )
      .subscribe((response) => {
        this.assessment.set(response);
      });
  }

  approveStrategy(): void {
    const id = this.strategyId();
    const approvedByUserId = ''; //this.authStore.user()?.id;

    if (!id || this.isApproving()) {
      return;
    }

    if (!approvedByUserId) {
      this.errorMessage.set('You must be signed in to approve an assessment strategy.');
      return;
    }

    this.isApproving.set(true);
    this.errorMessage.set('');

    this.service
      .approveAssessmentStrategy(id, { approvedByUserId })
      .pipe(
        catchError(() => {
          this.errorMessage.set('The assessment strategy could not be approved. Please try again.');
          this.isApproving.set(false);
          return EMPTY;
        }),
      )
      .subscribe(() => {
        this.strategyId.set(undefined);
        this.isApproving.set(false);
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
}
