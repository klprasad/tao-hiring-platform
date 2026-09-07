import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/dashboard/pages/dashboard.page').then((module) => module.DashboardPage),
  },
  {
    path: 'campaigns',
    loadChildren: () =>
      import('./features/campaigns/campaign.routes').then((module) => module.CAMPAIGN_ROUTES),
  },
  {
    path: 'candidates',
    loadComponent: () =>
      import('./features/candidates/pages/candidates.page').then((module) => module.CandidatesPage),
  },
  {
    path: 'assessments',
    loadComponent: () =>
      import('./features/assessments/pages/assessments.page').then(
        (module) => module.AssessmentsPage,
      ),
  },
  {
    path: 'reports',
    loadComponent: () =>
      import('./features/reports/pages/reports.page').then((module) => module.ReportsPage),
  },
  { path: '**', redirectTo: '' },
];
