/**
 * Resume import constraints as defined by the campaign API.
 */
export const RESUME_IMPORT_FORM_FIELD = 'Resumes';

export const RESUME_IMPORT_ALLOWED_EXTENSIONS = ['.pdf', '.docx'] as const;

/** 10 MB per file. */
export const RESUME_IMPORT_MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

/** Minimum and maximum number of files per request. */
export const RESUME_IMPORT_MIN_FILES = 1;
export const RESUME_IMPORT_MAX_FILES = 100;

export interface candidateScreeningRespose {
  totalCandidates: number;
  candidatesAlreadyScreened: number;
  candidatesScreened: number;
  recommendedCandidates: number;
  notRecommendedCandidates: number;
  failedCandidates: number;
}
export interface ResumeImportProgess {
  resumeImportId: string;
  campaignId: string;
  status: string;
  totalFiles: number;
  queuedFiles: number;
  processingFiles: number;
  successfulFiles: number;
  failedFiles: number;
  processedFiles: number;
  isCompleted: boolean;
  completedOn: string;
  files: any[];
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
