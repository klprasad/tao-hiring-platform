import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  convertToParamMap,
  provideRouter,
} from '@angular/router';
import { AuthStore, UserSummary } from '@tao/core';

import { guestGuard } from './guest.guard';

const recruiter: UserSummary = {
  id: 'recruiter-001',
  organizationId: 'org-001',
  firstName: 'Alex',
  lastName: 'Morgan',
  email: 'alex.morgan@tao.example',
  role: '1',
  status: '1',
};

describe('guestGuard', () => {
  beforeEach(() => {
    // A signed-in identity survives a reload, so every test starts from a clean session.
    sessionStorage.clear();

    TestBed.configureTestingModule({ providers: [provideRouter([])] });
  });

  const runGuard = (redirectTo?: string) =>
    TestBed.runInInjectionContext(() =>
      guestGuard(
        {
          queryParamMap: convertToParamMap(redirectTo ? { redirectTo } : {}),
        } as ActivatedRouteSnapshot,
        {} as RouterStateSnapshot,
      ),
    );

  const signIn = (): void => {
    TestBed.inject(AuthStore).signIn(recruiter);
  };

  it('lets visitors without a session reach the login screen', () => {
    expect(runGuard()).toBe(true);
  });

  it('sends a signed-in user to the dashboard', () => {
    signIn();

    expect((runGuard() as UrlTree).toString()).toBe('/');
  });

  it('sends a signed-in user to the route they were heading for', () => {
    signIn();

    expect((runGuard('/campaigns') as UrlTree).toString()).toBe('/campaigns');
  });

  it('ignores a redirect target outside the application', () => {
    signIn();

    expect((runGuard('https://evil.example/login') as UrlTree).toString()).toBe('/');
    expect((runGuard('//evil.example') as UrlTree).toString()).toBe('/');
  });

  it('does not send a signed-in user back to the login screen', () => {
    signIn();

    expect((runGuard('/login') as UrlTree).toString()).toBe('/');
    expect((runGuard('/login?redirectTo=%2Flogin') as UrlTree).toString()).toBe('/');
  });
});
