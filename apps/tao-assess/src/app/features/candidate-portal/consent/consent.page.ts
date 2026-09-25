import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AssessmentSessionStore } from '../../../core/assessment-session.store';

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
  readonly router = inject(Router);
  accepted = false;
  private readonly route = inject(ActivatedRoute);

  continue(): void {
    this.store.acceptConsent();
    this.router.navigate(['']);
    this.router.navigate(['../browser-check'], { relativeTo: this.route });
  }
}
