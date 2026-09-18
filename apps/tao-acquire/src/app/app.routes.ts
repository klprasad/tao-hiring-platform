import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/dashboard/pages/dashboard').then((module) => module.Dashboard),
  },
  {
    path: 'campaigns',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/campaigns/pages/campaign-list/campaign-list').then(
            (m) => m.CampaignListComponent,
          ),
      },
      {
        path: 'create',
        loadComponent: () =>
          import('./features/campaigns/pages/campaign-create/campaign-create').then(
            (m) => m.CampaignCreateComponent,
          ),
      },
      {
        path: ':campaignId',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./features/campaigns/pages/campaign-overview/campaign-overview').then(
                (m) => m.CampaignOverview,
              ),
          },
          {
            path: 'job-profile',
            loadComponent: () =>
              import('./features/job-profile/pages/job-profile-overview/job-profile-overview').then(
                (m) => m.JobProfileOverview,
              ),
          },
          {
            path: 'job-profile-create',
            loadComponent: () =>
              import('./features/job-profile/pages/job-profile-create/job-profile-create').then(
                (m) => m.JobProfileCreateComponent,
              ),
          },
          {
            path: 'job-profile/:id',
            loadComponent: () =>
              import('./features/job-profile/pages/job-profile-edit/job-profile-edit').then(
                (m) => m.JobProfileEditComponent,
              ),
          },
          {
            path: 'hiring-strategy',
            loadComponent: () =>
              import('./features/hiring-strategy/pages/hiring-strategy').then(
                (m) => m.HiringStrategy,
              ),
          },
          {
            path: 'hiring-strategy-create',
            loadComponent: () =>
              import('./features/hiring-strategy/pages/hiring-strategy-create/hiring-strategy-create').then(
                (m) => m.HiringStrategyCreate,
              ),
          },
          {
            path: 'assessment-strategy',
            loadComponent: () =>
              import('./features/assessments/pages/assessments').then((m) => m.Assessments),
          },
          {
            path: 'candidates',
            loadComponent: () =>
              import('./features/candidates/pages/candidates').then((m) => m.Candidates),
          },
          {
            path: 'invitations',
            loadComponent: () =>
              import('./features/invitations/pages/invitations').then((m) => m.Invitations),
          },
          {
            path: 'resume-imports',
            loadComponent: () =>
              import('./features/resume-process/pages/resume-process').then((m) => m.ResumeProcess),
          },
        ],
      },
    ],
  },
  {
    path: 'reports',
    loadComponent: () =>
      import('./features/reports/pages/reports').then((module) => module.Reports),
  },
  { path: '**', redirectTo: '' },
];
