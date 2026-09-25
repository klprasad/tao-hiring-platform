import { Injectable, computed, signal } from '@angular/core';

export type CheckStatus = 'checking' | 'passed' | 'failed';

export interface AssessmentRoundVm {
  id: string;
  order: number;
  name: string;
  durationMinutes: number;
  questionCount: number;
  type: 'technical' | 'coding' | 'system-design';
}

export interface AssessmentLandingVm {
  organizationName: string;
  roleTitle: string;
  durationMinutes: number;
  rounds: AssessmentRoundVm[];
  instructions: string[];
}

export interface QuestionVm {
  id: string;
  number: number;
  total: number;
  type: 'technical' | 'follow-up' | 'coding';
  prompt: string;
  response?: string;
  locked: boolean;
}

@Injectable({ providedIn: 'root' })
export class AssessmentSessionStore {
  readonly landing = signal<AssessmentLandingVm>({
    organizationName: 'Acme Corporation',
    roleTitle: 'Senior .NET Engineer Technical Assessment',
    durationMinutes: 105,
    rounds: [
      {
        id: 'r1',
        order: 1,
        name: 'Technical Discussion',
        durationMinutes: 30,
        questionCount: 4,
        type: 'technical',
      },
      { id: 'r2', order: 2, name: 'Coding', durationMinutes: 45, questionCount: 2, type: 'coding' },
      {
        id: 'r3',
        order: 3,
        name: 'System Design',
        durationMinutes: 30,
        questionCount: 2,
        type: 'system-design',
      },
    ],
    instructions: [
      'Answer each question in your own words.',
      'Once you continue, the previous question is locked.',
      'Your responses are saved automatically during the assessment.',
      'Keep this browser window open until you submit the assessment.',
    ],
  });

  readonly candidateEmail = signal('john@example.com');
  readonly consentAccepted = signal(false);
  readonly browserReady = signal(false);
  readonly started = signal(false);
  readonly submitted = signal(false);
  readonly expired = signal(false);
  readonly currentRoundIndex = signal(0);
  readonly currentQuestionIndex = signal(0);
  readonly response = signal('');
  readonly codingCode = signal(
    `public class Solution {\n    public void Process()\n    {\n        // Write your solution here\n    }\n}`,
  );
  readonly savedState = signal<'saved' | 'saving' | 'error'>('saved');
  readonly codingSaveState = signal<'saved' | 'saving' | 'error'>('saved');
  readonly timeRemainingSeconds = signal(105 * 60);

  readonly currentRound = computed(() => this.landing().rounds[this.currentRoundIndex()]);
  readonly currentQuestion = computed<QuestionVm>(() => ({
    id: `${this.currentRound().id}-q${this.currentQuestionIndex() + 1}`,
    number: this.currentQuestionIndex() + 1,
    total: this.currentRound().questionCount,
    type: this.currentRound().type === 'coding' ? 'coding' : 'technical',
    prompt:
      this.currentRound().type === 'coding'
        ? 'Design a clean C# solution for processing a stream of orders while keeping memory usage bounded.'
        : 'Describe a production problem you solved and explain the technical trade-offs behind your solution.',
    response: this.response(),
    locked: false,
  }));

  readonly progressPercent = computed(() => {
    const total = this.landing().rounds.reduce((sum, round) => sum + round.questionCount, 0);
    const completed =
      this.landing()
        .rounds.slice(0, this.currentRoundIndex())
        .reduce((sum, round) => sum + round.questionCount, 0) + this.currentQuestionIndex();
    return Math.round((completed / total) * 100);
  });

  acceptConsent(): void {
    this.consentAccepted.set(true);
  }
  markBrowserReady(): void {
    this.browserReady.set(true);
  }
  start(): void {
    this.started.set(true);
  }
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
  setCodingCode(value: string): void {
    this.codingCode.set(value);
  }
  setCodingSaveState(value: 'saved' | 'saving' | 'error'): void {
    this.codingSaveState.set(value);
  }

  nextQuestion(): void {
    if (this.currentQuestionIndex() + 1 < this.currentRound().questionCount) {
      this.currentQuestionIndex.update((value) => value + 1);
      this.response.set('');
      return;
    }
    if (this.currentRoundIndex() + 1 < this.landing().rounds.length) {
      this.currentRoundIndex.update((value) => value + 1);
      this.currentQuestionIndex.set(0);
      this.response.set('');
    }
  }

  submit(): void {
    this.submitted.set(true);
  }
  terminate(): void {
    this.expired.set(true);
  }
  readonly remainingSeconds = signal(0);
  readonly timerRunning = signal(false);

  private timerId?: ReturnType<typeof setInterval>;

  startTimer(durationMinutes: number): void {
    this.stopTimer();

    this.remainingSeconds.set(durationMinutes * 60);
    this.timerRunning.set(true);

    this.timerId = setInterval(() => {
      const remaining = this.remainingSeconds();

      if (remaining <= 1) {
        this.remainingSeconds.set(0);
        this.stopTimer();

        // TODO: automatically submit/move to next question
        return;
      }

      this.remainingSeconds.set(remaining - 1);
    }, 1000);
  }

  stopTimer(): void {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = undefined;
    }

    this.timerRunning.set(false);
  }
  readonly remainingTime = computed(() => {
    const totalSeconds = this.remainingSeconds();

    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  });
}
