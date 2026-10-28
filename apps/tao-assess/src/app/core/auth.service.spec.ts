import { TestBed } from '@angular/core/testing';
import { describe, expect, it, vi } from 'vitest';
import { of } from 'rxjs';

import { ApiClientService, AuthStore, UserSummary } from '@tao/core';

import { AuthService } from './auth.service';

describe('Assess AuthService', () => {
  it('uses the Assess-scoped login, current-user, and logout routes', async () => {
    const user: UserSummary = {
      id: 'candidate-001',
      organizationId: 'org-001',
      firstName: 'Alex',
      lastName: 'Morgan',
      email: 'alex@example.test',
      role: 'Candidate',
      status: '1',
    };
    const post = vi.fn().mockReturnValue(of(undefined));
    const get = vi.fn().mockReturnValue(of(user));

    TestBed.configureTestingModule({
      providers: [AuthService, AuthStore, { provide: ApiClientService, useValue: { get, post } }],
    });

    const service = TestBed.inject(AuthService);
    await service.signIn({ username: 'alex@example.test', password: 'secret123' });
    await service.signOut();

    expect(post).toHaveBeenNthCalledWith(
      1,
      'api/assess/auth/login',
      { email: 'alex@example.test', password: 'secret123' },
      { skipErrorNotification: true },
    );
    expect(get).toHaveBeenCalledWith('api/assess/auth/me', { skipErrorNotification: true });
    expect(post).toHaveBeenNthCalledWith(2, 'api/assess/auth/logout', undefined, {
      skipErrorNotification: true,
    });
  });
});
