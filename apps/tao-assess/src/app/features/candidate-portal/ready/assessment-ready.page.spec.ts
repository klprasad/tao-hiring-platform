import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AssessmentNavigationService } from '../../../core/assessment-navigation.service';
import { AssessmentSessionStore } from '../../../core/assessment-session.store';
import { AssessmentService } from '../../../core/assessment.service';
import { AssessmentReadyPage } from './assessment-ready.page';

describe('AssessmentReadyPage', () => {
  let fixture: ComponentFixture<AssessmentReadyPage>;
  const start = vi.fn();
  const startAssessment = vi.fn();
  const sessionWelcome = vi.fn();
  const browserCheck = vi.fn();
  const error = vi.fn();

  beforeEach(async () => {
    start.mockClear();
    startAssessment.mockReset();
    sessionWelcome.mockClear();
    browserCheck.mockClear();
    error.mockClear();
    await TestBed.configureTestingModule({
      imports: [AssessmentReadyPage],
      providers: [
        {
          provide: AssessmentSessionStore,
          useValue: { landing: () => null, assessmentSessionId: () => 'session-1', start },
        },
        { provide: AssessmentService, useValue: { startAssessment } },
        { provide: AssessmentNavigationService, useValue: { sessionWelcome, browserCheck } },
        { provide: (await import('@tao/ui')).ToasterService, useValue: { error } },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(AssessmentReadyPage);
  });

  it('starts the session and opens the welcome route after success', () => {
    startAssessment.mockReturnValue(of({}));
    fixture.componentInstance.start();

    expect(start).toHaveBeenCalledOnce();
    expect(startAssessment).toHaveBeenCalledWith('session-1');
    expect(sessionWelcome).toHaveBeenCalledTimes(2);
  });

  it('ignores repeated starts while a request is pending', () => {
    fixture.componentInstance.starting = true;
    fixture.componentInstance.start();

    expect(startAssessment).not.toHaveBeenCalled();
    expect(start).not.toHaveBeenCalled();
  });

  it('returns to the browser check', () => {
    fixture.componentInstance.back();

    expect(browserCheck).toHaveBeenCalledOnce();
  });
});
