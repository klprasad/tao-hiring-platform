import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppConfigService, HttpLoadingService } from '@tao/core';
import { TaoLoadingStateComponent, TaoThemeSwitcherComponent } from '@tao/ui';
import { AssessmentNavigationService } from '../core/assessment-navigation.service';
import { AssessmentSessionStore } from '../core/assessment-session.store';

@Component({
  selector: 'tao-candidate-shell',
  standalone: true,
  imports: [RouterOutlet, TaoLoadingStateComponent, TaoThemeSwitcherComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './candidate-shell.component.html',
  styleUrl: './candidate-shell.component.scss',
})
export class CandidateShellComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly appConfig = inject(AppConfigService);
  private readonly assessmentNavigation = inject(AssessmentNavigationService);
  private readonly sessionStore = inject(AssessmentSessionStore);
  protected loadingService = inject(HttpLoadingService);
  readonly loading = this.loadingService.isLoading;
  readonly focusWarningVisible = signal(false);
  readonly focusWarningPending = signal(false);
  readonly focusWarningCount = signal(0);
  readonly maxAllowedWindowLeavePopups = this.appConfig.maxAllowedWindowLeavePopups;

  private readonly handleWindowBlur = (): void => this.recordFocusLoss();

  private readonly handleWindowFocus = (): void => this.showWarningAfterFocusReturns();

  private readonly handleVisibilityChange = (): void => {
    if (document.visibilityState === 'hidden') {
      this.recordFocusLoss();
    } else {
      this.showWarningAfterFocusReturns();
    }
  };

  private readonly handleBeforeUnload = (event: BeforeUnloadEvent): void => {
    if (this.isAssessmentActive()) {
      event.preventDefault();
      event.returnValue = '';
    }
  };

  constructor() {
    window.addEventListener('blur', this.handleWindowBlur);
    window.addEventListener('focus', this.handleWindowFocus);
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
    window.addEventListener('beforeunload', this.handleBeforeUnload);

    this.destroyRef.onDestroy(() => {
      window.removeEventListener('blur', this.handleWindowBlur);
      window.removeEventListener('focus', this.handleWindowFocus);
      document.removeEventListener('visibilitychange', this.handleVisibilityChange);
      window.removeEventListener('beforeunload', this.handleBeforeUnload);
    });
  }

  dismissFocusWarning(): void {
    this.focusWarningVisible.set(false);
  }

  private recordFocusLoss(): void {
    if (this.isAssessmentActive()) {
      this.focusWarningPending.set(true);
    }
  }

  private showWarningAfterFocusReturns(): void {
    if (this.focusWarningPending() && this.isAssessmentActive()) {
      this.focusWarningPending.set(false);
      const count = this.focusWarningCount() + 1;
      this.focusWarningCount.set(count);

      if (count > this.appConfig.maxAllowedWindowLeavePopups) {
        this.sessionStore.submit();
        this.focusWarningVisible.set(false);
        void this.assessmentNavigation.submitted();
        return;
      }

      this.focusWarningVisible.set(true);
    }
  }

  private isAssessmentActive(): boolean {
    return (
      this.sessionStore.started() && !this.sessionStore.submitted() && !this.sessionStore.expired()
    );
  }
}
