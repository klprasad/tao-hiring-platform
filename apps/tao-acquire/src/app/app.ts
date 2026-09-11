import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavigationItem } from 'tao-contracts';
import { TaoShellComponent } from 'tao-ui';

@Component({
  imports: [RouterOutlet, TaoShellComponent],
  selector: 'tao-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly navigation: NavigationItem[] = [
    { label: 'Dashboard', route: '/', icon: 'dashboard' },
    { label: 'Campaigns', route: '/campaigns', icon: 'campaigns' },
    { label: 'Job Profiles', route: '/job-profiles', icon: 'job-profiles' },
    { label: 'Hiring Strategy', route: '/hiring-strategy', icon: 'hiring-strategy' },
    { label: 'Resume Process', route: '/resume-process', icon: 'resume-process' },
    { label: 'Candidates Screening', route: '/candidates', icon: 'candidates' },
    { label: 'Assessments Strategy', route: '/assessments', icon: 'assessments' },
    { label: 'Invitations', route: '/invitations', icon: 'invitations' },
    { label: 'Reports', route: '/reports', icon: 'reports' },
  ];
}
