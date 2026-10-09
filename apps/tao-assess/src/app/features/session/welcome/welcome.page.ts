import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AssessmentSessionStore } from '../../../core/assessment-session.store';
import { AssessmentNavigationService } from '../../../core/assessment-navigation.service';
import { TaoButtonComponent, ToasterService } from '@tao/ui';
import { catchError, EMPTY } from 'rxjs';
import { AssessmentService } from '../../../core/assessment.service';
@Component({
  selector: 'tao-assessment-welcome',
  imports: [TaoButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './welcome.page.html',
  styleUrl: './welcome.page.scss',
})
export class WelcomePage {
  readonly store = inject(AssessmentSessionStore);
  private readonly assessmentNavigationService = inject(AssessmentNavigationService);
  private readonly assessmentService = inject(AssessmentService);
  private readonly toaster = inject(ToasterService);
  begin(): void {
    this.refreshWorkflowState();
  }
  private refreshWorkflowState(): void {
    const sessionId = this.store.assessmentSessionId();

    if (!sessionId) {
      this.toaster.error('Assessment session is not available.');
      return;
    }

    this.assessmentService
      .getAssessmentWorkflow(sessionId)
      .pipe(
        catchError(() => {
          this.toaster.error('Failed to refresh assessment workflow');
          return EMPTY;
        }),
      )
      .subscribe((workflow) => {
        this.store.setAssessmentWorkflow(workflow);
        this.assessmentNavigationService.question();
      });
  }
}
