import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AssessmentsPage } from './assessments.page';

describe('AssessmentsPage', () => {
  let fixture: ComponentFixture<AssessmentsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [AssessmentsPage] }).compileComponents();
    fixture = TestBed.createComponent(AssessmentsPage);
    fixture.detectChanges();
  });

  it('renders assessment progress content', () => {
    expect(fixture.nativeElement.textContent).toContain('Assessment activity');
    expect(fixture.nativeElement.textContent).toContain('Backend Engineer assessment');
  });
});
