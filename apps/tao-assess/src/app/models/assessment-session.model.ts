export interface AssessmentSessionDto {
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
  id: string;
  number: number;
  total: number;
  type: 'technical' | 'follow-up' | 'coding';
  prompt: string;
  roundId: number;
  roundType: string;
  roundName: string;
  durationMinutes: number;
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
