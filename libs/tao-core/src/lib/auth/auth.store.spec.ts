import { beforeEach, describe, expect, it } from 'vitest';
import { TestBed } from '@angular/core/testing';

import { AuthStore } from './auth.store';
import { UserSummary } from '../contracts/user-summary';

const user: UserSummary = {
  id: 'user-1',
  organizationId: 'org-001',
  firstName: 'Alex',
  lastName: 'Morgan',
  email: 'alex.morgan@tao.example',
  role: '1',
  status: '1',
};

describe('AuthStore', () => {
  let store: AuthStore;

  /** Builds a fresh store, as a page reload would. */
  const reloadStore = (): AuthStore => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});

    return TestBed.inject(AuthStore);
  };

  beforeEach(() => {
    store = reloadStore();
  });

  it('should start unauthenticated', () => {
    expect(store.user()).toBeNull();
    expect(store.isAuthenticated()).toBe(false);
  });

  it('should expose the signed-in identity', () => {
    store.signIn(user);

    expect(store.user()).toEqual(user);
    expect(store.isAuthenticated()).toBe(true);
  });

  it('should clear the identity on sign out', () => {
    store.signIn(user);
    store.signOut();

    expect(store.user()).toBeNull();
    expect(store.isAuthenticated()).toBe(false);
  });

  it('should not treat an identity as authenticated after a reload', () => {
    store.signIn(user);

    const reloaded = reloadStore();

    expect(reloaded.user()).toBeNull();
    expect(reloaded.isAuthenticated()).toBe(false);
  });

  it('should stay signed out after a reload when the user signed out', () => {
    store.signIn(user);
    store.signOut();

    expect(reloadStore().user()).toBeNull();
  });
});
