import { Routes } from '@angular/router';

export const INVITATIONS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/invitations').then((module) => module.Invitations),
  },
];
