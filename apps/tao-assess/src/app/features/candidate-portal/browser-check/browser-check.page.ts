import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AssessmentSessionStore, CheckStatus } from '../../../core/assessment-session.store';

interface Check {
  label: string;
  detail: string;
  status: CheckStatus;
}
@Component({
  selector: 'tao-browser-check',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './browser-check.page.html',
  styleUrl: './browser-check.page.scss',
})
export class BrowserCheckPage {
  readonly store = inject(AssessmentSessionStore);
  readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  readonly checks = signal<Check[]>([
    {
      label: 'Browser supported',
      detail: 'Your current browser supports the assessment experience.',
      status: 'passed',
    },
    { label: 'JavaScript enabled', detail: 'JavaScript is available.', status: 'passed' },
    { label: 'Network connection', detail: 'Connection is available.', status: 'passed' },
    {
      label: 'Screen size supported',
      detail: 'Your display meets the desktop assessment requirement.',
      status: 'passed',
    },
  ]);
  continue(): void {
    this.store.markBrowserReady();
    this.router.navigate(['../ready'], { relativeTo: this.route });
  }
}
