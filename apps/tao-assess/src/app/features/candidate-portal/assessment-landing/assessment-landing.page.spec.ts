import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { of } from 'rxjs';
import { AssessmentNavigationService } from '../../../core/assessment-navigation.service';
import { AssessmentService } from '../../../core/assessment.service';
import { AssessmentSessionStore } from '../../../core/assessment-session.store';
import { ToasterService } from '@tao/ui';
import { AssessmentLandingPage } from './assessment-landing.page';

describe('AssessmentLandingPage', () => {
  let fixture: ComponentFixture<AssessmentLandingPage>;
  const assessmentSession = signal<unknown>(null);
  const createAssessmentSession = vi.fn();
  const ready = vi.fn();
  const error = vi.fn();
  const accessToken = signal('');
  const sessionId = signal('');

  beforeEach(async () => {
    assessmentSession.set(null);
    createAssessmentSession.mockReset();
    ready.mockClear();
    error.mockClear();
    accessToken.set('');
    sessionId.set('');
    await TestBed.configureTestingModule({
      imports: [AssessmentLandingPage],
      providers: [
        {
          provide: AssessmentSessionStore,
          useValue: {
            candidateApplicationId: () => 'candidate-1',
            assessmentStrategyId: () => 'strategy-1',
            landing: () => null,
            assessmentSession,
          },
        },
        { provide: AssessmentService, useValue: { createAssessmentSession } },
        { provide: AssessmentNavigationService, useValue: { accessToken, sessionId, ready } },
        { provide: ToasterService, useValue: { error } },
      ],
    }).compileComponents();
  });

  it('creates a session using the candidate and strategy identifiers', () => {
    createAssessmentSession.mockReturnValue(
      of({
        id: 'session-1',
        strategySnapshot: { value: '{"AssessmentName":"Role"}' },
        rounds: [],
      }),
    );
    fixture = TestBed.createComponent(AssessmentLandingPage);

    expect(createAssessmentSession).toHaveBeenCalledWith({
      candidateApplicationId: 'candidate-1',
      assessmentStrategyId: 'strategy-1',
    });
    expect(accessToken()).toBe('session-1');
    expect(sessionId()).toBe('session-1');
    expect((assessmentSession() as { id: string } | null)?.id).toBe('session-1');
  });

  it('continues to the ready screen', () => {
    createAssessmentSession.mockReturnValue(
      of({
        id: 'session-1',
        strategySnapshot: { value: '{"AssessmentName":"Role"}' },
        rounds: [],
      }),
    );
    fixture = TestBed.createComponent(AssessmentLandingPage);
    fixture.componentInstance.continue();

    expect(ready).toHaveBeenCalledOnce();
  });
});
