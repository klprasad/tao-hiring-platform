import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthStore } from '@tao/core';

import { redirectTarget } from './redirect-target';

/**
 * `true` when the target is the login route itself, query and fragment aside.
 */
function isLoginRoute(target: string): boolean {
  return target.split(/[?#]/)[0] === '/login';
}

/**
 * Keeps the public entry screen out of reach for visitors who are already
 * signed in.
 *
 * Without this, reloading the login screen — or following a bookmark to it —
 * would show the sign-in form to a user who still has a session.
 */
export const guestGuard: CanActivateFn = (route) => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  if (!authStore.isAuthenticated()) {
    return true;
  }

  const target = redirectTarget(route.queryParamMap.get('redirectTo'));

  // A target pointing back here would bounce forever, so it gets the dashboard.
  return router.parseUrl(isLoginRoute(target) ? '/' : target);
};
