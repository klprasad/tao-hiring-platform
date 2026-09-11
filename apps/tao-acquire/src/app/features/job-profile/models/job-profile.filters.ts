import type { JobProfileStatus } from './job-profile.dto';

/**
 * Filtering options for job profile queries.
 */
export interface JobProfileFilters {
  /**
   * Restrict results to a single campaign.
   */
  campaignId?: string;

  /**
   * Restrict results to a single job profile status.
   */
  status?: JobProfileStatus;

  /**
   * Free-text search term.
   */
  search?: string;
}
