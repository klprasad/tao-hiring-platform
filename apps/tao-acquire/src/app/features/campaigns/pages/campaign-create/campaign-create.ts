import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, EMPTY } from 'rxjs';
import { TaoButtonComponent, TaoPageHeaderComponent, ToasterService } from '@tao/ui';
import { MatIconModule } from '@angular/material/icon';
import { CampaignFormComponent } from '../../components/campaign-form/campaign-form';
import { CampaignService } from '../../data-access/campaign.service';
import { CampaignCreateRequest } from '../../models/campaign.model';

@Component({
  selector: 'tao-campaign-create',
  imports: [TaoPageHeaderComponent, TaoButtonComponent, CampaignFormComponent, MatIconModule],
  templateUrl: './campaign-create.html',
  styleUrl: './campaign-create.scss',
})
export class CampaignCreateComponent {
  private readonly router = inject(Router);
  private readonly campaignService = inject(CampaignService);
  private readonly toaster = inject(ToasterService);

  readonly isSubmitting = signal(false);

  cancel(): void {
    this.router.navigate(['/campaigns']);
  }

  createCampaign(request: CampaignCreateRequest): void {
    this.isSubmitting.set(true);

    this.campaignService
      .createCampaign(request)
      .pipe(
        catchError(() => {
          this.toaster.error('The campaign could not be created. Please try again.');
          this.isSubmitting.set(false);
          return EMPTY;
        }),
      )
      .subscribe((response) => {
        this.isSubmitting.set(false);
        this.toaster.success('Campaign created successfully.');

        // Continue with the first step of the campaign workflow.
        this.router.navigate(['/campaigns', response, 'job-profile']);
      });
  }
}
