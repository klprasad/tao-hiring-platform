import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Assessments } from './assessments';

describe('Assessments', () => {
  let fixture: ComponentFixture<Assessments>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Assessments] }).compileComponents();
    fixture = TestBed.createComponent(Assessments);
    fixture.detectChanges();
  });

  it('renders assessment progress content', () => {
    expect(fixture.nativeElement.textContent).toContain('Assessment activity');
    expect(fixture.nativeElement.textContent).toContain('Backend Engineer assessment');
  });
});
