import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { TaoButtonComponent, TaoInputComponent } from '@tao/ui';
import { AssessmentSessionStore } from '../../../core/assessment-session.store';
import { AuthenticationPage } from '../authentication/authentication.page';
import { loginModelDto } from '../../../models/login.model';
import { AssessmentService } from '../../../core/assessment.service';
import { catchError, EMPTY } from 'rxjs';
import { AuthStore } from '@tao/core';
import { AssessmentNavigationService } from '../../../core/assessment-navigation.service';

@Component({
  selector: 'tao-candidate-landing',
  standalone: true,
  imports: [ReactiveFormsModule, TaoButtonComponent, TaoInputComponent, AuthenticationPage],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './candidate-landing.page.html',
  styleUrl: './candidate-landing.page.scss',
})
export class CandidateLandingPage {
  private readonly route = inject(ActivatedRoute);
  private readonly authStore = inject(AuthStore);
  private readonly fb = inject(FormBuilder);
  readonly store = inject(AssessmentSessionStore);
  private readonly assessmentService = inject(AssessmentService);
  private readonly assessmentNavigationService = inject(AssessmentNavigationService);
  readonly mode = signal<'entry' | 'signup' | 'login'>('entry');

  readonly isSubmitting = signal(false);

  readonly signUpForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required]],
  });
  constructor() {
    const invitationId = this.route.snapshot.paramMap.get('invitationId');

    if (invitationId) {
      this.store.invitationId.set(invitationId);
    }
  }
  showSignUp(): void {
    this.mode.set('signup');
  }

  showLogin(): void {
    this.mode.set('login');
  }

  back(): void {
    this.mode.set('entry');
  }

  async signUp(): Promise<void> {
    if (this.signUpForm.invalid) {
      this.signUpForm.markAllAsTouched();
      return;
    }

    const { email, password, confirmPassword } = this.signUpForm.getRawValue();

    if (password !== confirmPassword) {
      this.signUpForm.controls.confirmPassword.setErrors({
        passwordMismatch: true,
      });

      return;
    }

    if (!this.store.invitationId()) {
      return;
    }

    this.isSubmitting.set(true);

    try {
      const request: loginModelDto = {
        email: email,
        password: password,
      };

      const invitationId = this.store.invitationId();
      if (!invitationId) return;
      this.assessmentService
        .candidateSignUp(invitationId, request)
        .pipe(
          catchError((error) => {
            console.error('Failed to create assessment session', error);
            return EMPTY;
          }),
        )
        .subscribe((user) => {
          this.getAuthUser();
        });
    } finally {
      this.isSubmitting.set(false);
    }
  }
  getAuthUser() {
    this.assessmentService
      .getAuthUser()
      .pipe(
        catchError((error) => {
          console.error('Failed to create assessment session', error);
          return EMPTY;
        }),
      )
      .subscribe((user) => {
        this.authStore.signIn(user);
        this.assessmentNavigationService.consent();
      });
  }
}
