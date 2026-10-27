import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AssessmentService } from '../../../core/assessment.service';
import { AssessmentSessionStore } from '../../../core/assessment-session.store';
import { AssessmentRoundType } from '../../../models/assessment-session.model';
import { CodingWorkspacePage } from './coding-workspace.page';

describe('CodingWorkspacePage', () => {
  let fixture: ComponentFixture<CodingWorkspacePage>;
  const updateCodingLanguage = vi.fn(() => of(undefined));

  beforeEach(async () => {
    updateCodingLanguage.mockClear();
    await TestBed.configureTestingModule({
      imports: [CodingWorkspacePage],
      providers: [
        { provide: AssessmentService, useValue: { updateCodingLanguage } },
        { provide: AssessmentSessionStore, useValue: { currentQuestionNumber: () => 1 } },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(CodingWorkspacePage);
    fixture.componentRef.setInput('question', {
      questionId: 'question-1',
      questionOrder: 1,
      primaryQuestion: '# Task\nReturn `value` safely.',
      roundType: AssessmentRoundType.Coding,
      roundId: 'round-1',
      roundOrder: 1,
      roundDurationInMinutes: 30,
      isFollowUpQuestion: false,
      competencies: [],
      isNewRound: false,
      assessmentCompleted: false,
    });
  });

  it('renders major language options and maps the selected language', () => {
    expect(fixture.componentInstance.formattedQuestion()).toContain('<h1>Task</h1>');
    expect(fixture.componentInstance.formattedQuestion()).toContain('<code>value</code>');
    expect(fixture.componentInstance.language()).toBeNull();

    fixture.detectChanges();
    const selector = fixture.nativeElement.querySelector('#editor-language') as HTMLSelectElement;
    expect(selector.options.length).toBeGreaterThanOrEqual(15);
    expect(selector.value).toBe('');
    expect(selector.options[0].textContent?.trim()).toBe('Select language');
    const continueButton = fixture.nativeElement.querySelectorAll(
      'tao-button button',
    )[1] as HTMLButtonElement;
    expect(continueButton.disabled).toBe(true);
    expect(Array.from(selector.options).map((option) => option.textContent?.trim())).toContain(
      'Python',
    );

    selector.value = 'python';
    selector.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(fixture.componentInstance.languageConfig()?.monacoId).toBe('python');
    expect(selector.value).toBe('python');
    expect(continueButton.disabled).toBe(false);
    expect(updateCodingLanguage).toHaveBeenCalledWith('question-1', { language: 'python' });
  });

  it('resets the language selection when the question changes', () => {
    fixture.detectChanges();
    fixture.componentInstance.selectLanguage('python');
    expect(fixture.componentInstance.language()).toBe('python');

    fixture.componentRef.setInput('question', {
      questionId: 'question-2',
      questionOrder: 2,
      primaryQuestion: 'Second task',
      roundType: AssessmentRoundType.Coding,
      roundId: 'round-1',
      roundOrder: 1,
      roundDurationInMinutes: 30,
      isFollowUpQuestion: false,
      competencies: [],
      isNewRound: false,
      assessmentCompleted: false,
    });
    fixture.detectChanges();

    expect(fixture.componentInstance.language()).toBeNull();
    expect(fixture.componentInstance.languageConfig()).toBeNull();
  });
});
