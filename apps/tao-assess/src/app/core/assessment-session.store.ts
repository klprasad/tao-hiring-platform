import { computed, DestroyRef, inject, Injectable, signal } from '@angular/core';

import {
  AssessmentQuestionDto,
  AssessmentRoundType,
  AssessmentSessionVm,
  AssessmentSessionWorkflowDto,
  AssessmentRoundWorkflowDto,
} from '../models/assessment-session.model';

export type CheckStatus = 'checking' | 'passed' | 'failed';

export type QuestionType = 'technical' | 'follow-up' | 'coding';

@Injectable({
  providedIn: 'root',
})
export class AssessmentSessionStore {
  private readonly destroyRef = inject(DestroyRef);

  // ===========================================================================
  // Current Question
  // ===========================================================================

  readonly currentQuestion = signal<AssessmentQuestionDto | null>(null);

  readonly isQuestionLoading = signal(false);

  readonly isSubmitting = signal(false);

  readonly questionError = signal<string | null>(null);

  // ===========================================================================
  // Assessment Configuration
  // ===========================================================================

  /**
   * Original assessment/session configuration.
   *
   * Used mainly by landing / pre-assessment screens.
   */
  readonly assessmentSession = signal<AssessmentSessionVm | null>(null);

  // ===========================================================================
  // Assessment Workflow
  // ===========================================================================

  /**
   * Authoritative runtime assessment state.
   *
   * Backend owns:
   * - current round
   * - current question
   * - progress
   * - completion
   * - expiry
   * - resume state
   */
  readonly assessmentWorkflow = signal<AssessmentSessionWorkflowDto | null>(null);

  // ===========================================================================
  // Assessment Identity / Status
  // ===========================================================================

  readonly assessmentSessionId = computed(
    () => this.assessmentWorkflow()?.assessmentSessionId ?? this.assessmentSession()?.id ?? '',
  );

  readonly status = computed(() => this.assessmentWorkflow()?.status ?? null);

  readonly currentStage = computed(() => this.assessmentWorkflow()?.currentStage ?? null);

  // ===========================================================================
  // Workflow Progress
  // ===========================================================================

  readonly completionPercentage = computed(
    () => this.assessmentWorkflow()?.completionPercentage ?? 0,
  );

  readonly totalRounds = computed(() => this.assessmentWorkflow()?.totalRounds ?? 0);

  readonly completedRounds = computed(() => this.assessmentWorkflow()?.completedRounds ?? 0);

  readonly remainingRounds = computed(() => this.assessmentWorkflow()?.remainingRounds ?? 0);

  readonly totalQuestions = computed(() => this.assessmentWorkflow()?.totalQuestions ?? 0);

  readonly completedQuestions = computed(() => this.assessmentWorkflow()?.completedQuestions ?? 0);

  readonly skippedQuestions = computed(() => this.assessmentWorkflow()?.skippedQuestions ?? 0);

  readonly remainingQuestions = computed(() => this.assessmentWorkflow()?.remainingQuestions ?? 0);

  /**
   * Backend authoritative progress.
   */
  readonly progressPercent = computed(() => this.assessmentWorkflow()?.completionPercentage ?? 0);

  // ===========================================================================
  // Current Round
  // ===========================================================================

  readonly currentRoundId = computed(() => this.assessmentWorkflow()?.currentRoundId ?? null);

  readonly currentRoundOrder = computed(() => this.assessmentWorkflow()?.currentRoundOrder ?? null);

  readonly currentRoundType = computed(() => this.assessmentWorkflow()?.currentRoundType ?? null);

  /**
   * Current round object.
   */
  readonly currentRound = computed<AssessmentRoundWorkflowDto | null>(() => {
    const workflow = this.assessmentWorkflow();

    if (!workflow?.currentRoundId) {
      return null;
    }

    return workflow.rounds.find((round) => round.roundId === workflow.currentRoundId) ?? null;
  });

  /**
   * All workflow rounds.
   */
  readonly rounds = computed(() => this.assessmentWorkflow()?.rounds ?? []);

  // ===========================================================================
  // Current Question Position
  // ===========================================================================

  readonly currentQuestionId = computed(() => this.assessmentWorkflow()?.currentQuestionId ?? null);

  /**
   * Backend question order.
   *
   * This is 1-based.
   *
   * Example:
   * Question 1 of 4
   */
  readonly currentQuestionOrder = computed(
    () => this.assessmentWorkflow()?.currentQuestionOrder ?? null,
  );

  // ===========================================================================
  // Candidate / Assessment State
  // ===========================================================================

  readonly candidateEmail = signal('john@example.com');

  readonly consentAccepted = signal(false);

  readonly browserReady = signal(false);

  readonly started = signal(false);

  readonly submitted = signal(false);

  readonly expired = signal(false);

  readonly canResume = computed(() => this.assessmentWorkflow()?.canResume ?? false);

  readonly isInterrupted = computed(() => this.assessmentWorkflow()?.isInterrupted ?? false);

  // ===========================================================================
  // Landing
  // ===========================================================================

  readonly landing = computed(() => {
    const assessment = this.assessmentSession();

    if (!assessment) {
      return null;
    }

    return {
      roleTitle: assessment.strategySnapshot.AssessmentName,

      organizationName: 'TAO',

      durationMinutes: assessment.rounds.reduce(
        (total, round) => total + round.durationInMinutes,
        0,
      ),

      rounds: assessment.rounds.map((round) => ({
        id: round.order,
        order: round.order,
        name: this.getRoundName(round.type),
        type: round.type,
        durationMinutes: round.durationInMinutes,
        questionCount: round.targetQuestionCount,
      })),

      instructions: [
        'Make sure you have a stable internet connection.',
        'Complete each assessment round within the allotted time.',
        'Do not refresh or close the browser during the assessment.',
        'Make sure your camera and microphone are available if required.',
      ],
    };
  });

  // ===========================================================================
  // Answers
  // ===========================================================================

  readonly response = signal('');

  readonly codingCode = signal(
    `public class Solution
{
    public void Process()
    {
        // Write your solution here
    }
}`,
  );

  readonly savedState = signal<'saved' | 'saving' | 'error'>('saved');

  readonly codingSaveState = signal<'saved' | 'saving' | 'error'>('saved');

  // ===========================================================================
  // Timer
  // ===========================================================================

  readonly remainingSeconds = signal(0);

  readonly timerRunning = signal(false);

  /**
   * Server-provided assessment expiration timestamp.
   */
  readonly assessmentExpiresAt = computed(() => {
    const expiresOn = this.assessmentWorkflow()?.assessmentExpiresOn;

    if (!expiresOn) {
      return null;
    }

    const timestamp = new Date(expiresOn).getTime();

    return Number.isFinite(timestamp) ? timestamp : null;
  });

  /**
   * Server-provided assessment start timestamp.
   */
  readonly assessmentStartedAt = computed(() => {
    const startedOn = this.assessmentWorkflow()?.startedOn;

    if (!startedOn) {
      return null;
    }

    const timestamp = new Date(startedOn).getTime();

    return Number.isFinite(timestamp) ? timestamp : null;
  });

  /**
   * Timer is expired only when the server gave us
   * an expiration timestamp AND that timestamp has passed.
   */
  readonly isTimerExpired = computed(() => {
    const expiresAt = this.assessmentExpiresAt();

    return expiresAt !== null && this.remainingSeconds() <= 0;
  });

  /**
   * Warning when one minute or less remains.
   */
  readonly isTimerWarning = computed(() => {
    const remaining = this.remainingSeconds();

    return remaining > 0 && remaining <= 60;
  });

  /**
   * Human-readable timer.
   *
   * MM:SS for normal assessments.
   * HH:MM:SS when more than one hour remains.
   */
  readonly remainingTime = computed(() => {
    const totalSeconds = Math.max(0, this.remainingSeconds());

    const hours = Math.floor(totalSeconds / 3600);

    const minutes = Math.floor((totalSeconds % 3600) / 60);

    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return [
        hours.toString().padStart(2, '0'),

        minutes.toString().padStart(2, '0'),

        seconds.toString().padStart(2, '0'),
      ].join(':');
    }

    return [minutes.toString().padStart(2, '0'), seconds.toString().padStart(2, '0')].join(':');
  });

  /**
   * Optional timer progress.
   */
  readonly timerPercent = computed(() => {
    const startedAt = this.assessmentStartedAt();

    const expiresAt = this.assessmentExpiresAt();

    const remaining = this.remainingSeconds();

    if (startedAt === null || expiresAt === null) {
      return 0;
    }

    const totalSeconds = Math.max(0, Math.floor((expiresAt - startedAt) / 1000));

    if (totalSeconds === 0) {
      return 0;
    }

    return Math.min(100, Math.max(0, Math.round((remaining / totalSeconds) * 100)));
  });

  private timerId: ReturnType<typeof setInterval> | undefined;

  /**
   * Start timer from server expiration timestamp.
   *
   * IMPORTANT:
   * We do not decrement a local counter blindly.
   *
   * Every tick calculates:
   *
   *   expiresAt - Date.now()
   *
   * This keeps the timer synchronized with the
   * server-authoritative expiry time.
   */
  startAssessmentTimer(): void {
    this.stopTimer();

    const expiresAt = this.assessmentExpiresAt();

    if (expiresAt === null) {
      this.remainingSeconds.set(0);
      return;
    }

    const updateRemainingTime = (): void => {
      const remaining = Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000));

      this.remainingSeconds.set(remaining);

      if (remaining <= 0) {
        this.stopTimer();
        this.handleTimerExpired();
      }
    };

    // Update immediately.
    updateRemainingTime();

    if (this.remainingSeconds() <= 0) {
      return;
    }

    this.timerRunning.set(true);

    this.timerId = setInterval(updateRemainingTime, 1000);
  }

  stopTimer(): void {
    if (this.timerId !== undefined) {
      clearInterval(this.timerId);

      this.timerId = undefined;
    }

    this.timerRunning.set(false);
  }

  private handleTimerExpired(): void {
    this.expired.set(true);
    this.timerRunning.set(false);
  }

  // ===========================================================================
  // Workflow
  // ===========================================================================

  /**
   * Store the authoritative workflow.
   */
  setAssessmentWorkflow(workflow: AssessmentSessionWorkflowDto): void {
    this.assessmentWorkflow.set(workflow);

    this.syncWorkflowState(workflow);

    /**
     * Start/synchronize timer whenever
     * workflow is received.
     */
    if (workflow.status === 'InProgress') {
      this.startAssessmentTimer();
    } else {
      this.stopTimer();
    }
  }

  /**
   * Synchronize local state from backend state.
   */
  private syncWorkflowState(workflow: AssessmentSessionWorkflowDto): void {
    this.started.set(workflow.status === 'InProgress');

    this.submitted.set(workflow.status === 'Completed');

    this.expired.set(workflow.status === 'Expired');
  }

  // ===========================================================================
  // Current Question
  // ===========================================================================

  setCurrentQuestion(question: AssessmentQuestionDto): void {
    this.currentQuestion.set(question);

    this.response.set('');

    this.codingCode.set(
      `public class Solution
{
    public void Process()
    {
        // Write your solution here
    }
}`,
    );

    this.savedState.set('saved');

    this.codingSaveState.set('saved');

    this.questionError.set(null);
  }

  setQuestionLoading(value: boolean): void {
    this.isQuestionLoading.set(value);
  }

  setSubmitting(value: boolean): void {
    this.isSubmitting.set(value);
  }

  setQuestionError(error: string | null): void {
    this.questionError.set(error);
  }

  // ===========================================================================
  // Consent / Browser / Assessment
  // ===========================================================================

  acceptConsent(): void {
    this.consentAccepted.set(true);
  }

  markBrowserReady(): void {
    this.browserReady.set(true);
  }

  start(): void {
    this.started.set(true);

    this.startAssessmentTimer();
  }

  // ===========================================================================
  // Response
  // ===========================================================================

  setResponse(value: string): void {
    this.response.set(value);

    this.savedState.set('saving');
  }

  markSaved(): void {
    this.savedState.set('saved');
  }

  saveError(): void {
    this.savedState.set('error');
  }

  // ===========================================================================
  // Coding
  // ===========================================================================

  setCodingCode(value: string): void {
    this.codingCode.set(value);

    this.codingSaveState.set('saving');
  }

  setCodingSaveState(value: 'saved' | 'saving' | 'error'): void {
    this.codingSaveState.set(value);
  }

  // ===========================================================================
  // Submit / Terminate
  // ===========================================================================

  submit(): void {
    this.stopTimer();

    this.submitted.set(true);
  }

  terminate(): void {
    this.stopTimer();

    this.expired.set(true);
  }

  // ===========================================================================
  // Helpers
  // ===========================================================================

  private getRoundName(type: string): string {
    switch (type) {
      case 'TechnicalDiscussion':
        return 'Technical Discussion';

      case 'SystemDesign':
        return 'System Design';

      case 'Coding':
        return 'Coding';

      default:
        return type;
    }
  }

  // ===========================================================================
  // Lifecycle
  // ===========================================================================

  constructor() {
    this.destroyRef.onDestroy(() => {
      this.stopTimer();
    });
  }
}
