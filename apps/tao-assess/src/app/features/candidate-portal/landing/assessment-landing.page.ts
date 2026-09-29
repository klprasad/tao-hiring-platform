import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';

import { AssessmentSessionStore } from '../../../core/assessment-session.store';
import { AssessmentNavigationService } from '../../../core/assessment-navigation.service';
import { AssessmentSessionDto } from '../../../models/assessment-session.model';
import { AssessmentService } from '../../../core/assessment.service';

@Component({
  selector: 'tao-assessment-landing',
  standalone: true,
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
    this.loadAssessmentSession();
  }

  private loadAssessmentSession(): void {
    this.assessmentSessionService.getCurrentAssessmentSession('').subscribe({
      next: (assessment) => {
        this.store.assessmentSession.set(assessment);
      },
      error: (error) => {
        console.error('Failed to load assessment session', error);
      },
    });
  }

  continue(): void {
    this.assessmentNavigationService.consent();
  }
}
