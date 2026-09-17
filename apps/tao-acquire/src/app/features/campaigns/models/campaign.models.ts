import { CampaignWorkflowVm } from './campaign-workflow.model';

/**
 * Campaign status values as defined by the campaign API.
 *
 * 1 = Ready, 2 = Open, 3 = Closed, 4 = Archived.
 */
export const CampaignStatus = {
  Ready: 1,
  Open: 2,
  Closed: 3,
  Archived: 4,
} as const;

export type CampaignStatus = (typeof CampaignStatus)[keyof typeof CampaignStatus];

export const CAMPAIGN_STATUS_LABELS: Record<CampaignStatus, string> = {
  [CampaignStatus.Ready]: 'Ready',
  [CampaignStatus.Open]: 'Open',
  [CampaignStatus.Closed]: 'Closed',
  [CampaignStatus.Archived]: 'Archived',
};

export type CampaignStepStatus = 'not-started' | 'in-progress' | 'completed' | 'blocked';

/**
 * Campaign as returned by the API.
 *
 * Documented at `GET /api/campaigns/{campaignId}`.
 */
export interface CampaignDto {
  id: string;
  organizationId: string;
  name: string;
  referenceNumber: string;
  recruiterName: string;
  hiringManagerName: string;
  numberOfOpenings: number;
  status: CampaignStatus;
  createdOn: string;
}

/**
 * View model consumed by the campaign screens.
 */
export interface CampaignVm {
  id: string;
  organisationId: string;
  name: string;
  referenceNumber: string;
  hiringManagerName: string;
  recruiterName: string;
  status: CampaignStatus;
  numberOfOpenings: number;
  createdOn: string;
}

export function mapCampaignDtoToVm(dto: CampaignDto): CampaignVm {
  return {
    id: dto.id,
    organisationId: dto.organizationId,
    name: dto.name,
    referenceNumber: dto.referenceNumber,
    hiringManagerName: dto.hiringManagerName,
    recruiterName: dto.recruiterName,
    status: dto.status,
    numberOfOpenings: dto.numberOfOpenings,
    createdOn: dto.createdOn,
  };
}

export interface CampaignStepVm {
  id: string;
  name: string;
  description: string;
  status: CampaignStepStatus;
  route: string;
}

export interface CampaignProcessingVm {
  campaignId: string;
  status: 'processing' | 'completed' | 'failed';
  progress: number;
  currentStep: string;
  message: string;
}

/**
 * Request body for `POST /api/campaigns/`.
 */
export interface CampaignCreateRequest {
  organizationId: string;
  name: string;
  referenceNumber: string;
  recruiterId: string;
  hiringManagerId: string;
  numberOfOpenings: number;
}

export interface CampaignWorkflowDto {
  campaignId: string;
  campaignName: string;
  currentStage: string;
  completionPercentage: number;

  hasJobProfile: boolean;
  jobProfileStatus: string | null;
  jobProfileCreatedOn: string | null;
  jobProfileApprovedOn: string | null;

  hasHiringStrategy: boolean;
  hiringStrategyStatus: string | null;
  hiringStrategyCreatedOn: string | null;
  hiringStrategyApprovedOn: string | null;

  hasAssessmentStrategy: boolean;
  assessmentStrategyStatus: string | null;
  assessmentStrategyCreatedOn: string | null;
  assessmentStrategyApprovedOn: string | null;

  hasResumeImport: boolean;
  resumeImportStatus: string | null;
  totalResumes: number;
  successfulResumes: number;
  failedResumes: number;
  resumeImportCompletedOn: string | null;
}
export function mapCampaignWorkflowDtoToVm(dto: CampaignWorkflowDto): CampaignWorkflowVm {
  return new CampaignWorkflowVm({
    campaignId: dto.campaignId,
    campaignName: dto.campaignName,
    currentStage: dto.currentStage,
    completionPercentage: dto.completionPercentage,

    hasJobProfile: dto.hasJobProfile,
    jobProfileStatus: dto.jobProfileStatus,
    jobProfileCreatedOn: dto.jobProfileCreatedOn ? new Date(dto.jobProfileCreatedOn) : null,
    jobProfileApprovedOn: dto.jobProfileApprovedOn ? new Date(dto.jobProfileApprovedOn) : null,

    hasHiringStrategy: dto.hasHiringStrategy,
    hiringStrategyStatus: dto.hiringStrategyStatus,
    hiringStrategyCreatedOn: dto.hiringStrategyCreatedOn
      ? new Date(dto.hiringStrategyCreatedOn)
      : null,
    hiringStrategyApprovedOn: dto.hiringStrategyApprovedOn
      ? new Date(dto.hiringStrategyApprovedOn)
      : null,

    hasAssessmentStrategy: dto.hasAssessmentStrategy,
    assessmentStrategyStatus: dto.assessmentStrategyStatus,
    assessmentStrategyCreatedOn: dto.assessmentStrategyCreatedOn
      ? new Date(dto.assessmentStrategyCreatedOn)
      : null,
    assessmentStrategyApprovedOn: dto.assessmentStrategyApprovedOn
      ? new Date(dto.assessmentStrategyApprovedOn)
      : null,

    hasResumeImport: dto.hasResumeImport,
    resumeImportStatus: dto.resumeImportStatus,
    totalResumes: dto.totalResumes,
    successfulResumes: dto.successfulResumes,
    failedResumes: dto.failedResumes,
    resumeImportCompletedOn: dto.resumeImportCompletedOn
      ? new Date(dto.resumeImportCompletedOn)
      : null,
  });
}
