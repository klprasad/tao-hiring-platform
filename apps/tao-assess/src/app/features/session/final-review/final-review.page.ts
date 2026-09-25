import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AssessmentSessionStore } from '../../../core/assessment-session.store';
@Component({
  selector: 'tao-final-review',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './final-review.page.html',
  styleUrl: './final-review.page.scss',
})
export class FinalReviewPage {
  readonly store = inject(AssessmentSessionStore);
  readonly router = inject(Router);
  submit(): void {
    this.store.submit();
    this.router.navigate(['/session/demo-session/submitted']);
  }
}
