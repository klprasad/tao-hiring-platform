import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { AssessmentNavigationService } from '../../../core/assessment-navigation.service';
import { AssessmentSessionStore } from '../../../core/assessment-session.store';
import { AssessmentService } from '../../../core/assessment.service';
import { ToasterService } from '@tao/ui';
import { WelcomePage } from './welcome.page';

describe('WelcomePage', () => {
  let fixture: ComponentFixture<WelcomePage>;
  const workflow = { assessmentSessionId: 'session-1', status: 'InProgress' } as never;
  const setAssessmentWorkflow = vi.fn();
  const getAssessmentWorkflow = vi.fn();
  const question = vi.fn();
  const error = vi.fn();

  beforeEach(async () => {
    setAssessmentWorkflow.mockClear();
    getAssessmentWorkflow.mockReset();
    question.mockClear();
    error.mockClear();
    await TestBed.configureTestingModule({
      imports: [WelcomePage],
      providers: [
        {
          provide: AssessmentSessionStore,
          useValue: { assessmentSessionId: () => 'session-1', setAssessmentWorkflow },
        },
        { provide: AssessmentService, useValue: { getAssessmentWorkflow } },
        { provide: AssessmentNavigationService, useValue: { question } },
        { provide: ToasterService, useValue: { error } },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(WelcomePage);
  });

  it('refreshes workflow state before navigating to the first question', () => {
    getAssessmentWorkflow.mockReturnValue(of(workflow));
    fixture.componentInstance.begin();

    expect(getAssessmentWorkflow).toHaveBeenCalledWith('session-1');
    expect(setAssessmentWorkflow).toHaveBeenCalledWith(workflow);
    expect(question).toHaveBeenCalledOnce();
  });

  it('reports an unavailable session without making a request', async () => {
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [WelcomePage],
      providers: [
        { provide: AssessmentSessionStore, useValue: { assessmentSessionId: () => '' } },
        { provide: AssessmentService, useValue: { getAssessmentWorkflow } },
        { provide: AssessmentNavigationService, useValue: { question } },
        { provide: ToasterService, useValue: { error } },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(WelcomePage);
    fixture.componentInstance.begin();

    expect(error).toHaveBeenCalledWith('Assessment session is not available.');
    expect(question).not.toHaveBeenCalled();
  });

  it('reports workflow refresh failures', () => {
    getAssessmentWorkflow.mockReturnValue(throwError(() => new Error('offline')));
    fixture.componentInstance.begin();

    expect(error).toHaveBeenCalledWith('Failed to refresh assessment workflow');
    expect(question).not.toHaveBeenCalled();
  });
});
