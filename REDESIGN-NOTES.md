# TAO UI layout redesign notes

This pass addresses the prior theme-only delivery by changing page composition and information hierarchy in addition to the shared visual system.

## Acquire screen composition updates

- Dashboard: recruiter command-centre layout with greeting/action header, three KPI tiles, priority queue and active-campaign list.
- Campaign directory: searchable campaign table framed by a workspace heading and role count.
- Campaign overview: workflow stepper paired with a separate campaign summary panel.
- Campaign creation: setup guidance rail paired with the campaign form.
- Job profile setup: create and review forms use the same campaign workflow header; the generated profile review retains its document-and-approval-rail layout.
- Hiring strategy: generated profile is organized into experience and threshold metrics, skill groups, recruiter guidance, and approval state/actions.
- Resume imports: intake guidance and supported file constraints are paired with a focused upload surface.
- Job profile review: generated profile document canvas paired with a persistent approval/action rail.
- Candidate screening: summary/filter tiles and structured candidate review table with distinct identity, match, status and activity columns.
- Invitations: guidance panel paired with a focused invitation editor.
- Reports: KPI row and comparative campaign performance view with conversion bars.
- Assessment strategy: concise campaign header and metrics lead into the round editor.
- Assessment results: candidate list and question-level drilldown sit within a consistent campaign workspace frame.
- Login and access-denied remain focused, standalone entry states outside the recruiter shell.

## Assess screen composition updates

- Secure access: branded introduction panel paired with a separate access form.
- Assessment overview: assessment structure and instructions in the primary column, preparation context in a secondary rail.
- Candidate session: full-width, focused question and response flow rather than a split question/answer layout.
- Coding: dedicated problem rail and larger editor canvas.
- Candidate shell: quiet, distraction-reduced frame with theme switching hidden from the candidate flow.
- Removed candidate-visible question totals from the landing and active question header; follow-up limits remain opaque.

## Implementation constraints

- Existing route structure, API calls, form controls, state, events and business logic are preserved.
- Acquire workspace layouts adapt to tablet and mobile widths; the campaign workflow itself remains optimized for desktop use.
- Validation: the Acquire development build succeeds. The test target reports 49 passing tests and one existing `AssessmentOverview` failure because app configuration is not initialized in that smoke test. The production build is blocked by its configured initial-bundle budget (1.01 MB against 1.00 MB) and two component-style budgets in assessment results/round components.
