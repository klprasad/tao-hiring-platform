export type CampaignStatus = 'Active' | 'Draft' | 'Completed';

export interface CampaignSummary {
  id: string;
  name: string;
  role: string;
  status: CampaignStatus;
  candidates: number;
  updatedAt: string;
}
