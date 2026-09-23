import { UserSummary } from '../contracts/user-summary';

/**
 * Session storage key the signed-in identity is mirrored under.
 */
export const AUTH_STORAGE_KEY = 'tao.auth.user';

/**
 * Returns the storage to remember identities in, or `null` when the browser
 * exposes none (server-side rendering, blocked cookies, private modes).
 */
function storage(): Storage | null {
  try {
    return typeof sessionStorage === 'undefined' ? null : sessionStorage;
  } catch {
    return null;
  }
}

/**
 * Minimal shape check.
 *
 * The cache only has to carry the fields the shell renders, and validating
 * every field would drop a remembered session whenever the API adds a field or
 * changes a type.
 */
function isUserSummary(value: unknown): value is UserSummary {
  const candidate = value as Partial<UserSummary> | null;

  return (
    typeof candidate === 'object' &&
    candidate !== null &&
    typeof candidate.userId === 'string' &&
    typeof candidate.email === 'string'
  );
}

/**
 * Reads the identity remembered for the current browser session.
 *
 * Missing, unreadable or malformed entries are treated as "nobody is signed
 * in" and removed, so a stale value can never leave the application in a
 * half-broken signed-in state.
 */
export function readStoredUser(): UserSummary | null {
  const store = storage();

  if (!store) {
    return null;
  }

  const raw = store.getItem(AUTH_STORAGE_KEY);

  if (!raw) {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(raw);

    if (isUserSummary(parsed)) {
      return parsed;
    }
  } catch {
    // Fall through and discard the unreadable entry.
  }

  clearStoredUser();

  return null;
}

/**
 * Remembers the identity for the current browser session, so a page reload does
 * not send the user back to the login screen.
 */
export function writeStoredUser(user: UserSummary): void {
  try {
    storage()?.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  } catch {
    // Storage is full or blocked: the session simply does not survive a reload.
  }
}

/** Forgets the remembered identity. */
export function clearStoredUser(): void {
  try {
    storage()?.removeItem(AUTH_STORAGE_KEY);
  } catch {
    // Nothing to clean up when storage is unavailable.
  }
}
