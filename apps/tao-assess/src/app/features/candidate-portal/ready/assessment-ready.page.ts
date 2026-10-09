import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AssessmentSessionStore } from '../../../core/assessment-session.store';
import { AssessmentNavigationService } from '../../../core/assessment-navigation.service';
import { AssessmentService } from '../../../core/assessment.service';
import { catchError, EMPTY } from 'rxjs';
import { TaoButtonComponent, ToasterService } from '@tao/ui';
@Component({
  selector: 'tao-assessment-ready',
  imports: [TaoButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './assessment-ready.page.html',
  styleUrl: './assessment-ready.page.scss',
})
export class AssessmentReadyPage {
  readonly store = inject(AssessmentSessionStore);
  readonly assessmentService = inject(AssessmentService);
  private readonly toaster = inject(ToasterService);
  private readonly assessmentNavigationService = inject(AssessmentNavigationService);
  starting = false;
  start(): void {
    if (this.starting) {
      return;
    }

    this.starting = true;
    this.assessmentNavigationService.sessionWelcome();
    this.store.start();
    const assessmentSessionId = this.store.assessmentSessionId();
    this.assessmentService
      .startAssessment(assessmentSessionId)
      .pipe(
        catchError((error) => {
          this.starting = false;

          this.toaster.error('Failed to start assessment');

          return EMPTY;
        }),
      )
      .subscribe(() => {
        this.assessmentNavigationService.sessionWelcome();
      });
  }
  back() {
    this.assessmentNavigationService.browserCheck();
  }
}
