/**
 * Hiring strategy status values as defined by the campaign API.
 *
 * 1 = Generated, 2 = Approved.
 */
export const HiringStrategyStatus = {
  Generated: 1,
  Approved: 2,
} as const;

export type HiringStrategyStatus = (typeof HiringStrategyStatus)[keyof typeof HiringStrategyStatus];

export const HIRING_STRATEGY_STATUS_LABELS: Record<HiringStrategyStatus, string> = {
  [HiringStrategyStatus.Generated]: 'Generated',
  [HiringStrategyStatus.Approved]: 'Approved',
};

/**
 * Request body for `POST /api/campaigns/{hiringStrategyId}/approve`.
 */
export interface ApproveHiringStrategyRequest {
  approvedByUserId: string;
}

/**
 * Response payload for `GET /api/campaigns/{campaignId}/hiring-strategy`.
 */
export interface HiringStrategyDto {
  id: string;
  campaignId: string;
  content: hiringStrategyContentDto;
  structuredContent: structuredContentDto;
  status: string;
  providerName: string;
  modelName: string;
  organizationId: string;
  promptVersion: number;
  createdOnUtc: string;
}
export interface structuredContentDto {
  value: string;
}
export interface hiringStrategyContentDto {
  value: string;
}
export interface JobProfileSkill {
  name: string;
}

export interface JobProfileContent {
  minimumExperienceYears: number;
  recommendedResumeMatchThreshold: number;
  requiredSkills: JobProfileSkill[];
  preferredSkills: JobProfileSkill[];
  recruiterGuidance: string[];
}
