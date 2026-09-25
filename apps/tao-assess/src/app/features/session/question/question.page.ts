import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AssessmentSessionStore } from '../../../core/assessment-session.store';
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
  private readonly router = inject(Router);
  response = '';
  constructor() {
    effect(() => {
      this.response = this.store.response();
    });
  }
  onResponse(value: string): void {
    this.response = value;
    this.store.setResponse(value);
  }
  next(): void {
    this.store.markSaved();
    if (this.store.currentRound().type === 'coding') {
      this.router.navigate(['/session/demo-session/coding']);
      return;
    }
    const last = this.store.currentQuestionIndex() + 1 >= this.store.currentRound().questionCount;
    const lastRound = this.store.currentRoundIndex() + 1 >= this.store.landing().rounds.length;
    this.store.nextQuestion();
    if (last && lastRound) this.router.navigate(['/session/demo-session/final-review']);
    else if (last) this.router.navigate(['/session/demo-session/round-transition']);
    else this.router.navigate(['/session/demo-session/question']);
  }
  followUp(): void {
    this.router.navigate(['/session/demo-session/follow-up']);
  }
}
