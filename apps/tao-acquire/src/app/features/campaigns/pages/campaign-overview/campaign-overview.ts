import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';

import { MatIconModule } from '@angular/material/icon';
import { TaoButtonComponent, TaoCardComponent } from '@tao/ui';
import { CampaignVm, CampaignStepVm } from '../../models/campaign.models';
@Component({
  selector: 'tao-campaign-overview',
  standalone: true,
  imports: [MatIconModule, TaoButtonComponent, TaoCardComponent],
  templateUrl: './campaign-overview.html',
  styleUrl: './campaign-overview.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CampaignOverview {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly campaign = signal<CampaignVm>({
    id: '01A05E11-5971-755E-A5E9-DFC4BF6DBE46',
    organisationId: '019FA8F7-E474-722F-B476-C07A63658297',
    name: 'Fresher .NET profile',
    referenceNumber: 'FNPP',
    hiringManagerId: '019FA8F7-E53A-76F6-A7E1-5F7096B2CCDF',
    recruiterId: '019FA8F7-E53A-7C15-B8CD-3529C4AE7992',
    status: 1,
    numberOfOpenings: 3,
    createdOn: '2026-09-01T17:43:10.4498174',
  });

  readonly steps = signal<CampaignStepVm[]>([
    {
      id: 'job-profile',
      name: 'Job Profile',
      description: 'Review job requirements and responsibilities.',
      status: 'completed',
      route: 'job-profile',
    },
    {
      id: 'hiring-strategy',
      name: 'Hiring Strategy',
      description: 'Define the candidate evaluation strategy.',
      status: 'completed',
      route: 'hiring-strategy',
    },
    {
      id: 'candidates',
      name: 'Candidates',
      description: 'Import and screen candidates.',
      status: 'in-progress',
      route: 'candidates',
    },
    {
      id: 'assessment-strategy',
      name: 'Assessment Strategy',
      description: 'Configure assessment rounds and competencies.',
      status: 'not-started',
      route: 'assessment-strategy',
    },
    {
      id: 'invitations',
      name: 'Invitations',
      description: 'Invite shortlisted candidates.',
      status: 'not-started',
      route: 'invitations',
    },
  ]);

  readonly completedSteps = computed(
    () => this.steps().filter((step) => step.status === 'completed').length,
  );

  readonly campaignProgress = computed(() => {
    const total = this.steps().length;

    return total === 0 ? 0 : Math.round((this.completedSteps() / total) * 100);
  });

  constructor() {
    const campaignId = this.route.snapshot.paramMap.get('campaignId');

    if (campaignId) {
      this.campaign.update((c) => ({
        ...c,
        id: campaignId,
      }));
    }
  }

  navigateToStep(step: CampaignStepVm): void {
    if (step.status === 'not-started') {
      return;
    }

    this.router.navigate(['/campaigns', this.campaign().id, step.route]);
  }

  backToCampaigns(): void {
    this.router.navigate(['/campaigns']);
  }
}
