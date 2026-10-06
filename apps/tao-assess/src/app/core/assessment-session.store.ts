import { computed, DestroyRef, inject, Injectable, signal } from '@angular/core';

import {
  AssessmentQuestionDto,
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

  readonly invitationId = signal<string | null>(null);
  readonly candidateApplicationId = signal<string | null>(null);
  readonly assessmentStategyId = signal<string | null>(null);
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

  readonly completionPercentage = computed(() => this.currentRound()?.completionPercentage ?? 0);

  readonly totalRounds = computed(() => this.assessmentWorkflow()?.totalRounds ?? 0);

  readonly completedRounds = computed(() => this.assessmentWorkflow()?.completedRounds ?? 0);

  readonly remainingRounds = computed(() => this.assessmentWorkflow()?.remainingRounds ?? 0);

  readonly totalQuestions = computed(() => this.currentRound()?.totalQuestions ?? 0);

  // readonly completedQuestions = computed(() => this.assessmentWorkflow()?.completedQuestions ?? 0);

  // readonly skippedQuestions = computed(() => this.assessmentWorkflow()?.skippedQuestions ?? 0);

  // readonly remainingQuestions = computed(() => this.assessmentWorkflow()?.remainingQuestions ?? 0);

  /**
   * Backend authoritative assessment progress.
   */
  readonly progressPercent = computed(() => this.currentRound()?.completionPercentage ?? 0);

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
   * Current main-question number inside the current round.
   *
   * Follow-up questions do not increase this number because
   * they belong to the same main question.
   */
  readonly currentQuestionNumber = computed(() => {
    const round = this.currentRound();

    const completed = round?.completedQuestions ?? 0;

    const skipped = round?.skippedQuestions ?? 0;

    return completed + skipped + 1;
  });

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

  /**
   * Remaining time in the current round.
   *
   * This is always calculated from the current round's
   * durationInMinutes.
   */
  readonly remainingSeconds = signal(0);

  readonly timerRunning = signal(false);

  /**
   * Current round duration in seconds.
   *
   * Example:
   *
   * durationInMinutes = 45
   * => 2700 seconds
   */
  readonly roundDurationSeconds = computed(() => {
    const durationMinutes = this.currentRound()?.durationInMinutes ?? 0;

    return Math.max(0, durationMinutes * 60);
  });

  /**
   * Local round expiry timestamp.
   *
   * This is recalculated whenever a new round starts.
   */
  private roundExpiresAt: number | null = null;

  /**
   * True when the current round timer has expired.
   */
  readonly isTimerExpired = computed(() => this.timerRunning() && this.remainingSeconds() <= 0);

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
   * MM:SS normally.
   *
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
   * Remaining timer percentage.
   *
   * Example:
   *
   * 45 minute round
   * 45:00 => 100
   * 22:30 => 50
   * 00:00 => 0
   */
  readonly timerPercent = computed(() => {
    const total = this.roundDurationSeconds();

    const remaining = this.remainingSeconds();

    if (total <= 0) {
      return 0;
    }

    return Math.min(100, Math.max(0, Math.round((remaining / total) * 100)));
  });

  private timerId: ReturnType<typeof setInterval> | undefined;

  // ===========================================================================
  // Timer Methods
  // ===========================================================================

  /**
   * Start/restart the timer for the current round.
   *
   * The duration comes from:
   *
   * currentRound().durationInMinutes
   *
   * We calculate against an absolute expiry timestamp
   * instead of blindly decrementing remainingSeconds.
   */
  startRoundTimer(): void {
    this.stopTimer();

    const durationSeconds = this.roundDurationSeconds();

    if (durationSeconds <= 0) {
      this.remainingSeconds.set(0);
      this.roundExpiresAt = null;
      return;
    }

    const startedAt = Date.now();

    this.roundExpiresAt = startedAt + durationSeconds * 1000;

    const updateRemainingTime = (): void => {
      if (this.roundExpiresAt === null) {
        this.stopTimer();
        return;
      }

      const remaining = Math.max(0, Math.ceil((this.roundExpiresAt - Date.now()) / 1000));

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

  /**
   * Stop the current round timer.
   */
  stopTimer(): void {
    if (this.timerId !== undefined) {
      clearInterval(this.timerId);
      this.timerId = undefined;
    }

    this.timerRunning.set(false);
  }

  /**
   * Reset timer without starting it.
   */
  resetTimer(): void {
    this.stopTimer();

    this.roundExpiresAt = null;
    this.remainingSeconds.set(this.roundDurationSeconds());
  }

  /**
   * Handle round timer expiration.
   */
  private handleTimerExpired(): void {
    this.expired.set(true);
    this.timerRunning.set(false);
  }

  // ===========================================================================
  // Workflow
  // ===========================================================================

  /**
   * Store authoritative workflow state.
   *
   * The timer is restarted only when the backend
   * moves the assessment to another round.
   *
   * Follow-up questions remain in the same round,
   * therefore they do not restart the timer.
   */
  setAssessmentWorkflow(workflow: AssessmentSessionWorkflowDto): void {
    const previousRoundId = this.assessmentWorkflow()?.currentRoundId;

    const newRoundId = workflow.currentRoundId;

    this.assessmentWorkflow.set(workflow);

    this.syncWorkflowState(workflow);

    if (workflow.status !== 'InProgress') {
      this.stopTimer();
      return;
    }

    /**
     * First workflow load OR round changed.
     */
    if (previousRoundId !== newRoundId) {
      this.startRoundTimer();
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

    this.startRoundTimer();
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
