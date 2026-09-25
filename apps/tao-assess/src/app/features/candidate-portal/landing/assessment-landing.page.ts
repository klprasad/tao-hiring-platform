import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AssessmentSessionStore } from '../../../core/assessment-session.store';

@Component({
  selector: 'tao-assessment-landing',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './assessment-landing.page.html',
  styleUrl: './assessment-landing.page.scss',
})
export class AssessmentLandingPage {
  readonly store = inject(AssessmentSessionStore);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  continue(): void {
    this.router.navigate(['../consent'], { relativeTo: this.route });
  }
}
