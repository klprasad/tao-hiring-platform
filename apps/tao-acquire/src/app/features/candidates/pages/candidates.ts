import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import {
  catchError,
  concat,
  EMPTY,
  exhaustMap,
  forkJoin,
  interval,
  of,
  takeWhile,
  tap,
} from 'rxjs';

import { TaoButtonComponent, TaoCardComponent, TaoPageHeaderComponent } from '@tao/ui';

import { CandidateDto, ResumeScreeningProgress } from '../models/candidates.mode';
import { CandidatesService } from '../data-access/candidates.service';

type CandidateFilter = 'all' | 'recommended' | 'rejected';

@Component({
  selector: 'tao-candidates',
  imports: [TaoCardComponent, TaoPageHeaderComponent, TaoButtonComponent],
  templateUrl: './candidates.html',
  styleUrl: './candidates.scss',
})
export class Candidates implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly service = inject(CandidatesService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  // ---------------------------------------------------------------------------
  // State
  // ---------------------------------------------------------------------------

  readonly candidates = signal<CandidateDto[]>([]);
  readonly screeningProgress = signal<ResumeScreeningProgress | null>(null);
  readonly errorMessage = signal<string>('');

  readonly selectedFilter = signal<CandidateFilter>('all');

  readonly campaignId = this.resolveCampaignId();

  // ---------------------------------------------------------------------------
  // Computed values
  // ---------------------------------------------------------------------------

  readonly recommendedCandidates = computed(() =>
    this.candidates().filter(
      (candidate) =>
        candidate.status === 'Recommended' ||
        candidate.status === 'Shortlisted' ||
        candidate.overallMatchPercentage >= 70,
    ),
  );

  readonly rejectedCandidates = computed(() =>
    this.candidates().filter((candidate) => candidate.status === 'Rejected'),
  );

  readonly isScreening = computed(() => {
    const progress = this.screeningProgress();
    return !progress || progress.totalCandidates !== 0 || progress.queuedCandidates !== 0;
  });

  readonly screeningStatusMessage = computed(() => {
    const progress = this.screeningProgress();

    if (!progress) {
      return 'Loading screening progress...';
    }

    if (!this.isScreening()) {
      return 'Screening complete.';
    }

    return `Candidates: ${progress.totalCandidates} · Queued: ${progress.queuedCandidates} · Processing: ${progress.processingCandidates} · Completed: ${progress.completedCandidates} · Failed: ${progress.failedCandidates}`;
  });

  readonly filteredCandidates = computed(() => {
    switch (this.selectedFilter()) {
      case 'recommended':
        return this.recommendedCandidates();

      case 'rejected':
        return this.rejectedCandidates();

      case 'all':
      default:
        return this.candidates();
    }
  });

  readonly recommendedPercentage = computed(() => {
    const total = this.candidates().length;

    if (total === 0) {
      return 0;
    }

    return Math.round((this.recommendedCandidates().length / total) * 100);
  });

  readonly selectedFilterTitle = computed(() => {
    switch (this.selectedFilter()) {
      case 'recommended':
        return 'Recommended candidates';

      case 'rejected':
        return 'Not recommended candidates';

      case 'all':
      default:
        return 'Recent candidate activity';
    }
  });

  // ---------------------------------------------------------------------------
  // Lifecycle
  // ---------------------------------------------------------------------------

  ngOnInit(): void {
    if (!this.campaignId) {
      this.errorMessage.set('Campaign ID is missing.');
      return;
    }

    this.loadCandidates();
  }

  // ---------------------------------------------------------------------------
  // Actions
  // ---------------------------------------------------------------------------

  selectFilter(filter: CandidateFilter): void {
    this.selectedFilter.set(filter);
  }

  // ---------------------------------------------------------------------------
  // Template helpers
  // ---------------------------------------------------------------------------

  getInitials(name: string): string {
    return name
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((part) => part.charAt(0))
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }

  formatCandidateDate(candidate: CandidateDto): string {
    const dateValue = candidate.lastScreenedOn ?? candidate.resumeUploadedOn;

    if (!dateValue) {
      return '-';
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return '-';
    }

    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
    }).format(date);
  }

  // ---------------------------------------------------------------------------
  // API
  // ---------------------------------------------------------------------------

  private loadCandidates(): void {
    this.errorMessage.set('');

    concat(of(null), interval(3000))
      .pipe(
        exhaustMap(() =>
          forkJoin({
            candidates: this.service.getCandidates(this.campaignId).pipe(
              catchError(() => {
                this.errorMessage.set('Unable to refresh screening results.');
                return of(null);
              }),
            ),
            progress: this.service.getResumeScreeningProgress(this.campaignId).pipe(
              catchError(() => {
                this.errorMessage.set('Unable to refresh screening progress.');
                return of(null);
              }),
            ),
          }),
        ),
        tap(({ candidates, progress }) => {
          if (candidates) {
            this.candidates.set(candidates);
          }
          if (progress) {
            this.screeningProgress.set(progress);
          }
        }),
        takeWhile(() => this.isScreening(), true),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  // ---------------------------------------------------------------------------
  // Route
  // ---------------------------------------------------------------------------

  private resolveCampaignId(): string {
    return (
      this.route.snapshot.paramMap.get('campaignId') ??
      this.route.parent?.snapshot.paramMap.get('campaignId') ??
      this.route.snapshot.queryParamMap.get('campaignId') ??
      ''
    );
  }
  sendInvitations() {
    this.service
      .sendInvitations(this.campaignId)
      .pipe(
        catchError(() => {
          return EMPTY;
        }),
      )
      .subscribe(() => {
        this.router.navigate(['/campaigns', this.campaignId]);
      });
  }
  goToAssessment() {
    this.router.navigate(['/campaigns', this.campaignId, 'assessment-strategy']);
  }
}
