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
export interface AssessmentVm {
  id: string;
  assessmentName: string;
  status: number;
  generatedOn: string;
  totalRounds: number;
  totalDurationInMinutes: number;
  totalQuestions: number;
  rounds: AssessmentRoundVm[];
}

export interface AssessmentRoundVm {
  id: string;
  order: number;
  type: string;
  displayType: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  durationInMinutes: number;
  targetQuestionCount: number;
  competencies: AssessmentCompetencyVm[];
}

export interface AssessmentCompetencyVm {
  name: string;
  priority: AssessmentPriority;
  minimumPassPercentage: number;
}
export function mapAssessmentToVm(response: AssessmentResponse): AssessmentVm {
  const rounds = response.rounds ?? [];

  return {
    id: response.id,
    assessmentName: response.assessmentName,
    status: response.status,
    generatedOn: response.generatedOn,
    totalRounds: rounds.length,

    totalDurationInMinutes: rounds.reduce((sum, round) => sum + round.durationInMinutes, 0),

    totalQuestions: rounds.reduce((sum, round) => sum + round.targetQuestionCount, 0),

    rounds: rounds
      .sort((a, b) => a.order - b.order)
      .map((round) => ({
        id: round.id,
        order: round.order,

        type: round.type,
        displayType: formatRoundType(round.type),

        difficulty: round.difficulty,

        durationInMinutes: round.durationInMinutes,
        targetQuestionCount: round.targetQuestionCount,

        competencies: round.competencies,
      })),
  };
}

function formatRoundType(type: AssessmentRoundType): string {
  switch (type) {
    case 'TechnicalDiscussion':
      return 'Technical Discussion';

    case 'SystemDesign':
      return 'System Design';

    case 'Coding':
      return 'Coding';

    default:
      return type;
  }
}
export interface AssessmentResponse {
  id: string;
  organizationId: string;
  campaignId: string;

  assessmentName: string;

  content: AssessmentContent;
  structuredContent: AssessmentContent;

  status: number;
  generatedOn: string;

  rounds: AssessmentRoundResponse[];
}

export interface AssessmentContent {
  value: string;
}

export interface AssessmentRoundResponse {
  id: string;
  order: number;
  type: AssessmentRoundType;
  difficulty: AssessmentDifficulty;
  durationInMinutes: number;
  targetQuestionCount: number;
  competencies: AssessmentCompetencyResponse[];
}

export interface AssessmentCompetencyResponse {
  name: string;
  priority: AssessmentPriority;
  minimumPassPercentage: number;
}

export type AssessmentRoundType = 'Coding' | 'TechnicalDiscussion' | 'SystemDesign';

export type AssessmentDifficulty = 'Easy' | 'Medium' | 'Hard';

export type AssessmentPriority = 'Low' | 'Medium' | 'High';
