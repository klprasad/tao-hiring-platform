import { Routes } from '@angular/router';

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
    path: ':id/processing',
    loadComponent: () =>
      import('./pages/campaign-processing/campaign-processing').then((m) => m.CampaignProcessing),
  },

  {
    path: ':id',
    loadComponent: () =>
      import('./pages/campaign-overview/campaign-overview').then((m) => m.CampaignOverview),
  },
];
