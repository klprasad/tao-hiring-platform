import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TaoButtonComponent, TaoCardComponent, TaoPageHeaderComponent } from 'tao-ui';

@Component({
  selector: 'tao-dashboard-page',
  imports: [TaoButtonComponent, TaoCardComponent, TaoPageHeaderComponent],
  templateUrl: './dashboard.page.html',
  styleUrl: './dashboard.page.scss',
})
export class DashboardPage {
  private readonly router = inject(Router);
  createCampaign(): void {
    this.router.navigate(['/campaigns/create']);
  }
}
