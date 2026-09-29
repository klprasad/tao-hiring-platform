import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { catchError, EMPTY, finalize } from 'rxjs';

import { AssessmentSessionStore } from '../../../core/assessment-session.store';
import { AssessmentNavigationService } from '../../../core/assessment-navigation.service';
import { AssessmentService } from '../../../core/assessment.service';
import {
  AssessmentQuestionDto,
  SaveCandidateResponseResult,
} from '../../../models/assessment-session.model';

@Component({
  selector: 'tao-question',
  standalone: true,
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './question.page.html',
  styleUrl: './question.page.scss',
})
export class QuestionPage {
  readonly store = inject(AssessmentSessionStore);

  private readonly assessmentService = inject(AssessmentService);

  private readonly assessmentNavigationService = inject(AssessmentNavigationService);

  private readonly destroyRef = inject(DestroyRef);

  readonly response = signal('');

  readonly canContinue = computed(() => {
    const response = this.response().trim();

    return (
      response.length > 0 &&
      this.store.savedState() !== 'saving' &&
      !this.store.isSubmitting() &&
      !this.store.isQuestionLoading()
    );
  });

  constructor() {
    /*
     * Restore locally stored response if available.
     */
    this.response.set(this.store.response());

    /*
     * Start round timer once current round is available.
     */
    effect(() => {
      const currentRound = this.store.currentRound();

      if (!currentRound) {
        return;
      }

      if (!this.store.timerRunning()) {
        this.store.startTimer(currentRound.durationMinutes);
      }
    });
  }

  ngOnInit(): void {
    this.loadCurrentQuestion();
  }

  /**
   * Load the question that the backend says
   * is currently active for this assessment session.
   */
  private loadCurrentQuestion(): void {
    const sessionId = '';

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

  /**
   * Set API question into the store and reset
   * the answer state.
   */
  private setQuestion(question: AssessmentQuestionDto): void {
    this.store.setCurrentQuestion(question);

    this.response.set('');
  }

  onResponse(value: string): void {
    this.response.set(value);

    this.store.setResponse(value);
  }

  /**
   * Submit the current answer.
   *
   * Backend saves the response and returns
   * the next question.
   */
  next(): void {
    if (!this.canContinue()) {
      return;
    }

    const question = this.store.currentQuestion();

    if (!question) {
      return;
    }

    const response = this.response().trim();

    this.store.setSubmitting(true);
    this.store.savedState.set('saving');

    const request = {
      response,
    };

    this.assessmentService
      .saveCandidateResponse(question.id, request)
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

  /**
   * Process the response returned by the backend.
   */
  private handleSubmitResult(result: SaveCandidateResponseResult): void {
    this.store.markSaved();

    /*
     * Assessment is completely finished.
     */
    if (result.assessmentCompleted) {
      this.store.submit();

      this.assessmentNavigationService.finalReview();

      return;
    }

    /*
     * Backend returned the first question
     * of the next round.
     */
    if (result.roundCompleted) {
      if (result.nextQuestion) {
        this.setQuestion(result.nextQuestion);

        return;
      }

      this.assessmentNavigationService.finalReview();

      return;
    }

    /*
     * Normal question progression.
     */
    if (result.nextQuestion) {
      this.setQuestion(result.nextQuestion);

      return;
    }

    /*
     * Defensive fallback.
     */
    this.loadCurrentQuestion();
  }

  followUp(): void {
    const question = this.store.currentQuestion();

    if (!question) {
      return;
    }

    this.assessmentService
      .getFollowUpQuestion(question.id)
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
}
