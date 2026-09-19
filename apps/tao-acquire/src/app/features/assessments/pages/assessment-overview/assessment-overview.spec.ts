import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AssessmentOverview } from './assessment-overview';

describe('AssessmentOverview', () => {
  let component: AssessmentOverview;
  let fixture: ComponentFixture<AssessmentOverview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssessmentOverview],
    }).compileComponents();

    fixture = TestBed.createComponent(AssessmentOverview);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
