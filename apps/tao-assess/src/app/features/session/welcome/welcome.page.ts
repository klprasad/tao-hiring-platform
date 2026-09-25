import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AssessmentSessionStore } from '../../../core/assessment-session.store';
import { AssessmentNavigationService } from '../../../core/assessment-navigation.service';
@Component({
  selector: 'tao-assessment-welcome',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './welcome.page.html',
  styleUrl: './welcome.page.scss',
})
export class WelcomePage {
  readonly store = inject(AssessmentSessionStore);
  private readonly assessmentNavigationService = inject(AssessmentNavigationService);
  begin(): void {
    this.assessmentNavigationService.question();
  }
}
