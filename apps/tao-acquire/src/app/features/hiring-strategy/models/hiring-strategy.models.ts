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
  generatedContent: string;

  /**
   * Structured JSON with sourcing strategies and evaluation criteria.
   */
  structuredContent: string;

  status: HiringStrategyStatus;
  providerName: string;
  modelName: string;
  promptVersion: number;
  createdOnUtc: string;
}
