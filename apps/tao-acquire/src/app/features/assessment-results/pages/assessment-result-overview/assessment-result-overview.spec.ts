import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { AssessmentResultService } from '../../data-access/assessment-results.service';
import { AssessmentResultOverview } from './assessment-result-overview';

describe('AssessmentResultOverview', () => {
  let component: AssessmentResultOverview;
  let fixture: ComponentFixture<AssessmentResultOverview>;

  const serviceMock = {
    getCandidatesResults: jasmine.createSpy().and.returnValue(of([])),
    getAssessmentSummary: jasmine.createSpy(),
    getAssessmentRoundResults: jasmine.createSpy(),
    getQuestionResults: jasmine.createSpy(),
    getCodingQuestionResponse: jasmine.createSpy(),
    getQuestionResponse: jasmine.createSpy(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssessmentResultOverview],
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => 'campaign-1' } } } },
        { provide: AssessmentResultService, useValue: serviceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AssessmentResultOverview);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
