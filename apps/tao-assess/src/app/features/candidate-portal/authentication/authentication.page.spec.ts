import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { AssessmentNavigationService } from '../../../core/assessment-navigation.service';
import { AssessmentSessionStore } from '../../../core/assessment-session.store';
import { AssessmentService } from '../../../core/assessment.service';
import { AuthService } from '../../../core/auth.service';
import { ToasterService } from '@tao/ui';
import { AuthenticationPage } from './authentication.page';

describe('AuthenticationPage', () => {
  let fixture: ComponentFixture<AuthenticationPage>;
  const signIn = vi.fn();
  const getAssessmentContext = vi.fn();
  const consent = vi.fn();
  const success = vi.fn();
  const error = vi.fn();
  const invitationId = signal<string | null>(null);
  const assessmentStrategyId = signal<string | null>(null);
  const candidateApplicationId = signal<string | null>(null);

  beforeEach(async () => {
    signIn.mockReset();
    getAssessmentContext.mockReset();
    consent.mockClear();
    success.mockClear();
    error.mockClear();
    invitationId.set(null);
    assessmentStrategyId.set(null);
    candidateApplicationId.set(null);
    await TestBed.configureTestingModule({
      imports: [AuthenticationPage],
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => null } } } },
        { provide: AuthService, useValue: { signIn } },
        { provide: AssessmentService, useValue: { getAssessmentContext } },
        {
          provide: AssessmentSessionStore,
          useValue: { invitationId, assessmentStrategyId, candidateApplicationId },
        },
        { provide: AssessmentNavigationService, useValue: { consent } },
        { provide: ToasterService, useValue: { success, error } },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(AuthenticationPage);
  });

  it('renders the sign-in prompt', () => {
    fixture.detectChanges();
    expect((fixture.nativeElement as HTMLElement).textContent).toContain(
      'Please login to continue.',
    );
  });

  it('signs in, loads invitation context, and navigates to consent', async () => {
    signIn.mockResolvedValue(undefined);
    getAssessmentContext.mockReturnValue(
      of({
        assessmentStrategyId: 'strategy-1',
        candidateApplicationId: 'candidate-1',
      }),
    );
    invitationId.set('invite-1');
    const page = fixture.componentInstance as unknown as {
      onLogin: (credentials: { username: string; password: string }) => Promise<void>;
    };
    await page.onLogin({ username: 'candidate@example.test', password: 'secret123' });

    expect(signIn).toHaveBeenCalledWith({
      username: 'candidate@example.test',
      password: 'secret123',
    });
    expect(getAssessmentContext).toHaveBeenCalledWith('invite-1');
    expect(assessmentStrategyId()).toBe('strategy-1');
    expect(candidateApplicationId()).toBe('candidate-1');
    expect(success).toHaveBeenCalledWith('Signed in successfully.');
    expect(consent).toHaveBeenCalledOnce();
  });
});
