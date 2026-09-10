import { Routes } from '@angular/router';

export const RESUME_PROCESS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/resume-process').then((module) => module.ResumeProcess),
  },
];
