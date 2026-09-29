export interface AssessmentSessionDto {
  id: string;
  candidateApplicationId: string;
  assessmentStrategyId: string;
  status: string;
  strategySnapshot: strategySnapshotDto;
  currentSessionRoundId: string;
  currentQuestionId: string;
  consentAcceptedOn: string;
  consentVersion: number;
  startedOn: string;
  completedOn: string;
  assessmentExpiresOn: string;
  lastActivityOn: string;
  hasUsedInterruptionWindow: boolean;
  isInterrupted: boolean;
  rounds: AssessmentRoundDto[];
}
export interface strategySnapshotDto {
  value: string;
}
export interface AssessmentRoundDto {
  id: string;
  assessmentRoundId: string;
  order: number;
  type: AssessmentRoundType;
  difficulty: AssessmentDifficulty;
  durationInMinutes: number;
  targetQuestionCount: number;
  status: string;
  startedOn: string;
  expiresOn: string;
  completedOn: string;
  competencies: AssessmentCompetencyDto[];
  questions: any;
}
export interface AssessmentStrategyDto {
  AssessmentName: string;
  Rounds: AssessmentStrategyRoundDto[];
}
export interface AssessmentStrategyRoundDto {
  Order: number;
  Type: AssessmentRoundType;
  Difficulty: AssessmentDifficulty;
  DurationInMinutes: number;
  QuestionCount: number;
  Competencies: AssessmentCompetencyDto[];
}
export interface AssessmentCompetencyDto {
  name: string;
  priority: AssessmentCompetencyPriority;
  minimumPassPercentage: number;
}

export enum AssessmentRoundType {
  Coding = 'Coding',
  TechnicalDiscussion = 'TechnicalDiscussion',
  SystemDesign = 'SystemDesign',
}

export enum AssessmentDifficulty {
  Easy = 'Easy',
  Medium = 'Medium',
  Hard = 'Hard',
}

export enum AssessmentCompetencyPriority {
  High = 'High',
  Low = 'Low',
}
export interface AssessmentQuestionDto {
  questionId: string;
  order: number;
  question: string;
  roundType: AssessmentRoundType;
  roundName: string;
  roundDurationInMinutes: number;
  competencies: string[];
}

export interface SaveCandidateResponseRequest {
  response: string;
}

export interface SaveCandidateResponseResult {
  saved: boolean;
  roundCompleted: boolean;
  assessmentCompleted: boolean;
  nextQuestion: AssessmentQuestionDto | null;
}
export interface AssessmentSessionVm {
  id: string;
  candidateApplicationId: string;
  assessmentStrategyId: string;
  status: string;

  strategySnapshot: AssessmentStrategyDto;

  currentSessionRoundId: string | null;
  currentQuestionId: string | null;

  consentAcceptedOn: string | null;
  consentVersion: number;

  startedOn: string | null;
  completedOn: string | null;
  assessmentExpiresOn: string | null;
  lastActivityOn: string | null;

  hasUsedInterruptionWindow: boolean;
  isInterrupted: boolean;

  rounds: AssessmentRoundDto[];
}
export function mapAssessmentSession(dto: AssessmentSessionDto): AssessmentSessionVm {
  const strategy = JSON.parse(dto.strategySnapshot.value) as AssessmentStrategyDto;

  return {
    ...dto,
    strategySnapshot: strategy,
  };
}
