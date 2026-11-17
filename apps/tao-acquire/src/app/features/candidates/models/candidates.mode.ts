export interface CandidateDto {
  id: string;
  candidateName: string;
  email: string;
  phone: string;
  linkedInUrl: string;
  currentCompany: string | null;
  currentLocation: string;
  overallMatchPercentage: number;
  status: string;
  resumeUploadedOn: string;
  lastScreenedOn: string | null;
}

export interface ResumeScreeningProgress {
  campaignId: string;
  totalCandidates: number;
  queuedCandidates: number;
  processingCandidates: number;
  completedCandidates: number;
  failedCandidates: number;
  processedCandidates: number;
  pendingSchedulingCandidates: number;
  activeImportBatches: number;
  totalBatches: number;
  queuedBatches: number;
  processingBatches: number;
  completedBatches: number;
  partiallyCompletedBatches: number;
  failedBatches: number;
  isCompleted: boolean;
  batches: any[];
}
