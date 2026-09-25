import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AssessmentSessionStore } from '../../../core/assessment-session.store';
@Component({
  selector: 'tao-recovery',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './recovery.page.html',
  styleUrl: './recovery.page.scss',
})
export class RecoveryPage {
  readonly store = inject(AssessmentSessionStore);
  readonly router = inject(Router);
  resume(): void {
    this.router.navigate(['/session/demo-session/question']);
  }
}
