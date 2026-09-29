import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthStore } from '@tao/core';

/**
 * Prevents recruiter routes from rendering until a user is signed in.
 *
 * Visitors are sent to the login screen, which receives the attempted URL so it
 * can send them back after a successful sign-in.
 */
export const authGuard: CanActivateFn = (_route, state) => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  if (authStore.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree(['/login'], { queryParams: { redirectTo: state.url } });
};
