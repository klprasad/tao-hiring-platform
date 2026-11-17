import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiClientService } from '@tao/core';
import { CandidateDto, ResumeScreeningProgress } from '../models/candidates.mode';
import { sendIvitationsRespose } from '../../invitations/models/invitations.model';

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
  getResumeScreeningProgress(campaignId: string): Observable<ResumeScreeningProgress> {
    return this.api.get<ResumeScreeningProgress>(
      `api/campaigns/${campaignId}/resume-screening/progress`,
    );
  }
  sendInvitations(campaignId: string): Observable<sendIvitationsRespose> {
    return this.api.post<sendIvitationsRespose, void>(
      `/api/candidate-applications/${campaignId}/send-recommended-emails`,
    );
  }
}
