import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { catchError, EMPTY } from 'rxjs';

import { TaoCardComponent, TaoPageHeaderComponent } from '@tao/ui';

import { CandidateDto } from '../models/candidates.mode';
import { CandidatesService } from '../data-access/candidates.service';

type CandidateFilter = 'all' | 'recommended' | 'rejected';

@Component({
  selector: 'tao-candidates',
  imports: [TaoCardComponent, TaoPageHeaderComponent],
  templateUrl: './candidates.html',
  styleUrl: './candidates.scss',
})
export class Candidates implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly service = inject(CandidatesService);

  // ---------------------------------------------------------------------------
  // State
  // ---------------------------------------------------------------------------

  readonly candidates = signal<CandidateDto[]>([]);
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

    this.service
      .getCandidates(this.campaignId)
      .pipe(
        catchError(() => {
          this.errorMessage.set('Unable to load candidates. Please try again.');

          return EMPTY;
        }),
      )
      .subscribe((response) => {
        this.candidates.set(response);
      });
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
}
