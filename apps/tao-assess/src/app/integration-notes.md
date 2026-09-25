## Route integration note

The supplied architecture specifies these Assess routes:

/access/:token
/access/:token/auth
/access/:token/landing
/access/:token/consent
/access/:token/browser-check
/access/:token/ready
/session/:sessionId/welcome
/session/:sessionId/question
/session/:sessionId/coding
/session/:sessionId/follow-up
/session/:sessionId/round-transition
/session/:sessionId/recovery
/session/:sessionId/final-review
/session/:sessionId/submitted

The starter uses a shell-level route example and lazy `loadComponent` for feature pages. In production, keep `:token` and `:sessionId` in route params and pass them to typed API commands rather than using the mock store as the source of truth.
