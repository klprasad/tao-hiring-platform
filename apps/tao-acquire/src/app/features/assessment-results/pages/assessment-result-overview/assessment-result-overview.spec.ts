import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AssessmentResultOverview } from './assessment-result-overview';

describe('AssessmentResultOverview', () => {
  let component: AssessmentResultOverview;
  let fixture: ComponentFixture<AssessmentResultOverview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssessmentResultOverview],
    }).compileComponents();

    fixture = TestBed.createComponent(AssessmentResultOverview);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
