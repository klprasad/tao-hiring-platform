import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { TaoButtonComponent, TaoPageHeaderComponent } from '@tao/ui';
import { MatIconModule } from '@angular/material/icon';
import { CampaignFormComponent } from '../../components/campaign-form/campaign-form';
import { CampaignCreateRequest } from '../../models/campaign.models';

@Component({
  selector: 'tao-campaign-create',
  standalone: true,
  imports: [TaoPageHeaderComponent, TaoButtonComponent, CampaignFormComponent, MatIconModule],
  templateUrl: './campaign-create.html',
  styleUrl: './campaign-create.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CampaignCreateComponent {
  private readonly router = inject(Router);

  readonly isSubmitting = false;

  cancel(): void {
    this.router.navigate(['/campaigns']);
  }

  createCampaign(request: CampaignCreateRequest): void {
    // TODO:
    // Replace with CampaignStore/API call.
    console.log('Create campaign:', request);

    // Temporary navigation for UI development.
    this.router.navigate(['/campaigns']);
  }
}
