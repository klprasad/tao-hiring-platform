import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoginCredentials, TaoLoginComponent } from '@tao/ui';

import { AssessmentNavigationService } from '../../../core/assessment-navigation.service';
import { AssessmentService } from '../../../core/assessment.service';
import { AssessmentSessionStore } from '../../../core/assessment-session.store';
import { AuthService } from '../../../core/auth.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'tao-assess-authentication',
  standalone: true,
  imports: [TaoLoginComponent],
  templateUrl: './authentication.page.html',
  styleUrl: './authentication.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthenticationPage {
  private readonly route = inject(ActivatedRoute);
  private readonly authService = inject(AuthService);
  private readonly assessmentService = inject(AssessmentService);
  private readonly assessmentNavigationService = inject(AssessmentNavigationService);
  private readonly store = inject(AssessmentSessionStore);

  protected readonly submitting = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  protected async onLogin(credentials: LoginCredentials): Promise<void> {
    this.submitting.set(true);
    this.errorMessage.set(null);

    try {
      await this.authService.signIn(credentials);

      const invitationId =
        this.route.snapshot.paramMap.get('invitationId') ?? this.store.invitationId();

      if (invitationId) {
        this.store.invitationId.set(invitationId);

        const context = await firstValueFrom(
          this.assessmentService.getAssessmentContext(invitationId),
        );

        this.store.assessmentStategyId.set(context.assessmentStrategyId);
        this.store.candidateApplicationId.set(context.candidateApplicationId);
      }

      await this.assessmentNavigationService.consent();
    } catch {
      this.errorMessage.set('Sign-in failed. Check your user name and password and try again.');
    } finally {
      this.submitting.set(false);
    }
  }
}
