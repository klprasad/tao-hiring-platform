/**
 * Job profile status values as defined by the campaign API.
 *
 * 1 = Generated, 2 = Approved.
 */
export const JobProfileStatus = {
  Generated: 1,
  Approved: 2,
} as const;

export type JobProfileStatus = (typeof JobProfileStatus)[keyof typeof JobProfileStatus];

export const JOB_PROFILE_STATUS_LABELS: Record<JobProfileStatus, string> = {
  [JobProfileStatus.Generated]: 'Generated',
  [JobProfileStatus.Approved]: 'Approved',
};

/**
 * Request body for `POST /api/campaigns/{campaignId}/job-profile`.
 */
export interface CreateJobProfileRequest {
  /**
   * Original job description text to analyse.
   *
   * Min length: 50, Max length: 10000.
   */
  originalJobDescription: string;
}

/**
 * Request body for `POST /api/jobprofiles/{jobProfileId}/approve`.
 */
export interface ApproveJobProfileRequest {
  approvedByUserId: string;
}

/**
 * Response payload for `GET /api/jobprofiles/{jobProfileId}`.
 */
export interface JobProfileDto {
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
