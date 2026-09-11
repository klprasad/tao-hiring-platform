import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';

import { CampaignProcessingVm } from '../../models/campaign.models';

@Component({
  selector: 'tao-campaign-processing',
  standalone: true,
  imports: [MatIconModule, MatProgressBarModule, MatButtonModule],
  templateUrl: './campaign-processing.html',
  styleUrl: './campaign-processing.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CampaignProcessing implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly processing = signal<CampaignProcessingVm>({
    campaignId: '',
    status: 'processing',
    progress: 35,
    currentStep: 'Generating job profile',
    message: 'TAO is analyzing the job description and generating the campaign profile.',
  });

  ngOnInit(): void {
    const campaignId = this.route.snapshot.paramMap.get('campaignId') ?? '';

    this.processing.update((state) => ({
      ...state,
      campaignId,
    }));

    // Replace with CampaignStore/API polling or
    // server push when backend integration is added.
  }

  openCampaign(): void {
    const campaignId = this.processing().campaignId;

    this.router.navigate(['/campaigns', campaignId]);
  }

  retry(): void {
    // Call backend retry endpoint.
    // Do not locally assume processing has started.
  }
}
