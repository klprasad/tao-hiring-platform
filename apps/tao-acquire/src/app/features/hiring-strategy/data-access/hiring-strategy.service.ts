import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiClientService } from '../../../core/api/api-client.service';
import { ApiResponse } from '../../../core/api/api-response';
import { ApproveHiringStrategyRequest, HiringStrategyDto } from '../models/hiring-strategy.models';

/**
 * Hiring strategy API client.
 *
 * Endpoints (see Campaign Endpoints documentation):
 *  - POST /api/campaigns/{campaignId}/hiring-strategy
 *  - GET  /api/campaigns/{campaignId}/hiring-strategy
 *  - POST /api/campaigns/{hiringStrategyId}/approve
 */
@Injectable({ providedIn: 'root' })
export class HiringStrategyService {
  private readonly api = inject(ApiClientService);

  /**
   * Generates an AI hiring strategy for a campaign.
   *
   * `POST /api/campaigns/{campaignId}/hiring-strategy` (empty body)
   *
   * Returns the id of the newly generated hiring strategy.
   */
  createHiringStrategy(campaignId: string): Observable<ApiResponse<string>> {
    return this.api.post<ApiResponse<string>>(`/api/campaigns/${campaignId}/hiring-strategy`);
  }

  /**
   * Gets the hiring strategy for a campaign.
   *
   * `GET /api/campaigns/{campaignId}/hiring-strategy`
   */
  getHiringStrategy(campaignId: string): Observable<ApiResponse<HiringStrategyDto>> {
    return this.api.get<ApiResponse<HiringStrategyDto>>(
      `/api/campaigns/${campaignId}/hiring-strategy`,
    );
  }

  /**
   * Approves a generated hiring strategy.
   *
   * `POST /api/campaigns/{hiringStrategyId}/approve`
   *
   * Returns `204 No Content`.
   */
  approveHiringStrategy(
    hiringStrategyId: string,
    request: ApproveHiringStrategyRequest,
  ): Observable<void> {
    return this.api.post<void, ApproveHiringStrategyRequest>(
      `/api/campaigns/${hiringStrategyId}/approve`,
      request,
    );
  }
}
