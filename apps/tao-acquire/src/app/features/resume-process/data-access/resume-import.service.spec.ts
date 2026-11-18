import { TestBed } from '@angular/core/testing';
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { NEVER, of } from 'rxjs';

import { ApiClientService } from '@tao/core';
import { ResumeImportService } from './resume-import.service';

describe('ResumeImportService', () => {
  let service: ResumeImportService;
  let api: { get: ReturnType<typeof vi.fn>; post: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    api = {
      get: vi.fn((url: string) =>
        url.includes('/resume-imports/')
          ? NEVER
          : of({
              campaignId: 'campaign-1',
              totalCandidates: 1,
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
      ),
      post: vi.fn((url: string) =>
        url.endsWith('/resume-screening')
          ? of({
              totalCandidates: 1,
              candidatesAlreadyScreened: 0,
              candidatesScreened: 0,
              recommendedCandidates: 0,
              notRecommendedCandidates: 0,
              failedCandidates: 0,
            })
          : of('batch-1'),
      ),
    };

    TestBed.configureTestingModule({
      providers: [ResumeImportService, { provide: ApiClientService, useValue: api }],
    });
    service = TestBed.inject(ResumeImportService);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('starts screening while import processing is still active and retains campaign state', () => {
    vi.useFakeTimers();
    const files = [new File(['resume'], 'resume.pdf', { type: 'application/pdf' })];

    service.startImport('campaign-1', files);

    expect(api.post).toHaveBeenCalledWith(
      '/api/campaigns/campaign-1/resume-imports',
      expect.any(FormData),
    );
    expect(api.post).toHaveBeenCalledWith('/api/campaigns/campaign-1/resume-screening');

    const state = service.stateForCampaign('campaign-1');
    expect(service.stateForCampaign('campaign-1')).toBe(state);
    expect(state.batchId()).toBe('batch-1');
    expect(state.isUploading()).toBe(true);
    expect(state.isScreening()).toBe(true);

    vi.advanceTimersByTime(0);

    expect(api.get).toHaveBeenCalledWith(
      '/api/campaigns/campaign-1/resume-imports/batch-1/progress',
    );
    expect(api.get).toHaveBeenCalledWith('/api/campaigns/campaign-1/resume-screening/progress');
    expect(state.isUploading()).toBe(true);
    expect(state.isScreening()).toBe(false);
    expect(state.screeningProgress()?.isCompleted).toBe(true);
    expect(service.stateForCampaign('campaign-1').screeningProgress()).toBe(
      state.screeningProgress(),
    );
  });
});
