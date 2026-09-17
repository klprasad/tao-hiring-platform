import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiClientService } from '../../../core/api/api-client.service';
import { ApiResponse } from '../../../core/api/api-response';
import { CampaignCreateRequest, CampaignDto, CampaignWorkflowDto } from '../models/campaign.models';

/**
 * Campaign API client.
 *
 * Endpoints (see Campaign Endpoints documentation):
 *  - POST /api/campaigns/
 *  - POST /api/campaigns/{campaignId}/resume-imports
 */
@Injectable({
  providedIn: 'root',
})
export class CampaignService {
  private readonly api = inject(ApiClientService);

  private readonly baseUrl = '/api/campaigns';

  /**
   * Get All campaigns.
   *
   * `Get /api/campaigns/`
   *
   * Returns all campaigns.
   */
  getAllCampaigns(): Observable<CampaignDto[]> {
    return this.api.get<CampaignDto[]>(`${this.baseUrl}`);
  }

  /**
   * Get campaign by campaignId.
   *
   * `Get /api/campaigns/{campaignId}`
   *
   * Returns the campaign.
   */
  getCampaignById(campaignId: string): Observable<CampaignDto> {
    return this.api.get<CampaignDto>(`${this.baseUrl}/${campaignId}`);
  }

  /**
   * Get campaign workflows by campaignId.
   *
   * `Get /api/campaigns/{campaignId}/workflow-state`
   *
   * Returns the campaign workflows.
   */
  getCampaignWorkflows(campaignId: string): Observable<CampaignWorkflowDto> {
    return this.api.get<CampaignWorkflowDto>(`${this.baseUrl}/${campaignId}/workflow-state`);
  }

  /**
   * Creates a new campaign.
   *
   * `POST /api/campaigns/`
   *
   * Returns the id of the newly created campaign.
   */
  createCampaign(request: CampaignCreateRequest): Observable<ApiResponse<string>> {
    return this.api.post<ApiResponse<string>, CampaignCreateRequest>(`${this.baseUrl}/`, request);
  }

  /**
   * Imports one or more resume files into a campaign.
   *
   * `POST /api/campaigns/{campaignId}/resume-imports`
   *
   * `multipart/form-data` with a repeated `Resumes` field.
   * Returns the id of the resume import batch.
   */
  importResumes(campaignId: string, files: readonly File[]): Observable<ApiResponse<string>> {
    const formData = new FormData();

    for (const file of files) {
      formData.append('Resumes', file, file.name);
    }

    return this.api.post<ApiResponse<string>>(
      `${this.baseUrl}/${campaignId}/resume-imports`,
      formData,
    );
  }
}
