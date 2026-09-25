import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AssessmentSessionStore } from '../../../core/assessment-session.store';
import { AssessmentNavigationService } from '../../../core/assessment-navigation.service';

interface ConsentItem {
  id: string;
  text: string;
  accepted: boolean;
}

@Component({
  selector: 'tao-consent',
  standalone: true,
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './consent.page.html',
  styleUrl: './consent.page.scss',
})
export class ConsentPage {
  readonly store = inject(AssessmentSessionStore);

  private readonly assessmentNavigationService = inject(AssessmentNavigationService);

  readonly consents = signal<ConsentItem[]>([
    {
      id: 'ai-interview',
      text: 'I understand that the assessment will be conducted as an AI-guided technical interview.',
      accepted: false,
    },
    {
      id: 'assessment-terms',
      text: 'I agree to the assessment terms.',
      accepted: false,
    },
    {
      id: 'no-return',
      text: 'I understand that once I move past a question, I cannot return to it.',
      accepted: false,
    },
  ]);

  readonly allAccepted = computed(
    () => this.consents().length > 0 && this.consents().every((consent) => consent.accepted),
  );

  updateConsent(id: string, accepted: boolean): void {
    this.consents.update((items) =>
      items.map((item) => (item.id === id ? { ...item, accepted } : item)),
    );
  }

  continue(): void {
    if (!this.allAccepted()) {
      return;
    }

    this.store.acceptConsent();
    this.assessmentNavigationService.browserCheck();
  }

  back(): void {
    this.assessmentNavigationService.landing();
  }
}
