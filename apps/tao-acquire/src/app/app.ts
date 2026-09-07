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
    { label: 'Candidates', route: '/candidates', icon: 'candidates' },
    { label: 'Assessments', route: '/assessments', icon: 'assessments' },
    { label: 'Reports', route: '/reports', icon: 'reports' },
  ];
}
