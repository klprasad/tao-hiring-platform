import { Injectable, computed, signal } from '@angular/core';

import { UserSummary } from '../contracts/user-summary';

/**
 * Holds the identity of the signed-in user.
 *
 * This in-memory profile is display state, not proof of authentication. The
 * application must load it from the server's authenticated session.
 */
@Injectable({ providedIn: 'root' })
export class AuthStore {
  private readonly currentUser = signal<UserSummary | null>(null);

  /** Signed-in identity, or `null` when nobody is signed in. */
  readonly user = this.currentUser.asReadonly();

  readonly isAuthenticated = computed(() => this.currentUser() !== null);

  /** Stores the server-verified identity for the current page lifetime. */
  signIn(user: UserSummary): void {
    this.currentUser.set(user);
  }

  /** Clears the signed-in identity. */
  signOut(): void {
    this.currentUser.set(null);
  }
}
