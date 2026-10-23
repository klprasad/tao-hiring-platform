import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AssessmentQuestionResult } from '../../models/assessment-result.models';
import { AssessmentQuestionResultComponent } from './assessment-question-result';

describe('AssessmentQuestionResultComponent', () => {
  let fixture: ComponentFixture<AssessmentQuestionResultComponent>;
  const host = (): HTMLElement => fixture.nativeElement as HTMLElement;
  const result: AssessmentQuestionResult = {
    questionId: 'question-1',
    order: 1,
    primaryQuestion: '# Heading\nUse **care** and `code`.',
    status: 'Completed',
    score: 85,
    confidence: 90,
    strengths: [],
    gaps: [],
    evidence: [],
    competencies: [],
    hasConversation: true,
    hasCandidateCode: false,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssessmentQuestionResultComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(AssessmentQuestionResultComponent);
    fixture.componentRef.setInput('result', result);
    fixture.componentRef.setInput('roundType', 'TechnicalDiscussion');
    fixture.detectChanges();
  });

  it('formats question markdown and escapes raw HTML', () => {
    fixture.componentRef.setInput('result', {
      ...result,
      primaryQuestion: '# Heading\n<script>alert(1)</script>',
    });
    expect(fixture.componentInstance.formattedQuestion()).toContain('<h1>Heading</h1>');
    expect(fixture.componentInstance.formattedQuestion()).not.toContain('<script>');
  });

  it('selects available responses based on round type and provides score labels', () => {
    expect(fixture.componentInstance.canViewResponse()).toBe(true);
    expect(fixture.componentInstance.formatScore(null)).toBe('Not scored');
    expect(fixture.componentInstance.formatScore(85)).toBe('85%');

    fixture.componentRef.setInput('roundType', 'Coding');
    expect(fixture.componentInstance.canViewResponse()).toBe(false);
  });

  it('emits a request when the available response action is clicked', () => {
    const requested = vi.fn();
    fixture.componentInstance.responseRequested.subscribe(requested);
    host().querySelector<HTMLButtonElement>('button')?.click();
    expect(requested).toHaveBeenCalledOnce();
  });
});
