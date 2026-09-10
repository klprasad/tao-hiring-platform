import { Routes } from '@angular/router';

export const JOB_PROFILE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/job-profile-list/job-profile-list').then((m) => m.JobProfileListComponent),
  },
  {
    path: 'create',
    loadComponent: () =>
      import('./pages/job-profile-create/job-profile-create').then(
        (m) => m.JobProfileCreateComponent,
      ),
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('./pages/job-profile-edit/job-profile-edit').then((m) => m.JobProfileEditComponent),
  },
];