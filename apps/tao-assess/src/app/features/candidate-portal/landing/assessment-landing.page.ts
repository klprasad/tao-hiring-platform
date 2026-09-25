import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AssessmentSessionStore } from '../../../core/assessment-session.store';
import { AssessmentNavigationService } from '../../../core/assessment-navigation.service';

@Component({
  selector: 'tao-assessment-landing',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './assessment-landing.page.html',
  styleUrl: './assessment-landing.page.scss',
})
export class AssessmentLandingPage {
  readonly store = inject(AssessmentSessionStore);
  private readonly assessmentNavigationService = inject(AssessmentNavigationService);
  continue(): void {
    this.assessmentNavigationService.consent();
  }
}
