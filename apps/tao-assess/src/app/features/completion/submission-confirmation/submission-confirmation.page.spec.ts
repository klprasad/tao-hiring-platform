import { beforeEach, describe, expect, it } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SubmissionConfirmationPage } from './submission-confirmation.page';

describe('SubmissionConfirmationPage', () => {
  let fixture: ComponentFixture<SubmissionConfirmationPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubmissionConfirmationPage],
    }).compileComponents();
    fixture = TestBed.createComponent(SubmissionConfirmationPage);
    fixture.detectChanges();
  });

  it('renders the successful submission confirmation', () => {
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('submitted');
  });
});
