import { Injectable, computed, signal, DestroyRef, inject } from '@angular/core';

import { AssessmentQuestionDto, AssessmentSessionVm } from '../models/assessment-session.model';

export type CheckStatus = 'checking' | 'passed' | 'failed';

export type QuestionType = 'technical' | 'follow-up' | 'coding';

export interface QuestionVm {
  id: string;
  number: number;
  total: number;
  type: QuestionType;
  prompt: string;
  response?: string;
  locked: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AssessmentSessionStore {
  private readonly destroyRef = inject(DestroyRef);
  readonly currentQuestion = signal<AssessmentQuestionDto | null>(null);

  readonly isQuestionLoading = signal(false);

  readonly isSubmitting = signal(false);

  readonly questionError = signal<string | null>(null);
  // ---------------------------------------------------------------------------
  // Assessment
  // ---------------------------------------------------------------------------

  readonly assessmentSession = signal<AssessmentSessionVm | null>(null);
  readonly assessmentSessionId = signal<string>('');
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

  // ---------------------------------------------------------------------------
  // Candidate / Assessment state
  // ---------------------------------------------------------------------------

  readonly candidateEmail = signal('john@example.com');

  readonly consentAccepted = signal(false);
  readonly browserReady = signal(false);
  readonly started = signal(false);
  readonly submitted = signal(false);
  readonly expired = signal(false);

  readonly currentRoundIndex = signal(0);
  readonly currentQuestionIndex = signal(0);
  setCurrentQuestion(question: AssessmentQuestionDto): void {
    this.currentQuestion.set(question);
    this.response.set('');
    this.savedState.set('saved');
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
  // ---------------------------------------------------------------------------
  // Answers
  // ---------------------------------------------------------------------------

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

  // ---------------------------------------------------------------------------
  // Current round / question
  // ---------------------------------------------------------------------------

  readonly currentRound = computed(() => {
    const question = this.currentQuestion();

    if (!question) {
      return null;
    }
    return null;
    //return this.landing()?.rounds.find((round) => round.id === question.roundId) ?? null;
  });

  // ---------------------------------------------------------------------------
  // Progress
  // ---------------------------------------------------------------------------

  readonly progressPercent = computed(() => {
    const landing = this.landing();

    if (!landing || landing.rounds.length === 0) {
      return 0;
    }

    const total = landing.rounds.reduce((sum, round) => sum + round.questionCount, 0);

    if (total === 0) {
      return 0;
    }

    const currentRoundIndex = this.currentRoundIndex();
    const currentQuestionIndex = this.currentQuestionIndex();

    const completedBeforeCurrentRound = landing.rounds
      .slice(0, currentRoundIndex)
      .reduce((sum, round) => sum + round.questionCount, 0);

    const completed = completedBeforeCurrentRound + currentQuestionIndex;

    return Math.min(100, Math.round((completed / total) * 100));
  });

  // ---------------------------------------------------------------------------
  // Consent / browser / assessment
  // ---------------------------------------------------------------------------

  acceptConsent(): void {
    this.consentAccepted.set(true);
  }

  markBrowserReady(): void {
    this.browserReady.set(true);
  }

  start(): void {
    this.started.set(true);
  }

  // ---------------------------------------------------------------------------
  // Response
  // ---------------------------------------------------------------------------

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

  // ---------------------------------------------------------------------------
  // Coding
  // ---------------------------------------------------------------------------

  setCodingCode(value: string): void {
    this.codingCode.set(value);
    this.codingSaveState.set('saving');
  }

  setCodingSaveState(value: 'saved' | 'saving' | 'error'): void {
    this.codingSaveState.set(value);
  }

  // ---------------------------------------------------------------------------
  // Navigation
  // ---------------------------------------------------------------------------

  // nextQuestion(): void {
  //   const landing = this.landing();
  //   const round = this.currentRound();

  //   if (!landing || !round) {
  //     return;
  //   }

  //   const nextQuestionIndex = this.currentQuestionIndex() + 1;

  //   // Next question in current round
  //   if (nextQuestionIndex < round.) {
  //     this.currentQuestionIndex.set(nextQuestionIndex);
  //     this.resetQuestionState();

  //     return;
  //   }

  //   // Next round
  //   const nextRoundIndex = this.currentRoundIndex() + 1;

  //   if (nextRoundIndex < landing.rounds.length) {
  //     this.currentRoundIndex.set(nextRoundIndex);
  //     this.currentQuestionIndex.set(0);

  //     this.resetQuestionState();

  //     return;
  //   }

  //   // Assessment completed
  //   this.submit();
  // }

  previousQuestion(): void {
    const round = this.currentRound();

    if (!round) {
      return;
    }

    const currentQuestionIndex = this.currentQuestionIndex();

    if (currentQuestionIndex > 0) {
      this.currentQuestionIndex.set(currentQuestionIndex - 1);

      return;
    }

    const currentRoundIndex = this.currentRoundIndex();

    if (currentRoundIndex > 0) {
      const landing = this.landing();

      if (!landing) {
        return;
      }

      const previousRound = landing.rounds[currentRoundIndex - 1];

      this.currentRoundIndex.set(currentRoundIndex - 1);

      this.currentQuestionIndex.set(previousRound.questionCount - 1);
    }
  }

  private resetQuestionState(): void {
    this.response.set('');
    this.codingCode.set('');
    this.savedState.set('saved');
    this.codingSaveState.set('saved');
  }

  // ---------------------------------------------------------------------------
  // Submit / terminate
  // ---------------------------------------------------------------------------

  submit(): void {
    this.stopTimer();
    this.submitted.set(true);
  }

  terminate(): void {
    this.stopTimer();
    this.expired.set(true);
  }

  // ---------------------------------------------------------------------------
  // Timer
  // ---------------------------------------------------------------------------

  readonly remainingSeconds = signal(0);

  readonly timerRunning = signal(false);

  readonly remainingTime = computed(() => {
    const totalSeconds = this.remainingSeconds();

    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  });

  private timerId: ReturnType<typeof setInterval> | undefined;

  startTimer(durationMinutes: number): void {
    this.stopTimer();

    const durationSeconds = Math.max(0, Math.floor(durationMinutes * 60));

    this.remainingSeconds.set(durationSeconds);

    if (durationSeconds === 0) {
      return;
    }

    this.timerRunning.set(true);

    this.timerId = setInterval(() => {
      const remaining = this.remainingSeconds();

      if (remaining <= 1) {
        this.remainingSeconds.set(0);
        this.stopTimer();

        this.handleTimerExpired();

        return;
      }

      this.remainingSeconds.update((value) => value - 1);
    }, 1000);
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

    // Later you can replace this with:
    // this.nextQuestion();
    // or:
    // this.submit();
  }

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------

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

  private getQuestionType(type: string): QuestionType {
    switch (type) {
      case 'Coding':
        return 'coding';

      case 'TechnicalDiscussion':
        return 'technical';

      case 'SystemDesign':
        return 'technical';

      default:
        return 'technical';
    }
  }

  private getQuestionPrompt(type: string): string {
    switch (type) {
      case 'Coding':
        return 'Design a clean C# solution for processing a stream of orders while keeping memory usage bounded.';

      case 'SystemDesign':
        return 'Design a scalable enterprise application architecture and explain the key technical trade-offs.';

      case 'TechnicalDiscussion':
      default:
        return 'Describe a production problem you solved and explain the technical trade-offs behind your solution.';
    }
  }

  constructor() {
    this.destroyRef.onDestroy(() => {
      this.stopTimer();
    });
  }
}
