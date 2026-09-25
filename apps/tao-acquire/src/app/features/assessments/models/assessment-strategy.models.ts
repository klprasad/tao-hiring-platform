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

export interface updateAssessmentRoundRequest {
  assessmentName: string;
  rounds: AssessmentRoundVm[];
}
export interface AssessmentRoundVm {
  order: number;
  type: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  durationInMinutes: number;
  targetQuestionCount: number;
  competencies: AssessmentCompetencyVm[];
}

export interface AssessmentCompetencyVm {
  name: string;
  priority: 'Low' | 'Medium' | 'High';
  minimumPassPercentage: number;
}
export function mapAssessmentRoundToVm(round: AssessmentRoundDto): AssessmentRoundVm {
  return {
    order: round.order,
    type: formatRoundType(round.type),
    difficulty: round.difficulty,
    durationInMinutes: round.durationInMinutes,
    targetQuestionCount: round.questionCount,
    competencies: round.competencies.map((competency) => ({
      name: competency.name,
      priority: competency.priority,
      minimumPassPercentage: competency.minimumPassPercentage,
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
export interface AssessmentVm {
  id: string;
  organizationId: string;
  campaignId: string;
  assessmentName: string;
  content: string;
  structuredContent: StructuredAssessment;
  status: AssessmentStatus;
  generatedOn: string;
  approvedByUserId: string | null;
  approvedOn: string | null;

  // UI-specific mapped data
  rounds: AssessmentRoundVm[];
}

export function mapAssessmentDtoToVm(dto: AssessmentDto): AssessmentVm {
  const structuredContent = JSON.parse(dto.structuredContent.value) as StructuredAssessment;

  return {
    id: dto.id,
    organizationId: dto.organizationId,
    campaignId: dto.campaignId,
    assessmentName: dto.assessmentName,
    content: dto.content.value,
    structuredContent,
    status: dto.status,
    generatedOn: dto.generatedOn,
    approvedByUserId: dto.approvedByUserId,
    approvedOn: dto.approvedOn,

    rounds: structuredContent.rounds.map(mapAssessmentRoundToVm),
  };
}

export interface AssessmentDto {
  id: string;
  organizationId: string;
  campaignId: string;
  assessmentName: string;
  content: AssessmentContentDto;
  structuredContent: AssessmentStructuredContentDto;
  status: AssessmentStatus;
  generatedOn: string;
  approvedByUserId: string | null;
  approvedOn: string | null;
}

export interface AssessmentContentDto {
  value: string;
}

export interface AssessmentStructuredContentDto {
  value: string;
}

export type AssessmentStatus = 'Generated' | 'Approved' | 'Draft' | 'Rejected';

export interface StructuredAssessment {
  assessmentName: string;
  rounds: AssessmentRoundDto[];
}

export interface AssessmentRoundDto {
  order: number;
  type: AssessmentRoundType;
  difficulty: AssessmentDifficulty;
  durationInMinutes: number;
  questionCount: number;
  competencies: AssessmentCompetencyDto[];
}

export interface AssessmentCompetencyDto {
  name: string;
  priority: AssessmentPriority;
  minimumPassPercentage: number;
}

export type AssessmentRoundType = 'Coding' | 'TechnicalDiscussion' | 'SystemDesign';

export type AssessmentDifficulty = 'Easy' | 'Medium' | 'Hard';

export type AssessmentPriority = 'Low' | 'Medium' | 'High';
