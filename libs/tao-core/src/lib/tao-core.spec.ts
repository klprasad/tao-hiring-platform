import { TestBed } from '@angular/core/testing';
import { AuthStore } from './auth/auth.store';

describe('AuthStore', () => {
  it('starts with the mock recruiter session', () => {
    const store = TestBed.inject(AuthStore);

    expect(store.user()?.displayName).toBe('Alex Morgan');
    expect(store.isAuthenticated()).toBe(true);
  });
});
