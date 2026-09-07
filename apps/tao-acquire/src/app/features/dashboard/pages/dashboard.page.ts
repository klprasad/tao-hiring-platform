import { Component } from '@angular/core';
import { TaoButtonComponent, TaoCardComponent, TaoPageHeaderComponent } from 'tao-ui';

@Component({
  selector: 'tao-dashboard-page',
  imports: [TaoButtonComponent, TaoCardComponent, TaoPageHeaderComponent],
  templateUrl: './dashboard.page.html',
  styleUrl: './dashboard.page.scss',
})
export class DashboardPage {}
