import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';

import { FormsModule } from '@angular/forms';

import { catchError, EMPTY, finalize, switchMap } from 'rxjs';

import { AssessmentSessionStore } from '../../../core/assessment-session.store';
import { AssessmentNavigationService } from '../../../core/assessment-navigation.service';
import { AssessmentService } from '../../../core/assessment.service';

import {
  AssessmentQuestionDto,
  AssessmentRoundType,
  SaveCandidateResponseResult,
} from '../../../models/assessment-session.model';

import { CodingWorkspacePage } from '../../coding/coding-workspace/coding-workspace.page';

import { TaoButtonComponent, TaoTextareaComponent } from '@tao/ui';

@Component({
  selector: 'tao-question',
  standalone: true,
  imports: [FormsModule, CodingWorkspacePage, TaoButtonComponent, TaoTextareaComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './question.page.html',
  styleUrl: './question.page.scss',
})
export class QuestionPage implements OnInit {
  // ===========================================================================
  // Dependencies
  // ===========================================================================

  readonly store = inject(AssessmentSessionStore);

  private readonly assessmentService = inject(AssessmentService);

  private readonly assessmentNavigationService = inject(AssessmentNavigationService);

  // ===========================================================================
  // Constants
  // ===========================================================================

  readonly assessmentType = AssessmentRoundType;

  // ===========================================================================
  // Local State
  // ===========================================================================

  readonly response = signal('');

  // ===========================================================================
  // Computed State
  // ===========================================================================

  readonly currentQuestion = computed(() => this.store.currentQuestion());

  readonly isCodingQuestion = computed(
    () => this.currentQuestion()?.roundType === AssessmentRoundType.Coding,
  );

  readonly isTechnicalQuestion = computed(
    () => this.currentQuestion()?.roundType === AssessmentRoundType.TechnicalDiscussion,
  );

  readonly isSystemDesignQuestion = computed(
    () => this.currentQuestion()?.roundType === AssessmentRoundType.SystemDesign,
  );

  /**
   * Current question number.
   *
   * Backend value is already 1-based.
   */
  readonly currentQuestionNumber = computed(() => this.store.currentQuestionNumber() ?? 1);

  readonly totalQuestions = computed(() => this.store.totalQuestions());

  readonly progressPercent = computed(() => this.store.progressPercent());

  readonly currentRoundName = computed(() => {
    const type = this.store.currentRoundType();

    switch (type) {
      case AssessmentRoundType.TechnicalDiscussion:
        return 'Technical Discussion';

      case AssessmentRoundType.SystemDesign:
        return 'System Design';

      case AssessmentRoundType.Coding:
        return 'Coding';

      default:
        return 'Assessment';
    }
  });

  readonly isTimerExpired = computed(() => this.store.isTimerExpired() || this.store.expired());

  readonly isTimerWarning = computed(() => this.store.isTimerWarning());

  /**
   * Response/editor disabled state.
   *
   * The editor should NOT be disabled just because
   * the timer initially contains 0.
   */
  readonly isResponseDisabled = computed(
    () => this.store.isSubmitting() || this.store.isQuestionLoading() || this.isTimerExpired(),
  );

  /**
   * Whether Continue can be clicked.
   */
  readonly canContinue = computed(() => {
    const answer = this.response().trim();

    return (
      answer.length > 0 &&
      !this.store.isSubmitting() &&
      !this.store.isQuestionLoading() &&
      !this.isTimerExpired()
    );
  });
  readonly followUpQuestions = signal<AssessmentQuestionDto[]>([]);
  readonly activeFollowUpQuestion = computed(() => {
    const followUps = this.followUpQuestions();

    return followUps.length > 0 ? followUps[0] : null;
  });

  readonly hasFollowUpQuestions = computed(() => this.followUpQuestions().length > 0);

  readonly responseQuestion = computed(() => this.followUpQuestions()[0] ?? this.currentQuestion());
  // ===========================================================================
  // Lifecycle
  // ===========================================================================

  ngOnInit(): void {
    this.loadAssessment();
  }

  // ===========================================================================
  // Initial Assessment Loading
  // ===========================================================================

  /**
   * Initial sequence:
   *
   * 1. Get authoritative workflow.
   * 2. Store workflow.
   * 3. Timer starts from assessmentExpiresOn.
   * 4. Get actual current question.
   */
  private loadAssessment(): void {
    const sessionId = this.store.assessmentSessionId();

    if (!sessionId) {
      this.store.setQuestionError('Assessment session is not available.');

      return;
    }

    /**
     * If workflow is already available,
     * don't make an unnecessary workflow request.
     */
    if (this.store.assessmentWorkflow()) {
      this.loadCurrentQuestion();
      return;
    }

    this.store.setQuestionLoading(true);

    this.store.setQuestionError(null);

    this.assessmentService
      .getAssessmentWorkflow(sessionId)
      .pipe(
        switchMap((workflow) => {
          this.store.setAssessmentWorkflow(workflow);

          if (
            workflow.status === 'Completed' ||
            workflow.status === 'Expired' ||
            workflow.remainingQuestions === 0
          ) {
            this.store.submit();

            this.assessmentNavigationService.finalReview();

            return EMPTY;
          }

          return this.assessmentService.getCurrentQuestion(sessionId);
        }),

        finalize(() => {
          this.store.setQuestionLoading(false);
        }),

        catchError((error) => {
          console.error('Failed to load assessment', error);

          this.store.setQuestionError('Unable to load the assessment.');

          return EMPTY;
        }),
      )
      .subscribe((question) => {
        if (question) {
          this.setQuestion(question);
        }
      });
  }

  // ===========================================================================
  // Current Question
  // ===========================================================================

  private loadCurrentQuestion(): void {
    const sessionId = this.store.assessmentSessionId();

    if (!sessionId) {
      this.store.setQuestionError('Assessment session is not available.');

      return;
    }

    this.store.setQuestionLoading(true);

    this.store.setQuestionError(null);

    this.assessmentService
      .getCurrentQuestion(sessionId)
      .pipe(
        finalize(() => {
          this.store.setQuestionLoading(false);
        }),

        catchError((error) => {
          console.error('Failed to load current question', error);

          this.store.setQuestionError('Unable to load the current question.');

          return EMPTY;
        }),
      )
      .subscribe((question) => {
        this.setQuestion(question);
      });
  }

  // ===========================================================================
  // Set Question
  // ===========================================================================

  private setQuestion(question: AssessmentQuestionDto): void {
    this.store.setCurrentQuestion(question);

    this.followUpQuestions.set([]);
    // Reset technical/system-design response.
    this.response.set('');
    this.store.setResponse('');

    // Reset coding response.
    this.store.setCodingCode('');
    this.store.setCodingSaveState('saved');

    this.store.markSaved();
  }

  // ===========================================================================
  // Text Response
  // ===========================================================================

  onResponse(value: string): void {
    if (this.isResponseDisabled()) {
      return;
    }

    this.response.set(value);

    this.store.setResponse(value);
  }

  // ===========================================================================
  // Coding Question
  // ===========================================================================

  onCodingContinue(code: string): void {
    const question = this.store.currentQuestion();

    if (!question) {
      return;
    }

    if (!code.trim()) {
      return;
    }

    if (this.store.isSubmitting() || this.store.isQuestionLoading() || this.isTimerExpired()) {
      return;
    }

    this.saveCodingResponse(code, question.questionId);
  }

  private saveCodingResponse(code: string, questionId: string): void {
    if (this.store.isSubmitting()) {
      return;
    }

    this.store.setSubmitting(true);

    this.store.setCodingSaveState('saving');

    const request = {
      code,
    };

    this.assessmentService
      .saveCodeResponse(questionId, request)
      .pipe(
        finalize(() => {
          this.store.setSubmitting(false);
        }),

        catchError((error) => {
          console.error('Failed to save coding response', error);

          this.store.setCodingSaveState('error');

          this.store.saveError();

          return EMPTY;
        }),
      )
      .subscribe((result) => {
        this.store.setCodingSaveState('saved');

        this.completeQuestion();
      });
  }

  // ===========================================================================
  // Continue - Technical / System Design
  // ===========================================================================

  next(): void {
    if (!this.canContinue()) {
      return;
    }

    const question = this.responseQuestion();

    if (!question) {
      return;
    }

    if (this.store.isSubmitting()) {
      return;
    }

    const answer = this.response().trim();

    if (!answer) {
      return;
    }

    this.store.setSubmitting(true);
    this.store.setResponse(answer);

    const request = {
      response: answer,
    };

    this.assessmentService
      .saveCandidateResponse(question.questionId, request)
      .pipe(
        finalize(() => {
          this.store.setSubmitting(false);
        }),
        catchError((error) => {
          console.error('Failed to save candidate response', error);

          this.store.saveError();

          return EMPTY;
        }),
      )
      .subscribe((result) => {
        this.handleSubmitResult(result);
      });
  }

  // ===========================================================================
  // Submit Result
  // ===========================================================================

  /**
   * After saving:
   *
   * Save Response
   *      ↓
   * Refresh Workflow
   *      ↓
   * Update Store
   *      ↓
   * Load Current Question
   */
  private handleSubmitResult(result: SaveCandidateResponseResult): void {
    this.store.markSaved();

    // Assessment completed
    if (result && result.assessmentCompleted) {
      this.store.submit();

      this.assessmentNavigationService.finalReview();

      return;
    }

    // Backend returned a follow-up question
    if (result && result.isFollowUpQuestion) {
      const question: AssessmentQuestionDto = {
        questionId: result.questionId,
        order: result.order,
        question: result.question,
        roundType: result.roundType,
        roundName: '',
        roundDurationInMinutes: result.roundDurationInMinutes,
        isFollowUpQuestion: result.isFollowUpQuestion,
        competencies: result.competencies,
      };
      this.addFollowUpQuestion(question);

      return;
    }
    this.completeQuestion();
  }

  private addFollowUpQuestion(question: AssessmentQuestionDto): void {
    this.followUpQuestions.update((questions) => [question, ...questions]);

    // New follow-up becomes the active question.
    this.response.set('');

    this.store.setResponse('');

    this.store.markSaved();
  }
  // ===========================================================================
  // Refresh Workflow
  // ===========================================================================

  private refreshWorkflowState(): void {
    const sessionId = this.store.assessmentSessionId();

    if (!sessionId) {
      this.store.setQuestionError('Assessment session is not available.');

      return;
    }

    this.store.setQuestionLoading(true);

    this.store.setQuestionError(null);

    this.assessmentService
      .getAssessmentWorkflow(sessionId)
      .pipe(
        finalize(() => {
          this.store.setQuestionLoading(false);
        }),

        catchError((error) => {
          console.error('Failed to refresh assessment workflow', error);

          this.store.setQuestionError('Unable to refresh assessment progress.');

          return EMPTY;
        }),
      )
      .subscribe((workflow) => {
        this.store.setAssessmentWorkflow(workflow);

        if (workflow.status === 'Completed' || workflow.remainingQuestions === 0) {
          this.store.submit();

          this.assessmentNavigationService.finalReview();

          return;
        }

        /**
         * Backend has moved to the next
         * authoritative question.
         */
        this.loadCurrentQuestion();
      });
  }

  private completeQuestion(): void {
    const question = this.responseQuestion();

    if (!question) {
      return;
    }
    this.assessmentService
      .completeAssessmentQuestion(question.questionId)
      .pipe(
        finalize(() => {
          this.store.setSubmitting(false);
        }),
        catchError((error) => {
          console.error('Failed to save candidate response', error);

          this.store.saveError();

          return EMPTY;
        }),
      )
      .subscribe(() => {
        // No follow-up question.
        // The current main question is now completed,
        // Now move to the next main question.
        this.followUpQuestions.set([]);
        this.refreshWorkflowState();
      });
  }
  // ===========================================================================
  // Retry
  // ===========================================================================

  retry(): void {
    this.loadAssessment();
  }
}
