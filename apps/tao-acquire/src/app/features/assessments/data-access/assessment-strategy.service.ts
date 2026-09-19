import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiClientService } from '../../../core/api/api-client.service';
import { ApiResponse } from '../../../core/api/api-response';
import {
  ApproveAssessmentStrategyRequest,
  AssessmentResponse,
} from '../models/assessment-strategy.models';

/**
 * Assessment strategy API client.
 *
 * Endpoints (see Campaign Endpoints documentation):
 *  - POST /api/campaigns/{campaignId}/assessment-strategy
 *  - POST /api/campaigns/assessment-strategies/{assessmentStrategyId}/approve
 */
@Injectable({ providedIn: 'root' })
export class AssessmentStrategyService {
  private readonly api = inject(ApiClientService);

  /**
   * Generates an assessment strategy for a campaign.
   *
   * `POST /api/campaigns/{campaignId}/assessment-strategy` (empty body)
   *
   * Returns the id of the newly created assessment strategy.
   */
  createAssessmentStrategy(campaignId: string): Observable<AssessmentResponse> {
    return this.api.post<AssessmentResponse>(`/api/campaigns/${campaignId}/assessment-strategy`);
  }

  /**
   * Approves an assessment strategy.
   *
   * `POST /api/campaigns/assessment-strategies/{assessmentStrategyId}/approve`
   *
   * Returns `204 No Content`.
   */
  approveAssessmentStrategy(
    assessmentStrategyId: string,
    request: ApproveAssessmentStrategyRequest,
  ): Observable<void> {
    return this.api.post<void, ApproveAssessmentStrategyRequest>(
      `/api/campaigns/assessment-strategies/${assessmentStrategyId}/approve`,
      request,
    );
  }
}
