import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TaoButtonComponent, TaoCardComponent, TaoPageHeaderComponent } from 'tao-ui';

@Component({
  selector: 'tao-dashboard',
  imports: [TaoButtonComponent, TaoCardComponent, TaoPageHeaderComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  private readonly router = inject(Router);
  createCampaign(): void {
    this.router.navigate(['/campaigns/create']);
  }
}
