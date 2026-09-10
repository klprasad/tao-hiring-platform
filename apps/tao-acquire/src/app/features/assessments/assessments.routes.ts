import { Routes } from '@angular/router';

export const ASSESSMENTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/assessments').then((module) => module.Assessments),
  },
];
