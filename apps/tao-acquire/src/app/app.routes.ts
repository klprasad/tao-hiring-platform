import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/dashboard/pages/dashboard').then((module) => module.Dashboard),
  },
  {
    path: 'campaigns',
    loadChildren: () =>
      import('./features/campaigns/campaign.routes').then((module) => module.CAMPAIGN_ROUTES),
  },
  {
    path: 'hiring-strategy',
    loadChildren: () =>
      import('./features/hiring-strategy/hiring-strategy.routes').then(
        (module) => module.HIRING_STRATEGY_ROUTES,
      ),
  },
  {
    path: 'resume-process',
    loadChildren: () =>
      import('./features/resume-process/resume-process.routes').then(
        (module) => module.RESUME_PROCESS_ROUTES,
      ),
  },
  {
    path: 'invitations',
    loadChildren: () =>
      import('./features/invitations/invitations.routes').then(
        (module) => module.INVITATIONS_ROUTES,
      ),
  },
  {
    path: 'candidates',
    loadChildren: () =>
      import('./features/candidates/candidates.routes').then((module) => module.CANDIDATES_ROUTES),
  },
  {
    path: 'assessments',
    loadChildren: () =>
      import('./features/assessments/assessments.routes').then(
        (module) => module.ASSESSMENTS_ROUTES,
      ),
  },
  {
    path: 'reports',
    loadChildren: () =>
      import('./features/reports/reports.routes').then((module) => module.REPORTS_ROUTES),
  },
  { path: '**', redirectTo: '' },
];
