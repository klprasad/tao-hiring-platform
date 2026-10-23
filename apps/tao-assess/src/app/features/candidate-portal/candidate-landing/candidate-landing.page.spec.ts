import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { signal } from '@angular/core';
import { of } from 'rxjs';
import { AuthStore } from '@tao/core';
import { ToasterService } from '@tao/ui';
import { AssessmentNavigationService } from '../../../core/assessment-navigation.service';
import { AssessmentService } from '../../../core/assessment.service';
import { AssessmentSessionStore } from '../../../core/assessment-session.store';
import { CandidateLandingPage } from './candidate-landing.page';

describe('CandidateLandingPage', () => {
  let fixture: ComponentFixture<CandidateLandingPage>;
  const invitationId = signal<string | null>(null);
  const assessmentStrategyId = signal<string | null>(null);
  const candidateApplicationId = signal<string | null>(null);
  const signIn = vi.fn();
  const candidateSignUp = vi.fn();
  const getAuthUser = vi.fn();
  const getAssessmentContext = vi.fn();
  const consent = vi.fn();
  const error = vi.fn();

  beforeEach(async () => {
    invitationId.set(null);
    assessmentStrategyId.set(null);
    candidateApplicationId.set(null);
    signIn.mockClear();
    candidateSignUp.mockReset();
    getAuthUser.mockReset();
    getAssessmentContext.mockReset();
    consent.mockClear();
    error.mockClear();
    await TestBed.configureTestingModule({
      imports: [CandidateLandingPage],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => 'invite-1' } } },
        },
        { provide: AuthStore, useValue: { signIn } },
        {
          provide: AssessmentSessionStore,
          useValue: { invitationId, assessmentStrategyId, candidateApplicationId },
        },
        {
          provide: AssessmentService,
          useValue: { candidateSignUp, getAuthUser, getAssessmentContext },
        },
        { provide: AssessmentNavigationService, useValue: { consent } },
        { provide: ToasterService, useValue: { error } },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(CandidateLandingPage);
  });

  it('loads the invitation id and supports entry, signup, login, and back modes', () => {
    const page = fixture.componentInstance;
    expect(invitationId()).toBe('invite-1');
    expect(page.mode()).toBe('entry');

    page.showSignUp();
    expect(page.mode()).toBe('signup');
    page.showLogin();
    expect(page.mode()).toBe('login');
    page.back();
    expect(page.mode()).toBe('entry');
  });

  it('does not call the signup API when the form is invalid', async () => {
    await fixture.componentInstance.signUp();

    expect(candidateSignUp).not.toHaveBeenCalled();
    expect(fixture.componentInstance.signUpForm.touched).toBe(true);
  });

  it('rejects a password mismatch without creating an account', async () => {
    const form = fixture.componentInstance.signUpForm;
    form.setValue({
      email: 'candidate@example.test',
      password: 'secret123',
      confirmPassword: 'different',
    });
    await fixture.componentInstance.signUp();

    expect(form.controls.confirmPassword.errors).toEqual({ passwordMismatch: true });
    expect(candidateSignUp).not.toHaveBeenCalled();
  });

  it('creates the account, stores identity/context, and navigates to consent', async () => {
    const user = { id: 'user-1' } as never;
    candidateSignUp.mockReturnValue(of({}));
    getAuthUser.mockReturnValue(of(user));
    getAssessmentContext.mockReturnValue(
      of({
        assessmentStrategyId: 'strategy-1',
        candidateApplicationId: 'candidate-1',
      }),
    );
    fixture.componentInstance.signUpForm.setValue({
      email: 'candidate@example.test',
      password: 'secret123',
      confirmPassword: 'secret123',
    });

    await fixture.componentInstance.signUp();

    expect(candidateSignUp).toHaveBeenCalledWith('invite-1', {
      email: 'candidate@example.test',
      password: 'secret123',
    });
    expect(signIn).toHaveBeenCalledWith(user);
    expect(assessmentStrategyId()).toBe('strategy-1');
    expect(candidateApplicationId()).toBe('candidate-1');
    expect(consent).toHaveBeenCalledOnce();
    expect(fixture.componentInstance.isSubmitting()).toBe(false);
  });
});
