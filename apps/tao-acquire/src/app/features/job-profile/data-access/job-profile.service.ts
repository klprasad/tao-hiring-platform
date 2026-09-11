import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiClientService } from '../../../core/api/api-client.service';
import { ApiResponse } from '../../../core/api/api-response';
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
   * Gets a job profile by id.
   *
   * `GET /api/jobprofiles/{jobProfileId}`
   */
  getJobProfile(jobProfileId: string): Observable<ApiResponse<JobProfileDto>> {
    return this.api.get<ApiResponse<JobProfileDto>>(`/api/jobprofiles/${jobProfileId}`);
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
