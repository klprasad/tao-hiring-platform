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
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
