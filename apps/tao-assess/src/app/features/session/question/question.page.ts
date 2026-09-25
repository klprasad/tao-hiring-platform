import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AssessmentSessionStore } from '../../../core/assessment-session.store';
import { AssessmentNavigationService } from '../../../core/assessment-navigation.service';

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

  private readonly assessmentNavigationService = inject(AssessmentNavigationService);

  readonly response = signal('');

  readonly canContinue = computed(() => {
    const response = this.response().trim();

    return response.length > 0 && this.store.savedState() !== 'saving';
  });

  constructor() {
    this.response.set(this.store.response());
    const duration = this.store.currentRound().durationMinutes;
    if (!this.store.timerRunning()) {
      this.store.startTimer(duration);
    }
  }

  onResponse(value: string): void {
    this.response.set(value);
    this.store.setResponse(value);
  }

  next(): void {
    if (!this.canContinue()) {
      return;
    }

    this.store.markSaved();

    const currentRound = this.store.currentRound();
    const currentQuestionIndex = this.store.currentQuestionIndex();
    const currentRoundIndex = this.store.currentRoundIndex();
    const landing = this.store.landing();

    if (currentRound.type === 'coding') {
      this.assessmentNavigationService.coding();
      return;
    }

    const isLastQuestion = currentQuestionIndex + 1 >= currentRound.questionCount;

    const isLastRound = currentRoundIndex + 1 >= landing.rounds.length;

    this.store.nextQuestion();

    if (isLastQuestion && isLastRound) {
      this.assessmentNavigationService.finalReview();
      return;
    }

    this.assessmentNavigationService.question();
  }

  followUp(): void {
    this.assessmentNavigationService.followUp();
  }
}
