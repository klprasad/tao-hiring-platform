import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TaoLoadingStateComponent, TaoThemeSwitcherComponent } from '@tao/ui';
import { HttpLoadingService } from '@tao/core';
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
  private readonly sessionStore = inject(AssessmentSessionStore);
  protected loadingService = inject(HttpLoadingService);
  readonly loading = this.loadingService.isLoading;
  readonly focusWarningVisible = signal(false);

  private readonly handleWindowBlur = (): void => this.showFocusWarningForActiveAssessment();

  private readonly handleVisibilityChange = (): void => {
    if (document.visibilityState === 'hidden') {
      this.showFocusWarningForActiveAssessment();
    }
  };

  constructor() {
    window.addEventListener('blur', this.handleWindowBlur);
    document.addEventListener('visibilitychange', this.handleVisibilityChange);

    this.destroyRef.onDestroy(() => {
      window.removeEventListener('blur', this.handleWindowBlur);
      document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    });
  }

  dismissFocusWarning(): void {
    this.focusWarningVisible.set(false);
  }

  private showFocusWarningForActiveAssessment(): void {
    if (
      this.sessionStore.started() &&
      !this.sessionStore.submitted() &&
      !this.sessionStore.expired()
    ) {
      this.focusWarningVisible.set(true);
    }
  }
}
