export type CampaignStatus =
  'draft' | 'processing' | 'active' | 'completed' | 'archived' | 'failed';

export type CampaignStepStatus = 'not-started' | 'in-progress' | 'completed' | 'blocked';

export interface CampaignVm {
  id: string;
  name: string;
  jobTitle: string;
  department: string;
  location: string;
  status: CampaignStatus;
  candidateCount: number;
  shortlistedCount: number;
  assessmentCount: number;
  createdOn: string;
  updatedOn: string;
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
export interface CampaignCreateRequest {
  campaignName: string;
  jobTitle: string;
  department: string;
  location: string;
  employmentType: string;
  jobDescription: string;
}
