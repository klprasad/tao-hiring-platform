import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AssessmentNavigationService } from '../../../core/assessment-navigation.service';
import { AssessmentSessionStore } from '../../../core/assessment-session.store';
import { FinalReviewPage } from './final-review.page';

describe('FinalReviewPage', () => {
  let fixture: ComponentFixture<FinalReviewPage>;
  const submit = vi.fn();
  const submitted = vi.fn();

  beforeEach(async () => {
    submit.mockClear();
    submitted.mockClear();
    await TestBed.configureTestingModule({
      imports: [FinalReviewPage],
      providers: [
        { provide: AssessmentSessionStore, useValue: { submit } },
        { provide: AssessmentNavigationService, useValue: { submitted } },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(FinalReviewPage);
  });

  it('submits the session before navigating to confirmation', () => {
    fixture.componentInstance.submit();

    expect(submit).toHaveBeenCalledOnce();
    expect(submitted).toHaveBeenCalledOnce();
  });
});
