import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AssessmentSessionStore } from '../../../core/assessment-session.store';
@Component({
  selector: 'tao-round-transition',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './round-transition.page.html',
  styleUrl: './round-transition.page.scss',
})
export class RoundTransitionPage {
  readonly store = inject(AssessmentSessionStore);
  private readonly router = inject(Router);
  continue(): void {
    this.router.navigate(['/session/demo-session/question']);
  }
}
