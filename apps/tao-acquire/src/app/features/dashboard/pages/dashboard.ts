import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TaoButtonComponent, TaoCardComponent, TaoPageHeaderComponent } from '@tao/ui';
import { AuthStore } from '@tao/core';

@Component({
  selector: 'tao-dashboard',
  imports: [TaoButtonComponent, TaoCardComponent, TaoPageHeaderComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  private readonly router = inject(Router);
  private readonly authStore = inject(AuthStore);
  readonly user = this.authStore.user;
  createCampaign(): void {
    this.router.navigate(['/campaigns/create']);
  }
}
