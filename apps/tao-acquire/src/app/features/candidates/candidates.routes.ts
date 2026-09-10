import { Routes } from '@angular/router';

export const CANDIDATES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/candidates').then((module) => module.Candidates),
  },
];
