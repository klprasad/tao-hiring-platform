/**
 * Normalises the `redirectTo` query parameter into a path the router may visit.
 *
 * The value comes from the URL, so only same-application paths are honoured:
 * absolute and protocol-relative URLs are rejected to keep the parameter from
 * being abused as an open redirect.
 */
export function redirectTarget(value: string | null | undefined, fallback = '/'): string {
  if (!value || !value.startsWith('/') || value.startsWith('//')) {
    return fallback;
  }

  return value;
}
