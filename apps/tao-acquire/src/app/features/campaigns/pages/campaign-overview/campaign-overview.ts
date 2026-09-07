import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

import { CampaignVm, CampaignStepVm } from '../../models/campaign.models';
@Component({
  selector: 'tao-campaign-overview',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, MatCardModule],
  templateUrl: './campaign-overview.html',
  styleUrl: './campaign-overview.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CampaignOverview {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly campaign = signal<CampaignVm>({
    id: '',
    name: 'Senior .NET Hiring',
    jobTitle: 'Senior .NET Developer',
    department: 'Engineering',
    location: 'Hyderabad',
    status: 'active',
    candidateCount: 124,
    shortlistedCount: 18,
    assessmentCount: 12,
    progress: 15,
    createdOn: '2026-08-20',
    updatedOn: '2026-09-05',
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
    const campaignId = this.route.snapshot.paramMap.get('id');

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

  editCampaign(): void {
    this.router.navigate(['/campaigns', this.campaign().id, 'edit']);
  }
}
