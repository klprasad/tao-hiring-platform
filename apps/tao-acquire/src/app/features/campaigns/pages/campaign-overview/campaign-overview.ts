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
} from '../../models/campaign.model';
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
      id: 'resume-imports',
      name: 'Resume Imports',
      description: 'Upload candidates resumes for screening',
      route: 'resume-imports',
    },
    {
      id: 'candidates',
      name: 'Candidates Screening',
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

    const completed = this.getCompletedStepIds(workflow);

    const firstIncompleteIndex = this.stepDefinitions.findIndex((step) => !completed.has(step.id));

    return this.stepDefinitions.map((step, index) => {
      let status: CampaignStepStatus;

      if (completed.has(step.id)) {
        status = 'completed';
      } else if (index === firstIncompleteIndex) {
        status = 'in-progress';
      } else {
        status = 'not-started';
      }

      return {
        ...step,
        status,
      };
    });
  });
  private getCompletedStepIds(workflow: CampaignWorkflowVm): Set<string> {
    const completed = new Set<string>();

    if (workflow.jobProfileApprovedOn) {
      completed.add('job-profile');
    }

    if (workflow.hiringStrategyApprovedOn) {
      completed.add('hiring-strategy');
    }

    if (workflow.resumeImportCompletedOn || workflow.resumeImportStatus === 'Completed') {
      completed.add('resume-imports');
    }

    if (workflow.candidatesScreeningCompletedOn) {
      completed.add('candidates');
    }

    if (workflow.assessmentStrategyApprovedOn) {
      completed.add('assessment-strategy');
    }

    if (workflow.invitationsCompletedOn) {
      completed.add('invitations');
    }

    return completed;
  }
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
