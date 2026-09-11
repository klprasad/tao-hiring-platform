import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { catchError, EMPTY } from 'rxjs';

import { TaoButtonComponent, TaoCardComponent, TaoPageHeaderComponent } from 'tao-ui';
import { AuthStore } from 'tao-core';
import { AssessmentStrategyService } from '../data-access/assessment-strategy.service';

@Component({
  selector: 'tao-assessments',
  imports: [TaoButtonComponent, TaoCardComponent, TaoPageHeaderComponent],
  templateUrl: './assessments.html',
  styleUrl: './assessments.scss',
})
export class Assessments {
  private readonly route = inject(ActivatedRoute);
  private readonly service = inject(AssessmentStrategyService);
  private readonly authStore = inject(AuthStore);

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

  createStrategy(): void {
    if (!this.campaignId) {
      this.errorMessage.set('A campaign is required to create an assessment strategy.');
      return;
    }

    this.isCreating.set(true);
    this.errorMessage.set('');

    this.service
      .createAssessmentStrategy(this.campaignId)
      .pipe(
        catchError(() => {
          this.errorMessage.set('The assessment strategy could not be created. Please try again.');
          this.isCreating.set(false);
          return EMPTY;
        }),
      )
      .subscribe((response) => {
        this.strategyId.set(response.value);
        this.isCreating.set(false);
      });
  }

  approveStrategy(): void {
    const id = this.strategyId();
    const approvedByUserId = this.authStore.user()?.id;

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
