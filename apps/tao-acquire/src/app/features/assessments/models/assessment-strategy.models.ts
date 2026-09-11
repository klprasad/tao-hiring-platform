/**
 * Assessment strategy status values as defined by the campaign API.
 *
 * 1 = Generated, 2 = Approved.
 */
export const AssessmentStrategyStatus = {
  Generated: 1,
  Approved: 2,
} as const;

export type AssessmentStrategyStatus =
  (typeof AssessmentStrategyStatus)[keyof typeof AssessmentStrategyStatus];

export const ASSESSMENT_STRATEGY_STATUS_LABELS: Record<AssessmentStrategyStatus, string> = {
  [AssessmentStrategyStatus.Generated]: 'Generated',
  [AssessmentStrategyStatus.Approved]: 'Approved',
};

/**
 * Request body for
 * `POST /api/campaigns/assessment-strategies/{assessmentStrategyId}/approve`.
 */
export interface ApproveAssessmentStrategyRequest {
  approvedByUserId: string;
}

/**
 * Assessment strategy resource.
 */
export interface AssessmentStrategyDto {
  id: string;
  campaignId: string;
  generatedContent: string;

  /**
   * Structured JSON with questions, competency criteria and scoring.
   */
  structuredContent: string;

  status: AssessmentStrategyStatus;
  createdOnUtc: string;
}
