import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { CandidatesService } from '../data-access/candidates.service';
import { Candidates } from './candidates';

describe('Candidates', () => {
  let fixture: ComponentFixture<Candidates>;
  let getCandidates: ReturnType<typeof vi.fn>;
  let getResumeScreeningProgress: ReturnType<typeof vi.fn>;

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
    getResumeScreeningProgress = vi.fn().mockReturnValue(
      of({
        campaignId: 'campaign-1',
        totalCandidates: 0,
        queuedCandidates: 0,
        processingCandidates: 0,
        completedCandidates: 1,
        failedCandidates: 0,
        processedCandidates: 1,
        pendingSchedulingCandidates: 0,
        activeImportBatches: 0,
        totalBatches: 1,
        queuedBatches: 0,
        processingBatches: 0,
        completedBatches: 1,
        partiallyCompletedBatches: 0,
        failedBatches: 0,
        isCompleted: true,
        batches: [],
      }),
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
          useValue: {
            getCandidates,
            getResumeScreeningProgress,
          },
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

  it('refreshes and displays progress until total and queued candidates are zero', () => {
    const progress = (totalCandidates: number, queuedCandidates: number) => ({
      campaignId: 'campaign-1',
      totalCandidates,
      queuedCandidates,
      processingCandidates: 1,
      completedCandidates: 2,
      failedCandidates: 0,
      processedCandidates: 2,
      pendingSchedulingCandidates: 0,
      activeImportBatches: 1,
      totalBatches: 1,
      queuedBatches: 0,
      processingBatches: 1,
      completedBatches: 0,
      partiallyCompletedBatches: 0,
      failedBatches: 0,
      isCompleted: false,
      batches: [],
    });
    getResumeScreeningProgress
      .mockReturnValueOnce(of(progress(5, 3)))
      .mockReturnValueOnce(of(progress(2, 0)))
      .mockReturnValueOnce(of(progress(0, 0)));
    vi.useFakeTimers();

    fixture.detectChanges();
    expect(getCandidates).toHaveBeenCalledTimes(1);
    expect(getResumeScreeningProgress).toHaveBeenCalledTimes(1);
    expect(fixture.nativeElement.textContent).toContain('Candidates: 5');

    vi.advanceTimersByTime(3000);
    fixture.detectChanges();
    expect(getResumeScreeningProgress).toHaveBeenCalledTimes(2);
    expect(fixture.nativeElement.textContent).toContain('Candidates: 2');

    vi.advanceTimersByTime(3000);
    fixture.detectChanges();
    expect(getResumeScreeningProgress).toHaveBeenCalledTimes(3);
    expect(fixture.nativeElement.textContent).toContain('Screening complete.');

    vi.advanceTimersByTime(6000);
    expect(getResumeScreeningProgress).toHaveBeenCalledTimes(3);
  });
});
