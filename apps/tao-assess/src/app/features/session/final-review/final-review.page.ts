import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AssessmentSessionStore } from '../../../core/assessment-session.store';
import { TaoButtonComponent } from '@tao/ui';
import { AssessmentNavigationService } from '../../../core/assessment-navigation.service';
@Component({
  selector: 'tao-final-review',
  imports: [TaoButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './final-review.page.html',
  styleUrl: './final-review.page.scss',
})
export class FinalReviewPage {
  readonly store = inject(AssessmentSessionStore);
  private readonly assessmentNavigationService = inject(AssessmentNavigationService);
  readonly router = inject(Router);
  submit(): void {
    this.store.submit();
    this.assessmentNavigationService.submitted();
  }
}
