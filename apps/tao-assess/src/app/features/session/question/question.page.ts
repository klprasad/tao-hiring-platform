import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  OnInit,
  signal,
} from '@angular/core';

import { FormsModule } from '@angular/forms';

import { catchError, EMPTY, finalize } from 'rxjs';

import { AssessmentSessionStore } from '../../../core/assessment-session.store';
import { AssessmentNavigationService } from '../../../core/assessment-navigation.service';
import { AssessmentService } from '../../../core/assessment.service';

import {
  AssessmentQuestionDto,
  AssessmentRoundType,
  SaveCandidateResponseResult,
} from '../../../models/assessment-session.model';

import { CodingWorkspacePage } from '../../coding/coding-workspace/coding-workspace.page';

@Component({
  selector: 'tao-question',
  standalone: true,
  imports: [FormsModule, CodingWorkspacePage],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './question.page.html',
  styleUrl: './question.page.scss',
})
export class QuestionPage implements OnInit {
  // ---------------------------------------------------------
  // Dependencies
  // ---------------------------------------------------------

  readonly store = inject(AssessmentSessionStore);

  private readonly assessmentService = inject(AssessmentService);

  private readonly assessmentNavigationService = inject(AssessmentNavigationService);

  // ---------------------------------------------------------
  // Constants
  // ---------------------------------------------------------

  readonly assessmentType = AssessmentRoundType;

  // ---------------------------------------------------------
  // Local State
  // ---------------------------------------------------------

  /**
   * Current text response for technical/system-design questions.
   */
  readonly response = signal('');

  // ---------------------------------------------------------
  // Computed State
  // ---------------------------------------------------------

  /**
   * Current question.
   */
  readonly currentQuestion = computed(() => this.store.currentQuestion());

  /**
   * Whether current question is a coding question.
   */
  readonly isCodingQuestion = computed(
    () => this.currentQuestion()?.roundType === AssessmentRoundType.Coding,
  );

  /**
   * Whether current question is a technical question.
   */
  readonly isTechnicalQuestion = computed(
    () => this.currentQuestion()?.roundType === AssessmentRoundType.TechnicalDiscussion,
  );

  /**
   * Whether current question is a system design question.
   */
  readonly isSystemDesignQuestion = computed(
    () => this.currentQuestion()?.roundType === AssessmentRoundType.SystemDesign,
  );

  /**
   * Determines whether Continue should be enabled.
   *
   * Important:
   * savedState is intentionally NOT used here.
   *
   * savedState is only a UI status indicator.
   * isSubmitting is the actual API submission guard.
   */
  readonly canContinue = computed(() => {
    const answer = this.response().trim();

    return answer.length > 0 && !this.store.isSubmitting() && !this.store.isQuestionLoading();
  });

  // ---------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------

  constructor() {
    /**
     * Restore any existing response from the store.
     */
    this.response.set(this.store.response());

    /**
     * React to round changes.
     *
     * Timer logic can be added here later.
     */
    effect(() => {
      const currentRound = this.store.currentRound();

      if (!currentRound) {
        return;
      }

      // Start / reset timer if required.
    });
  }

  // ---------------------------------------------------------
  // Lifecycle
  // ---------------------------------------------------------

  ngOnInit(): void {
    this.loadCurrentQuestion();
  }

  // ---------------------------------------------------------
  // Question Loading
  // ---------------------------------------------------------

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

  // ---------------------------------------------------------
  // Set Question
  // ---------------------------------------------------------

  private setQuestion(question: AssessmentQuestionDto): void {
    /**
     * Update current question in store.
     */
    this.store.setCurrentQuestion(question);

    /**
     * Reset local response.
     */
    this.response.set('');

    /**
     * Reset store response.
     */
    this.store.setResponse('');

    /**
     * New question is ready.
     *
     * Make sure the previous question's
     * saving/error state doesn't affect
     * the new question.
     */
    this.store.markSaved();
  }

  // ---------------------------------------------------------
  // Text Response
  // ---------------------------------------------------------

  onResponse(value: string): void {
    this.response.set(value);
    this.store.setResponse(value);
  }

  // ---------------------------------------------------------
  // Continue - Coding
  // ---------------------------------------------------------

  onCodingContinue(code: string): void {
    const question = this.store.currentQuestion();

    if (!question) {
      return;
    }

    if (!code.trim()) {
      return;
    }

    this.saveCodingResponse(code, question.questionId);
  }

  private saveCodingResponse(code: string, questionId: string): void {
    /**
     * Prevent duplicate submission.
     */
    if (this.store.isSubmitting()) {
      return;
    }

    this.store.setSubmitting(true);
    this.store.savedState.set('saving');

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
          this.store.saveError();
          return EMPTY;
        }),
      )
      .subscribe((result) => {
        this.handleSubmitResult(result);
      });
  }

  // ---------------------------------------------------------
  // Continue - Technical/System Design
  // ---------------------------------------------------------

  next(): void {
    /**
     * This protects the method even if called
     * programmatically.
     */
    if (!this.canContinue()) {
      return;
    }
    const question = this.store.currentQuestion();
    if (!question) {
      return;
    }

    /**
     * Prevent duplicate submissions.
     */
    if (this.store.isSubmitting()) {
      return;
    }
    this.store.setSubmitting(true);
    this.store.savedState.set('saving');

    const request = {
      response: this.response().trim(),
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

  // ---------------------------------------------------------
  // Submit Result
  // ---------------------------------------------------------

  private handleSubmitResult(result: SaveCandidateResponseResult): void {
    /**
     * Current response was successfully saved.
     */
    this.store.markSaved();

    // -------------------------------------------------------
    // Entire assessment completed
    // -------------------------------------------------------

    if (result.assessmentCompleted) {
      this.store.submit();
      this.assessmentNavigationService.finalReview();
      return;
    }

    // -------------------------------------------------------
    // Current round completed
    // -------------------------------------------------------

    if (result.roundCompleted) {
      /**
       * Backend may return the first question
       * of the next round.
       */
      if (result.nextQuestion) {
        this.setQuestion(result.nextQuestion);
        return;
      }

      /**
       * No next question means assessment
       * should move to final review.
       */
      this.assessmentNavigationService.finalReview();
      return;
    }

    // -------------------------------------------------------
    // Normal question progression
    // -------------------------------------------------------

    if (result.nextQuestion) {
      this.setQuestion(result.nextQuestion);
      return;
    }

    // -------------------------------------------------------
    // Defensive fallback
    // -------------------------------------------------------

    this.loadCurrentQuestion();
  }

  // ---------------------------------------------------------
  // Follow-up Question
  // ---------------------------------------------------------

  followUp(): void {
    const question = this.store.currentQuestion();

    if (!question) {
      return;
    }

    /**
     * Prevent another request while submitting.
     */
    if (this.store.isSubmitting()) {
      return;
    }

    this.assessmentService
      .getFollowUpQuestion(question.questionId)
      .pipe(
        catchError((error) => {
          console.error('Failed to load follow-up question', error);
          return EMPTY;
        }),
      )
      .subscribe((question) => {
        this.setQuestion(question);
      });
  }

  // ---------------------------------------------------------
  // Retry
  // ---------------------------------------------------------

  retry(): void {
    this.loadCurrentQuestion();
  }
}
