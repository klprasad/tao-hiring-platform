import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';

import { AssessmentSessionStore } from '../../../core/assessment-session.store';
import { AssessmentNavigationService } from '../../../core/assessment-navigation.service';
import {
  AssessmentSessionDto,
  mapAssessmentSession,
} from '../../../models/assessment-session.model';
import { AssessmentService } from '../../../core/assessment.service';
import { catchError, EMPTY, map } from 'rxjs';
import { TaoButtonComponent } from '@tao/ui';
import { ToasterService } from '@tao/core';

@Component({
  selector: 'tao-assessment-landing',
  imports: [TaoButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './assessment-landing.page.html',
  styleUrl: './assessment-landing.page.scss',
})
export class AssessmentLandingPage {
  readonly store = inject(AssessmentSessionStore);
  private readonly toaster = inject(ToasterService);
  private readonly assessmentSessionService = inject(AssessmentService);

  private readonly assessmentNavigationService = inject(AssessmentNavigationService);

  readonly landing = this.store.landing;
  constructor() {
    this.createAssessmentSession();
  }

  createAssessmentSession() {
    const candidateApplicationId = this.store.candidateApplicationId();
    const assessmentStrategyId = this.store.assessmentStrategyId();
    if (!candidateApplicationId || !assessmentStrategyId) return;

    const payload = {
      candidateApplicationId: candidateApplicationId,
      assessmentStrategyId: assessmentStrategyId,
    };
    this.assessmentSessionService
      .createAssessmentSession(payload)
      .pipe(
        map(mapAssessmentSession),
        catchError((error) => {
          this.toaster.error('Failed to create assessment session');
          return EMPTY;
        }),
      )
      .subscribe((assessment) => {
        this.assessmentNavigationService.accessToken.set(assessment.id);
        this.assessmentNavigationService.sessionId.set(assessment.id);
        this.store.assessmentSession.set(assessment);
      });
  }

  continue(): void {
    this.assessmentNavigationService.ready();
  }
}
