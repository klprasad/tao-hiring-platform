import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, catchError, finalize, of, switchMap, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  TaoButtonComponent,
  TaoCardComponent,
  TaoDataTableComponent,
  TaoEmptyStateComponent,
  TaoLoadingStateComponent,
  TaoPageHeaderComponent,
  TaoTableColumn,
  TaoTableConfig,
} from '@tao/ui';
import { AssessmentResultService } from '../../data-access/assessment-results.service';
import {
  AssessmentCandidate,
  AssessmentQuestionCodeResponse,
  AssessmentQuestionConversationResponse,
  AssessmentQuestionResult,
  AssessmentRoundResult,
  AssessmentRoundSummary,
  AssessmentSummary,
} from '../../models/assessment-result.models';
import { CandidateAssessmentSummaryComponent } from '../../components/candidate-assessment-summary/candidate-assessment-summary';
import { AssessmentRoundResultsComponent } from '../../components/assessment-round-results/assessment-round-results';
import { AssessmentQuestionResultComponent } from '../../components/assessment-question-result/assessment-question-result';
import { CandidateCodeViewer } from '../../components/candidate-code-viewer/candidate-code-viewer';
import { CandidateConversationViewer } from '../../components/candidate-conversation-viewer/candidate-conversation-viewer';

interface CandidateResultRow {
  candidate: AssessmentCandidate;
  candidateName: string;
  email: string;
  location: string;
  completedOn: string;
}

@Component({
  selector: 'tao-assessment-result-overview',
  standalone: true,
  imports: [
    TaoCardComponent,
    TaoDataTableComponent,
    TaoEmptyStateComponent,
    TaoLoadingStateComponent,
    TaoPageHeaderComponent,
    TaoButtonComponent,
    CandidateAssessmentSummaryComponent,
    AssessmentRoundResultsComponent,
    AssessmentQuestionResultComponent,
    CandidateCodeViewer,
    CandidateConversationViewer,
  ],
  templateUrl: './assessment-result-overview.html',
  styleUrl: './assessment-result-overview.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssessmentResultOverview {
  private readonly api = inject(AssessmentResultService);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  private readonly candidateSelected$ = new Subject<AssessmentCandidate>();
  private readonly roundSelected$ = new Subject<{
    sessionId: string;
    round: AssessmentRoundSummary;
  }>();
  private readonly questionSelected$ = new Subject<{
    sessionId: string;
    question: AssessmentQuestionResult;
  }>();

  readonly campaignId = this.route.snapshot.paramMap.get('campaignId') ?? '';
  readonly candidates = signal<CandidateResultRow[]>([]);
  readonly selectedCandidate = signal<AssessmentCandidate | null>(null);
  readonly summary = signal<AssessmentSummary | null>(null);
  readonly selectedRound = signal<AssessmentRoundResult | null>(null);
  readonly selectedQuestion = signal<AssessmentQuestionResult | null>(null);

  readonly loadingCandidates = signal(true);
  readonly loadingSummary = signal(false);
  readonly loadingRound = signal(false);
  readonly loadingQuestion = signal(false);
  readonly hasError = signal(false);

  readonly questionConversation = signal<AssessmentQuestionConversationResponse | null>(null);

  readonly questionCode = signal<AssessmentQuestionCodeResponse | null>(null);

  readonly loadingResponse = signal(false);

  readonly responseError = signal(false);
  readonly columns: TaoTableColumn<CandidateResultRow>[] = [
    { key: 'candidateName', label: 'Candidate', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'location', label: 'Location', sortable: true },
    { key: 'completedOn', label: 'Completed', sortable: true },
  ];

  readonly tableConfig: TaoTableConfig = {
    sortable: true,
    pagination: true,
    pageSize: 10,
    pageSizeOptions: [10, 25, 50],
    rowHover: true,
    density: 'comfortable',
  };

  constructor() {
    this.loadCandidates();

    this.candidateSelected$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((candidate) => {
          this.selectedCandidate.set(candidate);
          this.summary.set(null);
          this.selectedRound.set(null);
          this.selectedQuestion.set(null);
          this.resetQuestionResponse();
          this.loadingSummary.set(true);
          this.hasError.set(false);
        }),
        switchMap((candidate) =>
          this.api.getAssessmentSummary(candidate.assessmentSessionId).pipe(
            catchError(() => {
              this.hasError.set(true);
              return of(null);
            }),
          ),
        ),
      )
      .subscribe((summary) => {
        this.loadingSummary.set(false);
        this.summary.set(summary);
      });

    this.roundSelected$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap(({ round }) => {
          this.selectedRound.set(null);
          this.selectedQuestion.set(null);
          this.resetQuestionResponse();
          this.loadingRound.set(true);
        }),
        switchMap(({ sessionId, round }) =>
          this.api.getAssessmentRoundResults(sessionId, round.roundId).pipe(
            catchError(() => {
              this.hasError.set(true);
              return of(null);
            }),
          ),
        ),
      )
      .subscribe((result) => {
        this.loadingRound.set(false);
        this.selectedRound.set(result);
      });

    this.questionSelected$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap(() => {
          this.selectedQuestion.set(null);
          this.resetQuestionResponse();
          this.loadingQuestion.set(true);
        }),
        switchMap(({ sessionId, question }) =>
          this.api.getQuestionResults(sessionId, question.questionId).pipe(
            catchError(() => {
              this.hasError.set(true);
              return of(null);
            }),
          ),
        ),
      )
      .subscribe((result) => {
        this.loadingQuestion.set(false);
        this.selectedQuestion.set(result);
      });
  }
  loadCandidateResponse(): void {
    const candidate = this.selectedCandidate();
    const question = this.selectedQuestion();
    const round = this.selectedRound();

    if (!candidate?.assessmentSessionId || !question?.questionId || !round) {
      return;
    }

    const sessionId = candidate.assessmentSessionId;
    const questionId = question.questionId;

    this.questionConversation.set(null);
    this.questionCode.set(null);
    this.responseError.set(false);
    this.loadingResponse.set(true);

    if (this.isCodingRound(round.roundType)) {
      this.api
        .getCodingQuestionResponse(sessionId, questionId)
        .pipe(finalize(() => this.loadingResponse.set(false)))
        .subscribe({
          next: (response) => this.questionCode.set(response),
          error: () => this.responseError.set(true),
        });

      return;
    }

    this.api
      .getQuestionResponse(sessionId, questionId)
      .pipe(finalize(() => this.loadingResponse.set(false)))
      .subscribe({
        next: (response) => this.questionConversation.set(response),
        error: () => this.responseError.set(true),
      });
  }
  backToCandidates(): void {
    this.selectedCandidate.set(null);
    this.summary.set(null);
    this.selectedRound.set(null);
    this.selectedQuestion.set(null);
    this.resetQuestionResponse();

    this.loadingSummary.set(false);
    this.loadingRound.set(false);
    this.loadingQuestion.set(false);
    this.hasError.set(false);
  }
  selectCandidate(row: CandidateResultRow): void {
    this.candidateSelected$.next(row.candidate);
  }

  selectRound(round: AssessmentRoundSummary): void {
    const sessionId = this.selectedCandidate()?.assessmentSessionId;
    if (!sessionId) return;
    this.roundSelected$.next({ sessionId, round });
  }

  selectQuestion(question: AssessmentQuestionResult): void {
    const sessionId = this.selectedCandidate()?.assessmentSessionId;
    if (!sessionId) return;
    this.questionSelected$.next({ sessionId, question });
  }

  trackCandidate(_: number, row: CandidateResultRow): string {
    return row.candidate.assessmentSessionId;
  }

  private isCodingRound(roundType: string): boolean {
    return roundType.trim().toLowerCase().includes('coding');
  }

  private resetQuestionResponse(): void {
    this.questionConversation.set(null);
    this.questionCode.set(null);
    this.loadingResponse.set(false);
    this.responseError.set(false);
  }

  private loadCandidates(): void {
    if (!this.campaignId) {
      this.loadingCandidates.set(false);
      this.hasError.set(true);
      return;
    }

    this.api
      .getCandidatesResults(this.campaignId)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError(() => {
          this.hasError.set(true);
          return of([] as AssessmentCandidate[]);
        }),
        finalize(() => this.loadingCandidates.set(false)),
      )
      .subscribe((candidates) => {
        this.hasError.set(false);
        this.candidates.set(candidates.map((candidate) => this.toRow(candidate)));
      });
  }

  private toRow(candidate: AssessmentCandidate): CandidateResultRow {
    return {
      candidate,
      candidateName: candidate.candidateName,
      email: candidate.email,
      location: candidate.currentLocation ?? '—',
      completedOn: candidate.completedOn ? this.formatDate(candidate.completedOn) : '—',
    };
  }

  private formatDate(value: string): string {
    return new Intl.DateTimeFormat(undefined, {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(value));
  }
}
