import { beforeEach, describe, expect, it } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { CandidatesService } from '../data-access/candidates.service';
import { Candidates } from './candidates';

describe('Candidates', () => {
  let fixture: ComponentFixture<Candidates>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Candidates],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: { get: () => 'campaign-1' },
              queryParamMap: { get: () => null },
            },
            parent: null,
          },
        },
        {
          provide: CandidatesService,
          useValue: {
            getCandidates: () =>
              of([
                {
                  id: 'candidate-1',
                  candidateName: 'Jordan Mitchell',
                  email: 'jordan@example.test',
                  phone: '',
                  linkedInUrl: '',
                  currentCompany: null,
                  currentLocation: 'Remote',
                  overallMatchPercentage: 85,
                  status: 'Recommended',
                  resumeUploadedOn: '2026-10-01',
                  lastScreenedOn: null,
                },
              ]),
          },
        },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(Candidates);
    fixture.detectChanges();
  });

  it('renders candidate activity content', () => {
    expect(fixture.nativeElement.textContent).toContain('Recent candidate activity');
    expect(fixture.nativeElement.textContent).toContain('Jordan Mitchell');
  });
});
