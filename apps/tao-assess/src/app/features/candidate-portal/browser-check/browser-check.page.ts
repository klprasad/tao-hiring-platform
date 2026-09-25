import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { AssessmentSessionStore, CheckStatus } from '../../../core/assessment-session.store';

import { AssessmentNavigationService } from '../../../core/assessment-navigation.service';

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

  private readonly assessmentNavigationService = inject(AssessmentNavigationService);

  readonly checks = signal<Check[]>([]);

  constructor() {
    this.runChecks();

    window.addEventListener('online', this.handleConnectionChange);
    window.addEventListener('offline', this.handleConnectionChange);
    window.addEventListener('resize', this.handleResize);
  }

  private readonly handleConnectionChange = (): void => {
    this.updateCheck('Network connection', this.checkNetworkConnection());
  };

  private readonly handleResize = (): void => {
    this.updateCheck('Screen size supported', this.checkScreenSize());
  };

  private runChecks(): void {
    this.checks.set([
      this.checkBrowser(),
      this.checkJavaScript(),
      this.checkNetworkConnection(),
      this.checkScreenSize(),
    ]);
  }

  private checkBrowser(): Check {
    const supported =
      typeof window !== 'undefined' &&
      typeof navigator !== 'undefined' &&
      'fetch' in window &&
      'Promise' in window;

    return {
      label: 'Browser supported',
      detail: supported
        ? `${this.getBrowserName()} is supported.`
        : 'Your browser is not supported.',
      status: supported ? 'passed' : 'failed',
    };
  }

  private checkJavaScript(): Check {
    // If this Angular component is executing, JavaScript is enabled.
    return {
      label: 'JavaScript enabled',
      detail: 'JavaScript is available.',
      status: 'passed',
    };
  }

  private checkNetworkConnection(): Check {
    const connected = navigator.onLine;

    return {
      label: 'Network connection',
      detail: connected
        ? 'Your device is connected to the network.'
        : 'No network connection detected.',
      status: connected ? 'passed' : 'failed',
    };
  }

  private checkScreenSize(): Check {
    const minWidth = 1024;
    const minHeight = 600;

    const supported = window.innerWidth >= minWidth && window.innerHeight >= minHeight;

    return {
      label: 'Screen size supported',
      detail: supported
        ? `Display size: ${window.innerWidth} × ${window.innerHeight}.`
        : `A minimum screen size of ${minWidth} × ${minHeight} is required.`,
      status: supported ? 'passed' : 'failed',
    };
  }

  private getBrowserName(): string {
    const userAgent = navigator.userAgent;

    if (userAgent.includes('Edg/')) {
      return 'Microsoft Edge';
    }

    if (userAgent.includes('Chrome/')) {
      return 'Google Chrome';
    }

    if (userAgent.includes('Firefox/')) {
      return 'Mozilla Firefox';
    }

    if (userAgent.includes('Safari/') && !userAgent.includes('Chrome/')) {
      return 'Safari';
    }

    return 'Your browser';
  }

  private updateCheck(label: string, check: Check): void {
    this.checks.update((checks) => checks.map((item) => (item.label === label ? check : item)));
  }

  get canContinue(): boolean {
    return this.checks().every((check) => check.status === 'passed');
  }

  back() {
    this.assessmentNavigationService.consent();
  }
  continue(): void {
    if (!this.canContinue) {
      return;
    }

    this.store.markBrowserReady();
    this.assessmentNavigationService.ready();
  }

  ngOnDestroy(): void {
    window.removeEventListener('online', this.handleConnectionChange);
    window.removeEventListener('offline', this.handleConnectionChange);
    window.removeEventListener('resize', this.handleResize);
  }
}
