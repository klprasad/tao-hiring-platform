import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { AssessmentResultService } from '../../data-access/assessment-results.service';
import { AssessmentResultOverview } from './assessment-result-overview';

describe('AssessmentResultOverview', () => {
  let component: AssessmentResultOverview;
  let fixture: ComponentFixture<AssessmentResultOverview>;

  const serviceMock = {
    getCandidatesResults: vi.fn().mockReturnValue(of([])),
    getAssessmentSummary: vi.fn(),
    getAssessmentRoundResults: vi.fn(),
    getQuestionResults: vi.fn(),
    getCodingQuestionResponse: vi.fn(),
    getQuestionResponse: vi.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssessmentResultOverview],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => 'campaign-1' } } },
        },
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
