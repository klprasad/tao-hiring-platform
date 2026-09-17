import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';

import { MatIconModule } from '@angular/material/icon';
import { TaoButtonComponent, TaoCardComponent } from '@tao/ui';
import {
  CampaignVm,
  CampaignStepVm,
  mapCampaignDtoToVm,
  mapCampaignWorkflowDtoToVm,
  CampaignStepStatus,
} from '../../models/campaign.models';
import { CampaignService } from '../../data-access/campaign.service';
import { CampaignWorkflowVm } from '../../models/campaign-workflow.model';
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
  private readonly campaignService = inject(CampaignService);
  readonly campaignWorkflow = signal<CampaignWorkflowVm | null>(null);

  private readonly stepDefinitions = [
    {
      id: 'job-profile',
      name: 'Job Profile',
      description: 'Review job requirements and responsibilities.',
      route: 'job-profile',
    },
    {
      id: 'hiring-strategy',
      name: 'Hiring Strategy',
      description: 'Define the candidate evaluation strategy.',
      route: 'hiring-strategy',
    },
    {
      id: 'candidates',
      name: 'Candidates',
      description: 'Import and screen candidates.',
      route: 'candidates',
    },
    {
      id: 'assessment-strategy',
      name: 'Assessment Strategy',
      description: 'Configure assessment rounds and competencies.',
      route: 'assessment-strategy',
    },
    {
      id: 'invitations',
      name: 'Invitations',
      description: 'Invite shortlisted candidates.',
      route: 'invitations',
    },
  ] as const;

  readonly steps = computed<CampaignStepVm[]>(() => {
    const workflow = this.campaignWorkflow();

    if (!workflow) {
      return [];
    }

    return this.stepDefinitions.map((step) => ({
      ...step,
      status: this.getStepStatus(step.id, workflow),
    }));
  });

  readonly completedSteps = computed(
    () => this.steps().filter((step) => step.status === 'completed').length,
  );

  readonly completionPercentage = computed(() => {
    const steps = this.steps();

    if (!steps.length) {
      return 0;
    }

    return Math.round((this.completedSteps() / steps.length) * 100);
  });
  private getStepStatus(stepId: string, workflow: CampaignWorkflowVm): CampaignStepStatus {
    switch (stepId) {
      case 'job-profile':
        if (workflow.jobProfileApprovedOn) {
          return 'completed';
        }

        return workflow.hasJobProfile ? 'in-progress' : 'not-started';

      case 'hiring-strategy':
        if (workflow.hiringStrategyApprovedOn) {
          return 'completed';
        }

        return workflow.hasHiringStrategy ? 'in-progress' : 'not-started';

      case 'candidates':
        if (workflow.resumeImportCompletedOn) {
          return 'completed';
        }

        return workflow.hasResumeImport || workflow.resumeImportStatus || workflow.totalResumes > 0
          ? 'in-progress'
          : 'not-started';

      case 'assessment-strategy':
        if (workflow.assessmentStrategyApprovedOn) {
          return 'completed';
        }

        return workflow.hasAssessmentStrategy ? 'in-progress' : 'not-started';

      case 'invitations':
        return 'not-started';

      default:
        return 'not-started';
    }
  }
  constructor() {
    const campaignId = this.route.snapshot.paramMap.get('campaignId');

    if (campaignId) {
      this.loadCampaignWorkflows(campaignId);
    }
  }
  // loadCampaign(campaignId: string): void {
  //   this.campaignService.getCampaignById(campaignId).subscribe((campaign) => {
  //     this.campaign.set(mapCampaignDtoToVm(campaign));
  //   });
  // }
  loadCampaignWorkflows(campaignId: string): void {
    this.campaignService.getCampaignWorkflows(campaignId).subscribe((workflowVm) => {
      this.campaignWorkflow.set(mapCampaignWorkflowDtoToVm(workflowVm));
    });
  }

  navigateToStep(step: CampaignStepVm): void {
    if (step.status === 'not-started') {
      return;
    }

    this.router.navigate(['/campaigns', this.campaignWorkflow()?.campaignId, step.route]);
  }

  backToCampaigns(): void {
    this.router.navigate(['/campaigns']);
  }
}
