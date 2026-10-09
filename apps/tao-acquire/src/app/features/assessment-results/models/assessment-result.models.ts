export interface AssessmentCandidate {
  candidateApplicationId: string;
  candidateName: string;
  email: string;
  phone: string;
  linkedInUrl: string | null;
  currentCompany: string | null;
  currentLocation: string | null;
  assessmentSessionId: string;
  completedOn: string | null;
}

export interface AssessmentCompetency {
  name: string;
  priority: string;
  score: number;
  minimumPassPercentage: number;
  isPassed: boolean;
}

export interface AssessmentRoundSummary {
  roundId: string;
  order: number;
  roundType: string;
  score: number;
  confidence: number;
  totalQuestions: number;
  completedQuestions: number;
  skippedQuestions: number;
}

export interface AssessmentSummary {
  assessmentSessionId: string;
  assessmentResultId: string;
  overallScore: number;
  overallConfidence: number;
  recommendation: string;
  executiveSummary: string;
  competencies: AssessmentCompetency[];
  rounds: AssessmentRoundSummary[];
}

export interface AssessmentEvidence {
  id?: string;
  type?: string;
  title?: string;
  source?: string;
  content?: string;
  [key: string]: unknown;
}

export interface AssessmentQuestionResult {
  questionId: string;
  order: number;
  primaryQuestion: string;
  status: string;
  score: number | null;
  confidence: number | null;
  strengths: string[];
  gaps: string[];
  evidence: AssessmentEvidence[];
  competencies: AssessmentCompetency[];
  hasConversation: boolean;
  hasCandidateCode: boolean;
}

export interface AssessmentRoundResult {
  assessmentSessionId: string;
  roundId: string;
  order: number;
  roundType: string;
  score: number;
  confidence: number;
  strengths: string[];
  gaps: string[];
  evidence: AssessmentEvidence[];
  questions: AssessmentQuestionResult[];
}

export type AssessmentResultRecommendation =
  'Recommended' | 'NotRecommended' | 'NeedsReview' | string;
