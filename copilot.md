# AI Engineering Instructions

- This file is the primary engineering context for AI coding agents working in this repository.

## Mandatory Rules

- READ THIS FILE BEFORE MODIFYING CODE.
- Follow existing architecture before introducing new patterns.
- Search the repository for an existing implementation before creating a new one.
- Prefer reuse over duplication.
- Do not introduce dependencies without justification.
- Do not modify unrelated files.
- Do not perform opportunistic refactoring.
- Do not invent APIs, database objects, configuration, or business rules.
- Preserve existing behavior unless the requested change requires otherwise.
- Add/update tests for behavior changes.
- Run appropriate validation after implementation.
- Report validation failures honestly.
- Update this file when a project-wide convention or architectural decision changes.

# TAO Hiring Platform: AI Agent Context

This file is the operating manual for AI coding agents working in this repository. It describes the current workspace, not a target architecture. Read it before changing code and update it when a meaningful project-wide convention changes.

## AI Agent Quick Reference

- **Project:** Angular workspace for two independently deployable talent-acquisition applications.
- **Applications:** `tao-acquire` is the recruiter application; `tao-assess` is the candidate assessment-access application.
- **Libraries:** `tao-ui`, `tao-core`, `tao-contracts`, and `tao-utils`.
- **Technology:** Angular 22.1.x, TypeScript 6.0.x, RxJS 7.8, Angular Material/CDK 22.1.x, SCSS, npm 11, Vitest through Angular CLI.
- **Architecture:** Standalone Angular components, feature-based application folders, lazy route boundaries in Acquire, shared library public APIs, signals for local state, and a small HTTP/configuration boundary.
- **Important directories:** `apps/` for deployable applications, `libs/` for reusable code, `docs/` for product and architecture specifications, `tools/` for generators/scripts.
- **Install:** `npm install`
- **Build:** `npm run build:all` or `npm run build:acquire` / `npm run build:assess`
- **Run:** `npm run start:acquire`; `npm run start:assess -- --port 4201`
- **Test:** `npm test`; focused example: `npx ng test tao-ui`
- **Format:** `npm run format:check`; apply with `npm run format`
- **Critical rules:** preserve app/library boundaries, use existing standalone/signal/form patterns, do not invent backend/database behavior, do not commit secrets, and validate changes with the narrowest relevant command.

## Current Repository Map

```text
tao-hiring-platform/
├── apps/
│   ├── tao-acquire/
│   │   ├── public/
│   │   └── src/
│   │       ├── app/
│   │       │   ├── core/                 # API client, auth/configuration boundary
│   │       │   └── features/             # Recruiter feature slices and routes
│   │       ├── assets/config/             # Runtime app-config.json
│   │       ├── main.ts
│   │       └── styles.scss
│   └── tao-assess/
│       ├── public/
│       └── src/
│           ├── app/features/access/      # Candidate access page
│           ├── main.ts
│           └── styles.scss
├── libs/
│   ├── tao-ui/                            # Shared standalone controls and feature controls
│   ├── tao-core/                          # Shared infrastructure; currently AuthStore
│   ├── tao-contracts/                     # Shared TypeScript contracts/view-facing models
│   └── tao-utils/                         # Validators, regex patterns, and formatting helpers
├── docs/                                  # Architecture, API, UI notes, and specifications
├── tools/                                 # Generators and maintenance scripts (currently sparse)
├── angular.json                           # Angular project registry and build/test targets
├── package.json                           # npm scripts and dependencies
├── package-lock.json                      # Locked npm dependency tree
├── tsconfig.json                          # Shared compiler options and library path aliases
├── .editorconfig                          # Two-space source formatting
├── .prettierrc                            # Prettier rules
└── README.md
```

`node_modules/`, `dist/`, `.angular/`, and coverage/build output are generated or local-only and must not be edited or committed. The repository currently has no `.csproj`, `.sln`, C# source, database scripts, Dockerfile, compose file, or CI workflow. The requested .NET, EF Core, controller, MediatR, CQRS, migration, and database sections therefore have no implemented project surface to document.

### Application directories

- `apps/tao-acquire/src/app/core/` owns application-wide API communication and runtime configuration. Feature-specific API services should be placed under the relevant feature `data-access/` folder and use the shared client.
- `apps/tao-acquire/src/app/features/` contains recruiter slices: campaigns, candidates, assessments, dashboard, hiring strategy, invitations, reports, and resume process. A feature may contain `pages/`, `components/`, `models/`, `data-access/`, and its route file.
- `apps/tao-assess/src/app/features/access/` contains the current candidate entry experience. It is intentionally isolated from Acquire navigation.
- `apps/*/src/main.ts`, `app.ts`, `app.config.ts`, `app.routes.ts`, and global styles are application composition points. Feature business behavior does not belong there.

### Library directories

- `libs/tao-ui/src/lib/native-controls/` contains reusable low-level controls such as button, input, select, textarea, dialog, menu, tabs, table, progress, and loading state.
- `libs/tao-ui/src/lib/feature-controls/` contains domain-shaped presentation controls such as shell, page header, status, score, evidence, candidate/resume cards, assessment controls, and empty/error states.
- `libs/tao-ui/src/public-api.ts` is the public export surface. New reusable controls must be exported there if consumers need them.
- `libs/tao-contracts/src/lib/` contains shared interfaces/types such as `NavigationItem`, `UserSummary`, and campaign contracts. Do not put feature-specific presentation state here without a demonstrated cross-app need.
- `libs/tao-core/src/lib/` contains shared services/stores. `AuthStore` is currently signal-based and seeded with a local recruiter user; it is not a complete authentication implementation.
- `libs/tao-utils/src/lib/` contains small pure helpers and Angular validators. Keep it dependency-light and free of feature navigation or HTTP concerns.

The intended dependency direction is application feature -> shared libraries. Libraries must not import application features. Prefer package aliases (`tao-ui`, `tao-core`, `tao-contracts`, `tao-utils`, or the `@tao/*` aliases) over deep imports.

## Architecture And Runtime Flow

### Frontend architecture

Both applications use standalone components and `ApplicationConfig`. Angular bootstrap is in `main.ts`; providers are composed in `app.config.ts`; routes are defined in `app.routes.ts`. Components generally use external HTML/SCSS files and are individually imported by their consumers.

Acquire uses a shell component (`tao-shell`) with a typed `NavigationItem[]` supplied by the root app. Its top-level routes lazy-load feature route arrays with `loadChildren`, and the dashboard is lazy-loaded with `loadComponent`. A wildcard route redirects to the dashboard. Assess currently has a single eager access route and no feature lazy-loading.

Feature pages currently own local state with `signal()` and derived state with `computed()`. The campaign area also has a `CampaignService` over `ApiClientService`, but visible page implementations still include static/mock view-model data. Treat the API service as an available boundary, not evidence that all screens are server-backed.

### Configuration and HTTP

Acquire registers `provideHttpClient()` and an app initializer. `initializeAppConfig` loads `assets/config/app-config.json` before startup and calls `AppConfigService.setConfig`. `AppConfigService` validates that `apiUrl` exists and is a valid URL. The current checked-in value is `https://localhost:44329`.

`ApiClientService` builds URLs from that base URL and exposes typed `get`, `post`, `put`, and `delete` methods with query params, headers, `HttpContext`, abort signals, credentials, and RxJS error mapping through `ApiException`/`ApiError`. Feature services should call this client rather than `HttpClient` directly. No HTTP interceptor, auth token injection, retry policy, or global error middleware was found.

### Auth, authorization, and security reality

`AuthStore` exposes a signal-backed `UserSummary | null` and a computed `isAuthenticated`; its current user is hardcoded demo state. No login flow, token/JWT storage, guard, role/claim enforcement, CSRF configuration, backend authorization, or secrets provider is present in this repository. Do not describe the demo store as production authentication, and do not add a security flow by assumption.

### Backend, database, and integrations

There is no backend project in this workspace. Consequently there are no controllers, endpoints implemented here, DTO mapping layer, MediatR handlers, command/query types, validators for server requests, repositories, unit of work, EF Core `DbContext`, entity configurations, migrations, stored procedures, views, transactions, seed data, database indexes, background workers, or external integration adapters. The API URL and campaign client indicate an intended external API contract, but its implementation and schema are outside this repository.

## Angular Standards

### Components and state

- Use standalone components; Angular 22 makes `standalone` the default, so follow the repository instruction not to add `standalone: true` to new decorators.
- Prefer `inject()` for dependency injection in new code.
- Use `input()`, `output()`, and `model()` APIs where they match the component contract. Existing controls use signal inputs and `output()` for form events.
- Use `signal()` for writable local state and `computed()` for pure derived state. Do not mutate signal-held objects in place; use `set()` or `update()`.
- `effect()` is not currently a recurring project pattern. Add one only when synchronization with an external side effect is necessary and explain why.
- Keep templates declarative. Use Angular native control flow (`@if`, `@for`, `@switch`) where the current template supports it; do not move business rules into templates.
- Components should be small and focused. Pages coordinate route/navigation and feature state; reusable controls render inputs and emit user actions.
- The repository instruction says not to set `ChangeDetectionStrategy.OnPush` explicitly because it is the Angular default in the target version. Existing code contains an explicit `OnPush` declaration, so preserve behavior when touching that file and avoid spreading the inconsistency.

### Forms and API calls

Use Reactive Forms for non-trivial forms. The campaign form uses `FormBuilder.nonNullable.group`, Angular `Validators`, `TaoValidators`, `markAllAsTouched()`, a submission-validation signal, and a typed `output<CampaignCreateRequest>()`. Trim and map raw form values at the form boundary before emitting a request.

Put HTTP calls in a feature `data-access` service. Type both request and response models, use `ApiClientService`, expose the returned `Observable`, and let the owning page or store decide when to subscribe/convert state. Do not call `HttpClient` directly from a component. No consistent loading/error subscription pattern is established yet; use the existing `tao-loading-state`, `tao-error-state`, `tao-empty-state`, and notification abstractions when integrating a real request.

### Routing and UI

Use route-local `*.routes.ts` files for feature route arrays and lazy-load them from the application route table. Use `Router` for imperative navigation and `ActivatedRoute` for route parameters as in campaign overview. Keep Acquire recruiter navigation separate from Assess candidate access.

Use Angular Material/CDK where the existing shared controls do not already provide the required behavior. `tao-ui` is the preferred home for reusable controls, not application feature folders. Preserve accessible labels, keyboard behavior, focus handling, and semantic controls when changing templates. Shared UI is grouped as native controls versus domain/feature controls and is exported from the library public API.

Global styles are minimal: Material's `azure-blue` prebuilt theme is configured in `angular.json`; app styles import Material Icons for Acquire and set `Segoe UI`, a light `#f5f7fb` background, zero body margin, and `box-sizing: border-box`. Component-specific styling belongs beside the component in SCSS.

## TypeScript And Naming Rules

- Keep strict typing. The shared compiler enables strict Angular injection/input checks and no implicit override/returns/fallthrough; do not introduce `any` without a documented boundary reason.
- Use PascalCase for component classes, interfaces/types where established, and Angular component selectors with the `tao-` prefix. Use kebab-case file and folder names.
- Use descriptive camelCase for methods, fields, signals, and route data. Keep constants in `UPPER_SNAKE_CASE` only when they are true module constants; existing static utility members use names such as `alphabeticWithSpaces`.
- Use `*Vm` for feature view models and `*Request` for request shapes where that convention already exists. Shared contracts belong in `tao-contracts` only when they are genuinely shared.
- Prefer inferred types when obvious, explicit public method return types for service/component APIs, and `unknown` over `any` at uncertain boundaries.
- Keep RxJS streams typed. Avoid unnecessary manual subscriptions; when a subscription is required, make ownership and teardown explicit. Signals are preferred for local UI state.
- Use single quotes, semicolons, trailing commas, two spaces, and a 100-column Prettier width. SCSS/CSS uses double quotes under the configured Prettier override.

## Performance And API Expectations

The current app has mostly local/static data, so there is no established caching, pagination implementation, server filtering, or performance budget beyond Angular production budgets: 500 kB initial warning, 1 MB initial error, 4 kB component-style warning, and 8 kB component-style error.

For new behavior, keep derived work in `computed()`, use stable `track` expressions for large `@for` lists, lazy-load feature boundaries, avoid repeated expensive template calls, and keep API requests typed and cancellable where practical. For real API-backed lists, use the server contract's pagination/filter/sort capabilities rather than loading unbounded data; project responses to the UI model and avoid duplicate requests. Do not claim EF Core or database optimization rules apply here because no backend is present.

## Testing

Angular CLI unit-test targets use Vitest globals via each project's `tsconfig.spec.json`. Tests live beside the implementation as `*.spec.ts`. Most current shared-control and page tests are shallow smoke tests: they configure the standalone component, create a fixture, call `detectChanges()`, and assert that the instance/template renders. The contracts library also has a typed contract test.

Use `TestBed` and standalone component imports. Provide a router with `provideRouter([])` when a page injects or uses routing. When changing behavior, extend smoke tests with focused assertions for signals, navigation, form validation/submitted payloads, service request mapping, loading/error/empty states, and accessibility-relevant output. Test real API behavior only with an explicit mock/provider; no integration or E2E harness is configured.

Commands:

```text
npm test                         # all six Angular projects sequentially
npm run test:all                 # same underlying command
npx ng test tao-acquire          # one application
npx ng test tao-assess
npx ng test tao-ui               # one shared library
```

## Build, Development, And Formatting Commands

```text
npm install
npm run start:acquire
npm run start:assess -- --port 4201
npm start -- --project tao-acquire
npm run build:libs
npm run build:acquire
npm run build:assess
npm run build:all
npm run ng -- build tao-contracts
npm run ng -- build tao-core
npm run ng -- build tao-ui
npm run ng -- build tao-utils
npm run format:check
npm run format
npm run watch -- --project tao-acquire
```

Library builds run before the app builds in the app-specific scripts because TypeScript path aliases point at `dist/tao-*`. Production output goes to `dist/<project-name>`. No backend, migration, database, Docker, or CI-equivalent command exists in the repository today. The default Angular build configuration is production; development serving enables source maps and disables optimization.

## Git And Change Management

The current history contains short imperative-style messages such as `added campaign pages`, `configured prettier formatter`, and `implmented dynamic table and styles`; no formal conventional-commit or branch naming policy is evident. Keep changes focused, preserve unrelated user changes, and do not commit generated `dist/`, `node_modules/`, `.angular/`, coverage, or `.docx` files (these are ignored).

Do not silently upgrade npm, Angular, TypeScript, or other dependencies. Update `package-lock.json` only as the direct result of an intentional dependency change. Treat `angular.json`, `tsconfig*.json`, public APIs, and runtime configuration as shared contracts and review their impact before editing. There are no generated backend models or migrations in this repository.

## Recurring Patterns

### Feature slice with route boundary

- **Why:** keeps recruiter workflows separated by business area and supports lazy loading.
- **Where:** `apps/tao-acquire/src/app/features/*`, especially `campaigns`.
- **Use:** place page components, feature models, data access, and a route array together; load the route array from `app.routes.ts`.
- **Avoid:** putting feature state in the root app or importing one feature's internals from another without a clear shared contract.

### Signal-driven page state

- **Why:** local state and derived display values are explicit and reactive.
- **Where:** campaign list/overview and other feature pages.
- **Use:** `signal<SomeVm[]>(...)` for writable state and `computed(() => ...)` for filtering/counts/progress.
- **Avoid:** duplicating derived values in mutable fields or putting filtering/business rules in HTML.

### Typed shared control

- **Why:** keeps common interaction and visual behavior consistent across both apps.
- **Where:** `libs/tao-ui/src/lib/native-controls` and `feature-controls`.
- **Use:** create a standalone, focused component with signal inputs/outputs, colocated HTML/SCSS/spec, then export it from `libs/tao-ui/src/public-api.ts`.
- **Avoid:** importing application pages into the library or creating a shared control for one page's private layout.

### API client plus feature service

- **Why:** centralizes base URL construction and typed HTTP error handling.
- **Where:** `apps/tao-acquire/src/app/core/api/api-client.service.ts` and `features/campaigns/data-access/campaign.service.ts`.
- **Use:** feature service defines endpoint/request/response types and delegates to `ApiClientService`.
- **Avoid:** direct `HttpClient` calls from a page, hardcoded API URLs, or duplicating URL/error handling in every feature.

### Form boundary mapping

- **Why:** keeps controls/form state separate from emitted request contracts.
- **Where:** `campaign-form.ts`.
- **Use:** non-nullable reactive form, validators, touched/dirty handling, trim values, construct `*Request`, emit through `output()`.
- **Avoid:** emitting raw form controls, accepting invalid values, or putting server submission logic inside the reusable form component.

## Relevant Anti-Patterns

- Do not put business logic or API calls in templates or directly in presentational shared controls.
- Do not add `any` to avoid resolving a type mismatch, duplicate contracts across apps, or expose arbitrary `Record<string, unknown>` when a known model can be used. Existing table adapters may use that cast; improve it only when the task requires it.
- Do not create backend/database abstractions in this frontend-only repository or infer endpoint schemas beyond the existing service types.
- Do not add guards/interceptors/token storage and call it implemented authentication; coordinate such a cross-cutting change explicitly.
- Do not introduce manual subscriptions when a signal conversion or template-compatible stream is sufficient, and do not leak subscriptions from long-lived components.
- Do not place feature-only models in shared libraries, duplicate a control already in `tao-ui`, or bypass a library public API with deep imports.
- Do not hardcode secrets, passwords, API keys, or environment-specific credentials. Never log tokens, personal candidate data, or full API payloads.
- Do not refactor unrelated dirty files, rename/move files unnecessarily, or silently change public component inputs/outputs.

## Security Requirements

Treat candidate and recruiter data as sensitive even though the current repository contains demo/static data. Validate user input with reactive-form validators, keep API URLs in runtime configuration, use Angular's normal template escaping, and rely on typed `HttpClient` APIs rather than string-built SQL or HTML. Never commit secrets or hardcode credentials. Do not disable browser security, certificate checks, sanitization, or validation to make a test pass. Any future token/cookie design must explicitly document storage, transport, expiration, CSRF, and logout behavior and must follow the external API's security contract.

## Known Technical Debt And Ambiguity

These are observations only; do not fix them as part of an unrelated task:

- **Demo authentication:** `libs/tao-core/src/lib/auth/auth.store.ts` seeds a hardcoded recruiter user. Impact: no real authentication or authorization. Risk: unsafe to treat as production identity. Direction: define the external identity contract before implementing a complete flow.
- **Mixed data maturity:** `CampaignService` and runtime API configuration exist, while several pages still use static/mock view-models. Impact: UI behavior and API behavior are not yet the same system. Direction: map real API DTOs to feature view models once the backend contract is available.
- **Shallow tests:** many tests assert only construction and non-empty HTML. Impact: regressions in filtering, forms, navigation, and accessibility can pass. Direction: add behavior-focused tests when each feature is made functional.
- **Angular convention drift:** most components omit explicit `standalone`, but at least one current component explicitly sets `standalone: true` and `ChangeDetectionStrategy.OnPush`, while repository instructions prohibit both explicit declarations for new code. Direction: preserve existing behavior and converge only in a deliberate cleanup.
- **Configuration scope:** the runtime config loader and API client are present in Acquire; Assess currently does not register `HttpClient` or load runtime config. Direction: do not assume the two apps have identical infrastructure until that is implemented.
- **Worktree state:** the repository currently contains user modifications and additions around routes, core infrastructure, feature pages, and tests. Agents must inspect `git status` and work with those changes rather than reverting them.

## Architectural Decisions And Confidence

### Confirmed

- The repository is an Angular 22 workspace with two applications and four libraries, registered in `angular.json`.
- Applications use standalone bootstrap/configuration and SCSS; Acquire uses lazy route boundaries.
- Shared packages are built with ng-packagr and consumed through `dist` path aliases.
- `tao-ui` is the shared presentation layer, `tao-contracts` the shared type surface, `tao-core` shared infrastructure/state, and `tao-utils` pure helpers/validators.

### Strongly inferred

- The intended application-to-library dependency direction is one-way, based on package layout, public APIs, and the README; enforce it unless a concrete existing dependency says otherwise.
- Feature `data-access/` is intended to be the home for API-facing services, based on the campaign implementation; follow it for new feature services.
- The desktop-first UI specifications in `docs/` guide the visual baseline, but the documents are not source code and do not prove runtime behavior.

### Unclear or external

- Backend endpoint behavior, API authentication, database schema, deployment topology, CI checks, and production environment values are outside this workspace.
- Whether the older deleted `*.page.*` files reflect a completed migration or an in-progress user change cannot be determined from repository history alone. Use the files currently present and inspect the active diff before editing related features.

## Agent Operating Rules

1. Read this `copilot.md` and the root `AGENTS.md` before changing code.
2. Understand the requested behavior and identify the owning application, feature, or library.
3. Search for a nearby implementation and reuse its pattern before introducing a new abstraction.
4. Keep app features dependent on shared libraries, never the reverse.
5. Keep changes minimal, focused, backward-compatible, and free of unrelated refactoring.
6. Do not invent APIs, database tables, configuration values, authentication behavior, or conventions.
7. Do not add a dependency without explicit justification; do not silently upgrade dependencies.
8. Preserve public inputs, outputs, route contracts, and library exports unless the task explicitly changes them.
9. Handle loading, error, empty, validation, accessibility, performance, and security states for new user-facing behavior.
10. Add or update focused tests when behavior changes.
11. Run the narrowest relevant test/build/format command after editing, then run broader checks when practical.
12. Review `git diff` and `git status` for unintended changes; never revert user changes or generated output without explicit instruction.
13. Report validation honestly. Never claim a build, test, or runtime check passed unless it was run and passed.
14. If the requested change conflicts with the current architecture or requires a missing backend contract, state the conflict before making a risky assumption.
15. Update this file only when the change introduces a meaningful architecture, technology, project-wide pattern, command, integration, database contract, or testing strategy change. Do not record trivial implementation details.

## Standard Task Workflow

### Before coding

1. Read `copilot.md` and `AGENTS.md`.
2. Identify affected files and the nearest owning abstraction.
3. Search for similar components, routes, services, models, and tests.
4. Determine dependency and public-contract impact.
5. State a concise implementation plan and choose the smallest testable change.

### During coding

1. Follow the existing standalone, feature-slice, signal, Reactive Forms, and shared-library patterns.
2. Reuse existing controls, services, validators, and error/empty/loading states.
3. Keep presentation, feature coordination, data access, and shared contracts separated.
4. Preserve existing behavior outside the requested change and handle edge cases explicitly.

### After coding

1. Review changed files and the diff for accidental edits.
2. Run the focused test or build for the touched project.
3. Run `npm run format:check` and broader tests/builds when the change warrants them.
4. Verify public exports, route paths, API request/response types, and accessibility behavior.
5. Summarize what changed and list the exact validation commands and results.

## Decision Priority

When several solutions are viable, choose in this order: existing project convention, existing reusable implementation, simplicity, maintainability, performance, testability, security, then scalability. Consistency with the actual repository is more important than introducing a theoretically richer architecture.
