import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AssessmentNavigationService } from '../../../core/assessment-navigation.service';
import { AssessmentService } from '../../../core/assessment.service';
import { AssessmentSessionStore } from '../../../core/assessment-session.store';
import { AssessmentRoundType } from '../../../models/assessment-session.model';
import { ToasterService } from '@tao/ui';
import { QuestionPage } from './question.page';

describe('QuestionPage', () => {
  let fixture: ComponentFixture<QuestionPage>;
  let store: AssessmentSessionStore;
  const saveCandidateResponse = vi.fn();
  const finalReview = vi.fn();
  const error = vi.fn();

  beforeEach(async () => {
    saveCandidateResponse.mockReset();
    finalReview.mockClear();
    error.mockClear();
    await TestBed.configureTestingModule({
      imports: [QuestionPage],
      providers: [
        { provide: AssessmentService, useValue: { saveCandidateResponse } },
        { provide: AssessmentNavigationService, useValue: { finalReview } },
        { provide: ToasterService, useValue: { error } },
      ],
    }).compileComponents();
    store = TestBed.inject(AssessmentSessionStore);
    fixture = TestBed.createComponent(QuestionPage);
    store.setCurrentQuestion({
      questionId: 'question-1',
      questionOrder: 1,
      primaryQuestion: 'Explain the design',
      roundType: AssessmentRoundType.TechnicalDiscussion,
      roundId: 'round-1',
      roundOrder: 1,
      roundDurationInMinutes: 20,
      isFollowUpQuestion: false,
      competencies: [],
      isNewRound: false,
      assessmentCompleted: false,
    });
  });

  it('trims and saves a response, then navigates after completion', () => {
    saveCandidateResponse.mockReturnValue(of({ assessmentCompleted: true }));
    fixture.componentInstance.onResponse('  Use a queue  ');
    fixture.componentInstance.next();

    expect(saveCandidateResponse).toHaveBeenCalledWith('question-1', { response: 'Use a queue' });
    expect(store.submitted()).toBe(true);
    expect(finalReview).toHaveBeenCalledOnce();
  });

  it('does not submit an empty response', () => {
    fixture.componentInstance.onResponse('   ');
    fixture.componentInstance.next();

    expect(saveCandidateResponse).not.toHaveBeenCalled();
  });
});
