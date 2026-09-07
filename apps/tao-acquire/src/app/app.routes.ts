import { Routes } from '@angular/router';

export const routes: Routes = [
	{
		path: '',
		loadComponent: () => import('./features/dashboard/pages/dashboard.page').then((module) => module.DashboardPage),
	},
	{
		path: 'campaigns',
		loadComponent: () => import('./features/campaigns/pages/campaigns.page').then((module) => module.CampaignsPage),
	},
	{
		path: 'candidates',
		loadComponent: () => import('./features/candidates/pages/candidates.page').then((module) => module.CandidatesPage),
	},
	{
		path: 'assessments',
		loadComponent: () => import('./features/assessments/pages/assessments.page').then((module) => module.AssessmentsPage),
	},
	{
		path: 'reports',
		loadComponent: () => import('./features/reports/pages/reports.page').then((module) => module.ReportsPage),
	},
	{ path: '**', redirectTo: '' },
];
