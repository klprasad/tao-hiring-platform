import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiClientService, ApiResponse } from '@tao/core';
import {
  ApproveJobProfileRequest,
  CreateJobProfileRequest,
  JobProfileDto,
} from '../models/job-profile.dto';

/**
 * Job profile API client.
 *
 * Endpoints (see Campaign Endpoints documentation):
 *  - POST /api/campaigns/{campaignId}/job-profile
 *  - GET  /api/jobprofiles/{jobProfileId}
 *  - POST /api/jobprofiles/{jobProfileId}/approve
 */
@Injectable({ providedIn: 'root' })
export class JobProfileService {
  private readonly api = inject(ApiClientService);

  /**
   * Generates an AI job profile for a campaign.
   *
   * `POST /api/campaigns/{campaignId}/job-profile`
   *
   * Returns the id of the newly generated job profile.
   */
  createJobProfile(
    campaignId: string,
    request: CreateJobProfileRequest,
  ): Observable<ApiResponse<string>> {
    return this.api.post<ApiResponse<string>, CreateJobProfileRequest>(
      `/api/campaigns/${campaignId}/job-profile`,
      request,
    );
  }
  /**
   * Regenerates an AI job profile for a campaign.
   *
   * `PUT /api/jobprofiles/{jobProfileId}/regenerate`
   *
   * Returns the id of the newly generated job profile.
   */
  regenerateJobProfile(
    jobProfileId: string,
    request: CreateJobProfileRequest,
  ): Observable<ApiResponse<string>> {
    return this.api.put<ApiResponse<string>, CreateJobProfileRequest>(
      `/api/jobprofiles/${jobProfileId}/regenerate`,
      request,
    );
  }

  /**
   * Gets a job profile by id.
   *
   * `GET /api/jobprofiles/{jobProfileId}`
   */
  getJobProfile(jobProfileId: string): Observable<JobProfileDto> {
    return this.api.get<JobProfileDto>(`/api/jobprofiles/${jobProfileId}`);
  }
  /**
   * Gets a job profile by campaignId.
   *
   * `GET /api/campaigns/{campaignId}/job-profile`
   */
  getJobProfileByCampaign(campaignId: string): Observable<JobProfileDto> {
    return this.api.get<JobProfileDto>(`/api/campaigns/${campaignId}/job-profile`);
  }

  /**
   * Approves a generated job profile.
   *
   * `POST /api/jobprofiles/{jobProfileId}/approve`
   *
   * Returns `204 No Content`.
   */
  approveJobProfile(jobProfileId: string, request: ApproveJobProfileRequest): Observable<void> {
    return this.api.post<void, ApproveJobProfileRequest>(
      `/api/jobprofiles/${jobProfileId}/approve`,
      request,
    );
  }
}
