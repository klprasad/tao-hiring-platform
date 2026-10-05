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

@Component({
  selector: 'tao-assessment-landing',
  imports: [TaoButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './assessment-landing.page.html',
  styleUrl: './assessment-landing.page.scss',
})
export class AssessmentLandingPage {
  readonly store = inject(AssessmentSessionStore);

  private readonly assessmentSessionService = inject(AssessmentService);

  private readonly assessmentNavigationService = inject(AssessmentNavigationService);

  readonly landing = this.store.landing;
  constructor() {
    this.createAssessmentSession();
  }

  createAssessmentSession() {
    const payload = {
      candidateApplicationId: '01A0ECCE-A4E1-794F-B45D-1A6125FACF6B',
      assessmentStrategyId: '01A0E6F3-E8BD-7538-B29F-E7A4CC78EEB1',
    };
    this.assessmentSessionService
      .createAssessmentSession(payload)
      .pipe(
        map(mapAssessmentSession),
        catchError((error) => {
          console.error('Failed to create assessment session', error);
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
    this.assessmentNavigationService.consent();
  }
}
