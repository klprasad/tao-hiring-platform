import type { JobProfileStatus } from './job-profile.dto';

export type { JobProfileStatus } from './job-profile.dto';

/**
 * View model consumed by the job profile screens.
 */
export interface JobProfileVm {
  id: string;
  campaignId: string;
  originalJobDescription: string;
  generatedContent: string;

  /**
   * Structured JSON representation of skills, competencies and requirements.
   */
  structuredProfile: string;

  status: JobProfileStatus;
  generatedOn: string;
}

/**
 * Value emitted by the job profile form.
 */
export interface JobProfileFormValue {
  description: string;
}
