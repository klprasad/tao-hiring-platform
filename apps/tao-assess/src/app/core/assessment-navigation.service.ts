import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AssessmentNavigationService {
  private readonly router = inject(Router);
  private readonly accessToken = signal('demo');
  private readonly sessionId = signal('demo');
  access(): Promise<boolean> {
    return this.router.navigate(['/access', this.accessToken()]);
  }

  authentication(): Promise<boolean> {
    return this.router.navigate(['/access', this.accessToken(), 'auth']);
  }

  landing(): Promise<boolean> {
    return this.router.navigate(['/access', this.accessToken(), 'landing']);
  }

  consent(): Promise<boolean> {
    return this.router.navigate(['/access', this.accessToken(), 'consent']);
  }

  browserCheck(): Promise<boolean> {
    return this.router.navigate(['/access', this.accessToken(), 'browser-check']);
  }

  ready(): Promise<boolean> {
    return this.router.navigate(['/access', this.accessToken(), 'ready']);
  }

  sessionWelcome(): Promise<boolean> {
    return this.router.navigate(['/session', this.sessionId(), 'welcome']);
  }

  question(): Promise<boolean> {
    return this.router.navigate(['/session', this.sessionId(), 'question']);
  }

  coding(): Promise<boolean> {
    return this.router.navigate(['/session', this.sessionId(), 'coding']);
  }

  followUp(): Promise<boolean> {
    return this.router.navigate(['/session', this.sessionId(), 'follow-up']);
  }

  recovery(): Promise<boolean> {
    return this.router.navigate(['/session', this.sessionId(), 'recovery']);
  }

  finalReview(): Promise<boolean> {
    return this.router.navigate(['/session', this.sessionId(), 'final-review']);
  }

  submitted(): Promise<boolean> {
    return this.router.navigate(['/session', this.sessionId(), 'submitted']);
  }
}
