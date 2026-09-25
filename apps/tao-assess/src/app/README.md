# TAO Assess — Candidate Feature Pack

Desktop-first Angular 22 standalone implementation starter for the TAO Assess candidate flow.

Implemented C01–C15:
- Secure Access
- Candidate Authentication
- Assessment Landing
- Consent
- Browser/System Check
- Assessment Ready
- AI Welcome
- Technical Question
- Coding Workspace
- AI Follow-up
- Unable-to-answer / round transition states
- Recovery
- Final Review
- Submit Confirmation
- Expired / Terminated

The implementation follows the supplied TAO specifications: separate candidate shell, no recruiter navigation, candidate-safe data, server-authoritative workflow placeholders, signal-based local UI state, lazy feature routes, and desktop MVP styling.

## Integration

Copy the `features`, `core`, and `shell` folders into `apps/tao-assess/src/app/` and merge `app.routes.ts` with `candidate-portal.routes.ts`.

The mock session store is intentionally isolated. Replace its command methods with typed API calls when your assessment API is ready.
