import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { catchError, EMPTY, exhaustMap, Observable, Subscription, takeWhile, timer } from 'rxjs';

import { ApiClientService } from '@tao/core';
import {
  candidateScreeningRespose,
  RESUME_IMPORT_FORM_FIELD,
  ResumeImportProgess,
  ResumeScreeningProgress,
} from '../models/resume-import.models';

export interface ResumeProcessingState {
  readonly isUploading: WritableSignal<boolean>;
  readonly isScreening: WritableSignal<boolean>;
  readonly batchId: WritableSignal<string | undefined>;
  readonly importProgress: WritableSignal<ResumeImportProgess | null>;
  readonly screeningProgress: WritableSignal<ResumeScreeningProgress | null>;
  readonly importError: WritableSignal<string | null>;
  readonly screeningError: WritableSignal<string | null>;
}

interface InternalResumeProcessingState extends ResumeProcessingState {
  importSubscription?: Subscription;
  screeningStartSubscription?: Subscription;
  screeningSubscription?: Subscription;
}

/**
 * Resume import API client and background progress coordinator.
 */
@Injectable({ providedIn: 'root' })
export class ResumeImportService {
  private readonly api = inject(ApiClientService);
  private readonly states = new Map<string, InternalResumeProcessingState>();

  stateForCampaign(campaignId: string): ResumeProcessingState {
    let state = this.states.get(campaignId);
    if (!state) {
      state = {
        isUploading: signal(false),
        isScreening: signal(false),
        batchId: signal(undefined),
        importProgress: signal(null),
        screeningProgress: signal(null),
        importError: signal(null),
        screeningError: signal(null),
      };
      this.states.set(campaignId, state);
    }
    return state;
  }

  importResumes(campaignId: string, files: readonly File[]): Observable<string> {
    const formData = new FormData();
    for (const file of files) {
      formData.append(RESUME_IMPORT_FORM_FIELD, file, file.name);
    }
    return this.api.post<string>(`/api/campaigns/${campaignId}/resume-imports`, formData);
  }

  resumeImportProgress(campaignId: string, importId: string): Observable<ResumeImportProgess> {
    return this.api.get<ResumeImportProgess>(
      `/api/campaigns/${campaignId}/resume-imports/${importId}/progress`,
    );
  }

  getResumeScreeningProgress(campaignId: string): Observable<ResumeScreeningProgress> {
    return this.api.get<ResumeScreeningProgress>(
      `/api/campaigns/${campaignId}/resume-screening/progress`,
    );
  }

  candidateScreening(campaignId: string): Observable<candidateScreeningRespose> {
    return this.api.post<candidateScreeningRespose>(
      `/api/campaigns/${campaignId}/resume-screening`,
    );
  }

  startImport(campaignId: string, files: readonly File[]): void {
    const state = this.stateForCampaign(campaignId) as InternalResumeProcessingState;
    if (state.isUploading() || state.isScreening()) {
      return;
    }

    this.resetProgress(state);
    state.isUploading.set(true);
    this.importResumes(campaignId, files)
      .pipe(
        catchError(() => {
          state.isUploading.set(false);
          state.importError.set('The resumes could not be imported. Please try again.');
          return EMPTY;
        }),
      )
      .subscribe((importId) => this.startBackgroundProcessing(campaignId, importId));
  }

  startBackgroundProcessing(campaignId: string, importId: string): void {
    const state = this.stateForCampaign(campaignId) as InternalResumeProcessingState;
    state.batchId.set(importId);
    state.importError.set(null);
    state.screeningError.set(null);
    state.isUploading.set(true);
    this.startImportPolling(campaignId, importId, state);
    this.startScreening(campaignId, state);
  }

  private resetProgress(state: InternalResumeProcessingState): void {
    state.importSubscription?.unsubscribe();
    state.screeningStartSubscription?.unsubscribe();
    state.screeningSubscription?.unsubscribe();
    state.isUploading.set(false);
    state.isScreening.set(false);
    state.batchId.set(undefined);
    state.importProgress.set(null);
    state.screeningProgress.set(null);
    state.importError.set(null);
    state.screeningError.set(null);
  }

  private startImportPolling(
    campaignId: string,
    importId: string,
    state: InternalResumeProcessingState,
  ): void {
    state.importSubscription?.unsubscribe();
    state.importSubscription = timer(0, 3000)
      .pipe(
        exhaustMap(() => this.resumeImportProgress(campaignId, importId)),
        takeWhile((progress) => !progress.isCompleted, true),
        catchError(() => {
          state.isUploading.set(false);
          state.importError.set('Import progress could not be loaded. Please try again.');
          return EMPTY;
        }),
      )
      .subscribe((progress) => {
        state.importProgress.set(progress);
        if (progress.isCompleted) {
          state.isUploading.set(false);
        }
      });
  }

  private startScreening(campaignId: string, state: InternalResumeProcessingState): void {
    state.isScreening.set(true);
    state.screeningProgress.set(null);
    state.screeningError.set(null);
    state.screeningStartSubscription?.unsubscribe();
    state.screeningSubscription?.unsubscribe();

    state.screeningStartSubscription = this.candidateScreening(campaignId)
      .pipe(
        catchError(() => {
          state.isScreening.set(false);
          state.screeningError.set('Resume screening could not be started.');
          return EMPTY;
        }),
      )
      .subscribe(() => this.startScreeningPolling(campaignId, state));
  }

  private startScreeningPolling(campaignId: string, state: InternalResumeProcessingState): void {
    state.screeningSubscription = timer(0, 3000)
      .pipe(
        exhaustMap(() => this.getResumeScreeningProgress(campaignId)),
        takeWhile((progress) => !progress.isCompleted, true),
        catchError(() => {
          state.isScreening.set(false);
          state.screeningError.set('Screening progress could not be loaded.');
          return EMPTY;
        }),
      )
      .subscribe((progress) => {
        state.screeningProgress.set(progress);
        if (progress.isCompleted) {
          state.isScreening.set(false);
        }
      });
  }
}
