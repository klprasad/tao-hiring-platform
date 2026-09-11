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
  recruiterId: string;
  hiringManagerId: string;
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
  hiringManagerId: string;
  recruiterId: string;
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
    hiringManagerId: dto.hiringManagerId,
    recruiterId: dto.recruiterId,
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
