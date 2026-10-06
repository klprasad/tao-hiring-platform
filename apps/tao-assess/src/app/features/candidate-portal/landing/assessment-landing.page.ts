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
      candidateApplicationId: '01A11063-C441-77E7-9CDA-5C9EFC0E04E1',
      assessmentStrategyId: '01A11064-3717-75E8-B7A9-7B65C3F9716C',
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
