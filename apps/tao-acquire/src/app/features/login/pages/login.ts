import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { LoginCredentials, TaoAcquireLoginComponent } from '@tao/ui';

import { AuthService } from '../../../core/auth/auth.service';
import { redirectTarget } from '../../../core/auth/redirect-target';

/**
 * Entry screen of the recruiter application.
 *
 * Wraps the shared `TaoAcquireLoginComponent` form and turns validated
 * credentials into a signed-in session, after which the guarded routes become
 * reachable.
 */
@Component({
  selector: 'tao-login',
  imports: [TaoAcquireLoginComponent],
  template: `
    <tao-acquire-login
      description="Sign in with your recruiter account to open the workspace."
      [submitting]="submitting()"
      [errorMessage]="errorMessage()"
      (login)="onLogin($event)"
    />
  `,
})
export class Login {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly submitting = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  protected async onLogin(credentials: LoginCredentials): Promise<void> {
    this.submitting.set(true);
    this.errorMessage.set(null);

    try {
      await this.authService.signIn(credentials);
      await this.router.navigateByUrl(this.redirectUrl());
    } catch {
      this.errorMessage.set('Sign-in failed. Check your user name and password and try again.');
    } finally {
      this.submitting.set(false);
    }
  }

  /** Route the visitor asked for before being sent to the login screen. */
  private redirectUrl(): string {
    return redirectTarget(this.route.snapshot.queryParamMap.get('redirectTo'));
  }
}
