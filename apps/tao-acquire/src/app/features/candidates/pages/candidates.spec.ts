import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { CandidatesService } from '../data-access/candidates.service';
import { Candidates } from './candidates';

describe('Candidates', () => {
  let fixture: ComponentFixture<Candidates>;
  let getCandidates: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    getCandidates = vi.fn().mockReturnValue(
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
    );
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
          useValue: { getCandidates },
        },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(Candidates);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders candidate activity content', () => {
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Recent candidate activity');
    expect(fixture.nativeElement.textContent).toContain('Jordan Mitchell');
  });

  it('loads candidates once', () => {
    fixture.detectChanges();

    expect(getCandidates).toHaveBeenCalledTimes(1);
  });
});
