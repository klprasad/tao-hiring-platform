import { Injectable, inject } from '@angular/core';

import { ApiClientService, AuthStore, UserSummary } from '@tao/core';
import { LoginCredentials } from '@tao/ui';
import { Observable, firstValueFrom } from 'rxjs';
import { loginModelDto } from '../../features/login/models/login.model';

/**
 * Placeholder sign-in.
 *
 * The platform has no authentication endpoint yet (see `copilot.md`), so
 * `signIn` turns credentials that already passed form validation into a local
 * identity. It does **not** verify the credentials, and it stores neither the
 * password nor a token.
 *
 * Replace this implementation with the real API call before treating the login
 * screen as a security boundary.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly authStore = inject(AuthStore);
  private readonly api = inject(ApiClientService);
  /**
   * Signs the given user in.
   *
   * Resolves only once the identity is stored, so callers can safely navigate
   * to a guarded route right after awaiting it. Errors are rethrown so they
   * surface in the caller's `catch` block.
   */
  async signIn(credentials: LoginCredentials): Promise<void> {
    const user = await firstValueFrom(this.login(credentials));

    this.authStore.signIn(user);
  }

  login(request: LoginCredentials): Observable<UserSummary> {
    const payload: loginModelDto = {
      email: request.username,
      password: request.password,
    };
    return this.api.post<UserSummary, loginModelDto>(`api/auth/login`, payload);
  }
  /** Signs the current user out. */
  signOut(): void {
    this.authStore.signOut();
  }

  /** Current identity, or `null` when nobody is signed in. */
  get user(): UserSummary | null {
    return this.authStore.user();
  }
}
