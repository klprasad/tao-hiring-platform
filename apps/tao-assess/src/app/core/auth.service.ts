import { Injectable, inject } from '@angular/core';

import { ApiClientService, AuthStore, UserSummary } from '@tao/core';
import { LoginCredentials } from '@tao/ui';
import { Observable, firstValueFrom } from 'rxjs';
import { loginModelDto } from '../models/login.model';

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
    await firstValueFrom(this.login(credentials));
    const user = await firstValueFrom(this.getCurrentUser());

    this.authStore.signIn(user);
  }

  login(request: LoginCredentials): Observable<void> {
    const payload: loginModelDto = {
      email: request.username,
      password: request.password,
    };
    return this.api.post<void, loginModelDto>(`api/auth/login`, payload, {
      skipErrorNotification: true,
    });
  }

  getCurrentUser(): Observable<UserSummary> {
    return this.api.get<UserSummary>('api/auth/me', { skipErrorNotification: true });
  }

  async restoreSession(): Promise<void> {
    try {
      this.authStore.signIn(await firstValueFrom(this.getCurrentUser()));
    } catch {
      this.authStore.signOut();
    }
  }

  async signOut(): Promise<void> {
    try {
      await firstValueFrom(
        this.api.post<void>('api/auth/logout', undefined, { skipErrorNotification: true }),
      );
    } finally {
      this.authStore.signOut();
    }
  }

  /** Current identity, or `null` when nobody is signed in. */
  get user(): UserSummary | null {
    return this.authStore.user();
  }
}
