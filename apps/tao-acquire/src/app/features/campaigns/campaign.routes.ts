import { Routes } from '@angular/router';

/**
 * Campaign routes.
 *
 * Each campaign owns the API endpoints used by the hiring workflow, so the
 * workflow steps are nested under `/campaigns/:campaignId`:
 *
 *  - /campaigns/:campaignId                     -> campaign overview
 *  - /campaigns/:campaignId/processing          -> generation progress
 *  - /campaigns/:campaignId/job-profile         -> generate a job profile
 *  - /campaigns/:campaignId/job-profile/:id     -> review / approve a job profile
 *  - /campaigns/:campaignId/hiring-strategy     -> hiring strategy
 *  - /campaigns/:campaignId/assessment-strategy -> assessment strategy
 *  - /campaigns/:campaignId/candidates          -> candidate screening
 *  - /campaigns/:campaignId/invitations         -> invitations
 *  - /campaigns/:campaignId/resume-imports      -> resume imports
 */
export const CAMPAIGN_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/campaign-list/campaign-list').then((m) => m.CampaignListComponent),
  },

  {
    path: 'create',
    loadComponent: () =>
      import('./pages/campaign-create/campaign-create').then((m) => m.CampaignCreateComponent),
  },

  {
    path: ':campaignId',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/campaign-overview/campaign-overview').then((m) => m.CampaignOverview),
      },
      {
        path: 'processing',
        loadComponent: () =>
          import('./pages/campaign-processing/campaign-processing').then(
            (m) => m.CampaignProcessing,
          ),
      },
      {
        path: 'job-profile',
        loadComponent: () =>
          import('../job-profile/pages/job-profile-create/job-profile-create').then(
            (m) => m.JobProfileCreateComponent,
          ),
      },
      {
        path: 'job-profile/:id',
        loadComponent: () =>
          import('../job-profile/pages/job-profile-edit/job-profile-edit').then(
            (m) => m.JobProfileEditComponent,
          ),
      },
      {
        path: 'hiring-strategy',
        loadComponent: () =>
          import('../hiring-strategy/pages/hiring-strategy').then((m) => m.HiringStrategy),
      },
      {
        path: 'assessment-strategy',
        loadComponent: () => import('../assessments/pages/assessments').then((m) => m.Assessments),
      },
      {
        path: 'candidates',
        loadComponent: () => import('../candidates/pages/candidates').then((m) => m.Candidates),
      },
      {
        path: 'invitations',
        loadComponent: () => import('../invitations/pages/invitations').then((m) => m.Invitations),
      },
      {
        path: 'resume-imports',
        loadComponent: () =>
          import('../resume-process/pages/resume-process').then((m) => m.ResumeProcess),
      },
    ],
  },
];
