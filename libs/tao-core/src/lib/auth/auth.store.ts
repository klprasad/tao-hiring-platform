import { Injectable, computed, signal } from '@angular/core';
import { UserSummary } from 'tao-contracts';

@Injectable({ providedIn: 'root' })
export class AuthStore {
  readonly user = signal<UserSummary | null>({
    id: 'recruiter-001',
    displayName: 'Alex Morgan',
    role: 'Talent Operations',
  });

  readonly isAuthenticated = computed(() => this.user() !== null);
}
