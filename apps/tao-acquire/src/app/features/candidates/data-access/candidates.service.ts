import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiClientService } from '../../../core/api/api-client.service';
import { CandidateDto } from '../models/candidates.mode';

@Injectable({ providedIn: 'root' })
export class CandidatesService {
  private readonly api = inject(ApiClientService);

  /**
   * Get All candidates screening results for a campaign.
   *
   * `GET /api/candidate-applications/{campaignId}/candidates` (empty body)
   *
   * Returns candidates screening results.
   */
  getCandidates(campaignId: string): Observable<CandidateDto[]> {
    return this.api.get<CandidateDto[]>(`/api/candidate-applications/${campaignId}/candidates`);
  }
}
