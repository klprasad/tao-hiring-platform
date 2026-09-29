import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { AssessmentNavigationService } from '../../../core/assessment-navigation.service';
import { LoginCredentials, TaoAcquireLoginComponent } from '@tao/ui';
import { AuthService } from '../../../core/auth.service';
@Component({
  selector: 'tao-authentication',
  standalone: true,
  imports: [TaoAcquireLoginComponent],
  templateUrl: './authentication.page.html',
  styleUrl: './authentication.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthenticationPage {
  private readonly authService = inject(AuthService);
  protected readonly submitting = signal(false);
  protected readonly errorMessage = signal<string | null>(null);
  private readonly assessmentNavigationService = inject(AssessmentNavigationService);

  protected async onLogin(credentials: LoginCredentials): Promise<void> {
    this.submitting.set(true);
    this.errorMessage.set(null);

    try {
      await this.authService.signIn(credentials);
      await this.assessmentNavigationService.landing();
    } catch {
      this.errorMessage.set('Sign-in failed. Check your user name and password and try again.');
    } finally {
      this.submitting.set(false);
    }
  }
}
