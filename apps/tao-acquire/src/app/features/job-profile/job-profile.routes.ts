import { Routes } from '@angular/router';

export const JOB_PROFILE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/job-profile-list/job-profile-list').then((m) => m.JobProfileListComponent),
  },
];
