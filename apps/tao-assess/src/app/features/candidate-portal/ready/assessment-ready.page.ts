import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AssessmentSessionStore } from '../../../core/assessment-session.store';
@Component({
  selector: 'tao-assessment-ready',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './assessment-ready.page.html',
  styleUrl: './assessment-ready.page.scss',
})
export class AssessmentReadyPage {
  readonly store = inject(AssessmentSessionStore);
  readonly router = inject(Router);
  starting = false;
  start(): void {
    if (this.starting) return;
    this.starting = true;
    this.store.start();
    this.router.navigate(['/session/demo-session/welcome']);
  }
}
