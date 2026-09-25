import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AssessmentNavigationService {
  private readonly router = inject(Router);

  access(token: string): Promise<boolean> {
    return this.router.navigate(['/access', token]);
  }

  authentication(token: string): Promise<boolean> {
    return this.router.navigate(['/access', token, 'auth']);
  }

  landing(token: string): Promise<boolean> {
    return this.router.navigate(['/access', token, 'landing']);
  }

  consent(token: string): Promise<boolean> {
    return this.router.navigate(['/access', token, 'consent']);
  }

  browserCheck(token: string): Promise<boolean> {
    return this.router.navigate(['/access', token, 'browser-check']);
  }

  ready(token: string): Promise<boolean> {
    return this.router.navigate(['/access', token, 'ready']);
  }

  sessionWelcome(sessionId: string): Promise<boolean> {
    return this.router.navigate(['/session', sessionId, 'welcome']);
  }

  question(sessionId: string): Promise<boolean> {
    return this.router.navigate(['/session', sessionId, 'question']);
  }

  coding(sessionId: string): Promise<boolean> {
    return this.router.navigate(['/session', sessionId, 'coding']);
  }

  followUp(sessionId: string): Promise<boolean> {
    return this.router.navigate(['/session', sessionId, 'follow-up']);
  }

  recovery(sessionId: string): Promise<boolean> {
    return this.router.navigate(['/session', sessionId, 'recovery']);
  }

  finalReview(sessionId: string): Promise<boolean> {
    return this.router.navigate(['/session', sessionId, 'final-review']);
  }

  submitted(sessionId: string): Promise<boolean> {
    return this.router.navigate(['/session', sessionId, 'submitted']);
  }
}
