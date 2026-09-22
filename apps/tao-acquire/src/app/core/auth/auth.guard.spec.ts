import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  provideRouter,
} from '@angular/router';
import { AuthStore, UserSummary } from '@tao/core';

import { authGuard } from './auth.guard';

const recruiter: UserSummary = {
  id: 'recruiter-001',
  organizationId: 'org-001',
  firstName: 'Alex',
  lastName: 'Morgan',
  email: 'alex.morgan@tao.example',
  role: '1',
  status: '1',
};

describe('authGuard', () => {
  beforeEach(() => {
    // A signed-in identity survives a reload, so every test starts from a clean session.
    sessionStorage.clear();

    TestBed.configureTestingModule({ providers: [provideRouter([])] });
  });

  const runGuard = (url: string) =>
    TestBed.runInInjectionContext(() =>
      authGuard({} as ActivatedRouteSnapshot, { url } as RouterStateSnapshot),
    );

  it('sends unauthenticated visitors to the login screen', () => {
    const result = runGuard('/campaigns');

    expect(result).toBeInstanceOf(UrlTree);

    const tree = result as UrlTree;

    expect(tree.toString()).toContain('/login');
    expect(tree.queryParams['redirectTo']).toBe('/campaigns');
  });

  it('allows signed-in users through', () => {
    TestBed.inject(AuthStore).signIn(recruiter);

    expect(runGuard('/campaigns')).toBe(true);
  });
});
