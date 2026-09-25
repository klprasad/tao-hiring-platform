import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AssessmentSessionStore } from '../../../core/assessment-session.store';
import { AssessmentNavigationService } from '../../../core/assessment-navigation.service';
@Component({
  selector: 'tao-assessment-ready',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './assessment-ready.page.html',
  styleUrl: './assessment-ready.page.scss',
})
export class AssessmentReadyPage {
  readonly store = inject(AssessmentSessionStore);
  private readonly assessmentNavigationService = inject(AssessmentNavigationService);
  starting = false;
  start(): void {
    if (this.starting) return;
    this.starting = true;
    this.store.start();
    this.assessmentNavigationService.sessionWelcome();
  }
  back() {
    this.assessmentNavigationService.browserCheck();
  }
}
