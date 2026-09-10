import { Routes } from '@angular/router';

export const HIRING_STRATEGY_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/hiring-strategy').then((module) => module.HiringStrategy),
  },
];
