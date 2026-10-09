import { Component, computed, inject, OnInit, signal } from '@angular/core';

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

import { TaoButtonComponent, TaoTextareaComponent, ToasterService } from '@tao/ui';

@Component({
  selector: 'tao-question',
  standalone: true,
  imports: [FormsModule, CodingWorkspacePage, TaoButtonComponent, TaoTextareaComponent],
  templateUrl: './question.page.html',
  styleUrl: './question.page.scss',
})
export class QuestionPage implements OnInit {
  readonly store = inject(AssessmentSessionStore);
  private readonly toaster = inject(ToasterService);
  private readonly assessmentService = inject(AssessmentService);
  private readonly assessmentNavigationService = inject(AssessmentNavigationService);

  readonly assessmentType = AssessmentRoundType;
  readonly response = signal('');

  readonly currentQuestion = computed(() => this.store.currentQuestion());
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

  readonly isResponseDisabled = computed(() => this.isTimerExpired());

  readonly canContinue = computed(() => {
    const answer = this.response().trim();

    return answer.length > 0 && !this.isResponseDisabled();
  });
  readonly followUpQuestions = signal<AssessmentQuestionDto[]>([]);
  readonly responseQuestion = computed(() => this.followUpQuestions()[0] ?? this.currentQuestion());

  ngOnInit(): void {
    this.loadAssessment();
  }

  private loadAssessment(): void {
    const sessionId = this.store.assessmentSessionId();

    if (!sessionId) {
      const message = 'Assessment session is not available.';
      this.notifyError(message);
      return;
    }

    if (this.store.assessmentWorkflow()) {
      this.loadCurrentQuestion();
      return;
    }

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
        catchError((error) => {
          const message = 'Unable to load the assessment.';
          this.notifyError(message, 'Failed to load assessment', error);
          return EMPTY;
        }),
      )
      .subscribe((question) => {
        if (question) {
          this.setQuestion(question);
        }
      });
  }

  private loadCurrentQuestion(): void {
    const sessionId = this.store.assessmentSessionId();

    if (!sessionId) {
      const message = 'Assessment session is not available.';
      this.notifyError(message);
      return;
    }

    this.assessmentService
      .advanceAssessment(sessionId)
      .pipe(
        catchError((error) => {
          const message = 'Unable to load the current question.';
          this.notifyError(message, 'Failed to load current question', error);
          return EMPTY;
        }),
      )
      .subscribe((question) => {
        this.setQuestion(question);
        this.refreshWorkflowState();
      });
  }

  private setQuestion(question: AssessmentQuestionDto): void {
    this.store.setCurrentQuestion(question);
    this.followUpQuestions.set([]);
    this.response.set('');

    // Reset coding response.
  }

  onResponse(value: string): void {
    if (this.isResponseDisabled()) {
      return;
    }
    this.response.set(value);
  }

  onCodingContinue(code: string): void {
    const question = this.store.currentQuestion();
    if (!question) {
      return;
    }
    if (!code.trim()) {
      return;
    }
    if (this.isTimerExpired()) {
      return;
    }
    this.saveCodingResponse(code, question.questionId);
  }

  private saveCodingResponse(code: string, questionId: string): void {
    const request = {
      code,
    };

    this.assessmentService
      .saveCodeResponse(questionId, request)
      .pipe(
        catchError((error) => {
          this.notifyError(
            'Unable to save your code response.',
            'Failed to save coding response',
            error,
          );
          return EMPTY;
        }),
      )
      .subscribe(() => {
        this.completeQuestion();
      });
  }

  next(): void {
    if (!this.canContinue()) {
      return;
    }

    const question = this.responseQuestion();

    if (!question) {
      return;
    }

    const answer = this.response().trim();

    const request = {
      response: answer,
    };

    this.assessmentService
      .saveCandidateResponse(question.questionId, request)
      .pipe(
        catchError((error) => {
          this.notifyError(
            'Unable to save your response.',
            'Failed to save candidate response',
            error,
          );
          return EMPTY;
        }),
      )
      .subscribe((result) => {
        this.handleSubmitResult(result);
      });
  }

  skipQuestion(): void {
    const question = this.responseQuestion();

    if (!question) {
      return;
    }
    if (question.isFollowUpQuestion) {
      this.response.set('');
      this.next();
      return;
    }
    this.assessmentService
      .skipQuestion(question.questionId)
      .pipe(
        catchError((error) => {
          this.notifyError('Unable to skip the question.', 'Failed to skip question', error);
          return EMPTY;
        }),
      )
      .subscribe(() => {
        this.followUpQuestions.set([]);
        this.loadCurrentQuestion();
      });
  }

  private handleSubmitResult(result: SaveCandidateResponseResult): void {
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
        questionOrder: result.order,
        primaryQuestion: result.question,
        roundType: result.roundType,
        roundId: '',
        roundDurationInMinutes: result.roundDurationInMinutes,
        isFollowUpQuestion: result.isFollowUpQuestion,
        competencies: result.competencies,
        roundOrder: 1,
        isNewRound: false,
        assessmentCompleted: false,
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
  }
  // ===========================================================================
  // Refresh Workflow
  // ===========================================================================

  private refreshWorkflowState(): void {
    const sessionId = this.store.assessmentSessionId();

    if (!sessionId) {
      const message = 'Assessment session is not available.';
      this.notifyError(message);
      return;
    }
    this.assessmentService
      .getAssessmentWorkflow(sessionId)
      .pipe(
        catchError((error) => {
          const message = 'Unable to refresh assessment progress.';
          this.notifyError(message, 'Failed to refresh assessment workflow', error);
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
        catchError((error) => {
          this.notifyError(
            'Unable to complete the question.',
            'Failed to complete assessment question',
            error,
          );
          return EMPTY;
        }),
      )
      .subscribe(() => {
        this.followUpQuestions.set([]);
        this.loadCurrentQuestion();
      });
  }

  private notifyError(message: string, context?: string, error?: unknown): void {
    if (context && error !== undefined) {
      console.error(context, error);
    }
    this.toaster.error(message);
  }
}
