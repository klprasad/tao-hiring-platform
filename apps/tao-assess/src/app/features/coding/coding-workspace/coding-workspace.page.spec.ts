import { beforeEach, describe, expect, it } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AssessmentSessionStore } from '../../../core/assessment-session.store';
import { AssessmentRoundType } from '../../../models/assessment-session.model';
import { CodingWorkspacePage } from './coding-workspace.page';

describe('CodingWorkspacePage', () => {
  let fixture: ComponentFixture<CodingWorkspacePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CodingWorkspacePage],
      providers: [
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

    fixture.detectChanges();
    const selector = fixture.nativeElement.querySelector('#editor-language') as HTMLSelectElement;
    expect(selector.options.length).toBeGreaterThanOrEqual(15);
    expect(Array.from(selector.options).map((option) => option.textContent?.trim())).toContain(
      'Python',
    );

    fixture.componentInstance.selectLanguage('python');
    fixture.detectChanges();
    expect(fixture.componentInstance.languageConfig().monacoId).toBe('python');
    expect(selector.value).toBe('python');
  });
});
