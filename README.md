# TAO Hiring Platform

TAO Hiring Platform is an AI-powered talent acquisition and assessment solution. It supports campaign creation, job profiling, candidate screening, AI-assisted assessments, evidence-based evaluation, and recruiter decision-making.

This repository contains the Angular workspace foundation for two independently deployable desktop applications:

- **TAO Acquire**: recruiter and hiring-coordinator workflows.
- **TAO Assess**: candidate-facing assessment access and session workflows.

## Prerequisites

- Node.js compatible with Angular 22.
- npm 11 or later.
- A terminal opened at the repository root.

Install dependencies after cloning or changing branches:

```bash
npm install
```

## Project Structure

```text
tao-hiring-platform/
├── apps/
│   ├── tao-acquire/
│   │   ├── public/
│   │   └── src/
│   │       ├── app/
│   │       │   ├── core/                 # Auth, API, HTTP, configuration boundary
│   │       │   ├── features/
│   │       │   │   └── dashboard/        # Recruiter dashboard page
│   │       │   ├── layouts/              # Auth and application layouts
│   │       │   └── shell/                # Application shell and navigation
│   │       ├── index.html
│   │       ├── main.ts
│   │       └── styles.scss
│   │
│   └── tao-assess/
│       ├── public/
│       └── src/
│           ├── app/
│           │   ├── core/                 # Candidate access, API, HTTP, configuration
│           │   ├── features/
│           │   │   └── access/           # Secure assessment access page
│           │   ├── layouts/              # Candidate layouts
│           │   └── shell/                # Isolated assessment shell
│           ├── index.html
│           ├── main.ts
│           └── styles.scss
│
├── libs/
│   ├── tao-ui/                           # Shared shell, page header, and card components
│   ├── tao-core/                          # Shared infrastructure and signal-based state
│   ├── tao-contracts/                     # Typed DTO/ViewModel-facing contracts
│   └── tao-utils/                         # Small shared utilities
│
├── tools/
│   ├── generators/                        # Workspace generators
│   └── scripts/                           # Build and maintenance scripts
│
├── docs/
│   ├── architecture/                      # Architecture notes
│   ├── api/                               # API contract notes
│   ├── ui/                                # UI and design-system notes
│   └── *.docx                             # Product and Angular specifications
│
├── angular.json                           # Angular workspace and project registry
├── package.json                           # Scripts and dependencies
├── package-lock.json                      # Locked npm dependency tree
├── tsconfig.json                           # Shared TypeScript paths and compiler rules
├── .prettierrc                            # Formatting configuration
└── README.md
```

## Architecture

The workspace uses standalone Angular components, lazy-ready route boundaries, strict TypeScript, SCSS, and signals for local or feature state.

### Application boundaries

`tao-acquire` and `tao-assess` are separate application boundaries. Candidate routes and UI do not use the recruiter navigation. Shared code belongs in libraries and must not depend on application features.

### Library dependency direction

Feature code may depend on the shared libraries:

```text
application feature -> tao-ui
application feature -> tao-core
application feature -> tao-contracts
application feature -> tao-utils
```

Shared libraries must not import application features. API DTOs should be mapped to UI ViewModels before they reach pages or presentation components.

### UI foundation

`tao-ui` contains reusable presentation components and the desktop shell. Angular Material and CDK are available for accessible controls, dialogs, tables, overlays, drag and drop, scrolling, and keyboard interactions.

## Running the Applications

Start the recruiter application:

```bash
npm run start:acquire
```

Open `http://localhost:4200/` in a browser.

Start the candidate assessment application on another port:

```bash
npm run start:assess -- --port 4201
```

Open `http://localhost:4201/` in a browser.

Both app-specific start scripts build the shared libraries first. The generic `npm start -- --project <project>` command also runs the `prestart` hook, which builds all shared libraries before Angular starts. The Angular CLI then serves the selected project in development mode with source maps and automatic rebuilds.

## Build Commands

Build either application using the workspace script:

```bash
npm run build:acquire
npm run build:assess
```

Both application build scripts build the shared libraries first.

Build the shared libraries directly:

```bash
npm run ng -- build tao-contracts
npm run ng -- build tao-core
npm run ng -- build tao-ui
npm run ng -- build tao-utils
```

Or build all libraries in dependency order with:

```bash
npm run build:libs
```

Production output is written to `dist/<project-name>/`.

For a continuous development build:

```bash
npm run build:libs && npm run watch -- --project tao-acquire
```

## Quality Commands

Run the configured Angular test command:

```bash
npm test
```

Run Angular CLI commands through the local workspace installation:

```bash
npm run ng -- version
npm run ng -- generate component apps/tao-acquire/src/app/features/example
```

The workspace is configured with strict TypeScript and Angular compiler checks. Production builds are the current build-level validation for both deployable applications and shared libraries.

## Specifications

The implementation baseline is based on the documents in `docs/`:

- `TAO_Angular_Project_Structure_Navigation_Components_Libraries_v1.1_FEEDBACK_ALIGNED.docx`
- `TAO_Complete_Angular_UI_Specification_FEEDBACK_ALIGNED_DESKTOP_ONLY_v2.0.docx`
- `TAO_UI_UX_74_Point_Master_Design_Specification_v2.2_FEEDBACK_ALIGNED.docx`

The current baseline is desktop-first. Mobile navigation variants are intentionally outside this implementation scope.
