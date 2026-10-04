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
  isFollowUpQuestion: boolean;
  competencies: string[];
}

export interface SaveCandidateResponseRequest {
  response: string;
}

export interface SaveCandidateResponseResult {
  assessmentCompleted: boolean;
  questionId: string;
  order: number;
  question: string;
  competencies: string[];
  roundType: AssessmentRoundType;
  roundDurationInMinutes: number;
  isFollowUpQuestion: boolean;
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
export interface AssessmentSessionWorkflowDto {
  assessmentSessionId: string;
  status: string;
  currentStage: string;
  completionPercentage: number;

  totalRounds: number;
  completedRounds: number;
  remainingRounds: number;

  totalQuestions: number;
  completedQuestions: number;
  skippedQuestions: number;
  remainingQuestions: number;

  currentRoundId: string | null;
  currentRoundOrder: number | null;
  currentRoundType: AssessmentRoundType | null;

  currentQuestionId: string | null;
  currentQuestionOrder: number | null;

  startedOn: string | null;
  lastActivityOn: string | null;
  assessmentExpiresOn: string | null;

  canResume: boolean;
  isInterrupted: boolean;

  rounds: AssessmentRoundWorkflowDto[];
}

export interface AssessmentRoundWorkflowDto {
  roundId: string;
  order: number;
  type: AssessmentRoundType;
  status: string;

  totalQuestions: number;
  completedQuestions: number;
  skippedQuestions: number;
  remainingQuestions: number;

  completionPercentage: number;

  startedOn: string | null;
  completedOn: string | null;
}
