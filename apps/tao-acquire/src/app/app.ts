import { Component, computed, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { AuthStore, HttpLoadingService, NavigationItem } from '@tao/core';
import { TaoLoadingStateComponent, TaoShellComponent } from '@tao/ui';

@Component({
  imports: [RouterOutlet, TaoShellComponent, TaoLoadingStateComponent],
  selector: 'tao-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  private readonly authStore = inject(AuthStore);

  protected loadingService = inject(HttpLoadingService);
  readonly loading = this.loadingService.isLoading;

  /** The application shell is rendered for signed-in users only. */
  protected readonly isAuthenticated = this.authStore.isAuthenticated;

  protected readonly navigation: NavigationItem[] = [
    {
      label: 'Dashboard',
      route: '/',
      icon: 'dashboard',
    },
    {
      label: 'Reports',
      route: '/reports',
      icon: 'reports',
    },
    {
      label: 'Campaigns',
      route: '/campaigns',
      icon: 'campaigns',
      contextRoute: '/campaigns/:campaignId',

      children: [
        {
          label: 'Overview',
          route: '',
          icon: 'campaigns',
        },
        {
          label: 'Job Profile',
          route: 'job-profile',
          icon: 'job-profiles',
        },
        {
          label: 'Hiring Strategy',
          route: 'hiring-strategy',
          icon: 'hiring-strategy',
        },
        {
          label: 'Resume Imports',
          route: 'resume-imports',
          icon: 'resume-process',
        },
        {
          label: 'Candidates Screening',
          route: 'candidates',
          icon: 'candidates',
        },
        {
          label: 'Assessment Strategy',
          route: 'assessment-strategy',
          icon: 'assessments',
        },
        {
          label: 'Invitations',
          route: 'invitations',
          icon: 'invitations',
        },
      ],
    },
  ];
}
