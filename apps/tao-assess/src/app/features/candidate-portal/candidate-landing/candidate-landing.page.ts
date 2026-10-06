import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthStore } from '@tao/core';
import { TaoButtonComponent, TaoInputComponent } from '@tao/ui';
import { catchError, firstValueFrom, forkJoin, throwError } from 'rxjs';

import { AssessmentNavigationService } from '../../../core/assessment-navigation.service';
import { AssessmentService } from '../../../core/assessment.service';
import { AssessmentSessionStore } from '../../../core/assessment-session.store';
import { loginModelDto } from '../../../models/login.model';
import { AuthenticationPage } from '../authentication/authentication.page';

@Component({
  selector: 'tao-candidate-landing',
  imports: [ReactiveFormsModule, TaoButtonComponent, TaoInputComponent, AuthenticationPage],
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

    const invitationId = this.store.invitationId();
    if (!invitationId) {
      return;
    }

    const request: loginModelDto = {
      email,
      password,
    };

    this.isSubmitting.set(true);

    try {
      await firstValueFrom(
        this.assessmentService.candidateSignUp(invitationId, request).pipe(
          catchError((error) => {
            console.error('Failed to create assessment session', error);
            return throwError(() => error);
          }),
        ),
      );

      const { user, context } = await firstValueFrom(
        forkJoin({
          user: this.assessmentService.getAuthUser().pipe(
            catchError((error) => {
              console.error('Failed to load auth user', error);
              return throwError(() => error);
            }),
          ),
          context: this.assessmentService.getAssessmentContext(invitationId).pipe(
            catchError((error) => {
              console.error('Failed to load assessment context', error);
              return throwError(() => error);
            }),
          ),
        }),
      );

      this.authStore.signIn(user);
      this.store.assessmentStategyId.set(context.assessmentStrategyId);
      this.store.candidateApplicationId.set(context.candidateApplicationId);
      this.assessmentNavigationService.consent();
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
