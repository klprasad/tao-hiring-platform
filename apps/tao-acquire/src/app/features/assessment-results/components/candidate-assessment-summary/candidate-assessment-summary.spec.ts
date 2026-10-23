import { beforeEach, describe, expect, it } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AssessmentCandidate, AssessmentSummary } from '../../models/assessment-result.models';
import { CandidateAssessmentSummaryComponent } from './candidate-assessment-summary';

describe('CandidateAssessmentSummaryComponent', () => {
  let fixture: ComponentFixture<CandidateAssessmentSummaryComponent>;
  const candidate: AssessmentCandidate = {
    candidateApplicationId: 'candidate-1',
    candidateName: 'Alex Morgan',
    email: 'alex@example.test',
    phone: '',
    linkedInUrl: null,
    currentCompany: null,
    currentLocation: 'Remote',
    assessmentSessionId: 'session-1',
    completedOn: null,
  };
  const summary: AssessmentSummary = {
    assessmentSessionId: 'session-1',
    assessmentResultId: 'result-1',
    overallScore: 80,
    overallConfidence: 90,
    recommendation: 'Recommended',
    executiveSummary: 'Strong candidate.',
    competencies: [],
    rounds: [],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CandidateAssessmentSummaryComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(CandidateAssessmentSummaryComponent);
    fixture.componentRef.setInput('candidate', candidate);
    fixture.componentRef.setInput('summary', summary);
    fixture.detectChanges();
  });

  it('maps recommendation labels and styles', () => {
    const component = fixture.componentInstance;
    expect(component.recommendationLabel('NotRecommended')).toBe('Not recommended');
    expect(component.recommendationClass('NotRecommended')).toBe('is-negative');
    expect(component.recommendationClass('NeedsReview')).toBe('is-neutral');
  });

  it('renders candidate summary details and the pending status', () => {
    const content = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(content).toContain('Alex Morgan');
    expect(content).toContain('Recommended');
    expect(content).toContain('Pending');
    expect(content).toContain('Strong candidate.');
  });
});
