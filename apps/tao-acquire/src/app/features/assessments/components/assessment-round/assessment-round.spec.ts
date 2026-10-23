import { beforeEach, describe, expect, it } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AssessmentRound } from './assessment-round';

describe('AssessmentRound', () => {
  let component: AssessmentRound;
  let fixture: ComponentFixture<AssessmentRound>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssessmentRound],
    }).compileComponents();

    fixture = TestBed.createComponent(AssessmentRound);
    fixture.componentRef.setInput('round', {
      order: 1,
      type: 'Technical Discussion',
      difficulty: 'Medium',
      durationInMinutes: 30,
      targetQuestionCount: 3,
      competencies: [],
    });
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
