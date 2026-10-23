import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  AssessmentQuestionResult,
  AssessmentRoundResult,
} from '../../models/assessment-result.models';
import { AssessmentRoundResultsComponent } from './assessment-round-results';

describe('AssessmentRoundResultsComponent', () => {
  let fixture: ComponentFixture<AssessmentRoundResultsComponent>;
  const question: AssessmentQuestionResult = {
    questionId: 'q-1',
    order: 1,
    primaryQuestion: 'Question',
    status: 'Completed',
    score: 75,
    confidence: 80,
    strengths: [],
    gaps: [],
    evidence: [],
    competencies: [],
    hasConversation: true,
    hasCandidateCode: false,
  };
  const result: AssessmentRoundResult = {
    assessmentSessionId: 'session-1',
    roundId: 'round-1',
    order: 1,
    roundType: 'TechnicalDiscussion',
    score: 75,
    confidence: 80,
    strengths: [],
    gaps: [],
    evidence: [],
    questions: [question, { ...question, questionId: 'q-2', status: 'SKIPPED', score: null }],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssessmentRoundResultsComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(AssessmentRoundResultsComponent);
    fixture.componentRef.setInput('result', result);
    fixture.detectChanges();
  });

  it('counts answered and skipped questions and formats scores', () => {
    expect(fixture.componentInstance.completedCount()).toBe(1);
    expect(fixture.componentInstance.skippedCount()).toBe(1);
    expect(fixture.componentInstance.scoreLabel(null)).toBe('Not scored');
    expect(fixture.componentInstance.scoreLabel(75)).toBe('75%');
  });

  it('emits the question selected for inspection', () => {
    const selected = vi.fn();
    fixture.componentInstance.questionSelected.subscribe(selected);
    fixture.componentInstance.selectQuestion(question);
    expect(selected).toHaveBeenCalledWith(question);
  });
});
