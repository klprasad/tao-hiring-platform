import { Injectable, computed, signal } from '@angular/core';

import { clearStoredUser, readStoredUser, writeStoredUser } from './auth-storage';
import { UserSummary } from '../contracts/user-summary';

/**
 * Holds the identity of the signed-in user.
 *
 * The store only keeps the current identity; verifying credentials belongs to
 * the consuming application. It is not production authentication: no token is
 * stored, and nothing is verified against a server.
 *
 * The identity is mirrored in session storage so a page reload keeps the user
 * signed in. It is deliberately session-scoped: without a token there is
 * nothing to revoke, so the session ends when the tab does.
 */
@Injectable({ providedIn: 'root' })
export class AuthStore {
  private readonly currentUser = signal<UserSummary | null>(readStoredUser());

  /** Signed-in identity, or `null` when nobody is signed in. */
  readonly user = this.currentUser.asReadonly();

  readonly isAuthenticated = computed(() => this.currentUser() !== null);

  /** Stores the signed-in identity for the rest of the browser session. */
  signIn(user: UserSummary): void {
    this.currentUser.set(user);
    writeStoredUser(user);
  }

  /** Clears the signed-in identity. */
  signOut(): void {
    this.currentUser.set(null);
    clearStoredUser();
  }
}
