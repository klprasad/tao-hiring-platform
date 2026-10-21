import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiClientService } from '@tao/core';
import { sendIvitationsRespose } from '../models/invitations.model';

@Injectable({
  providedIn: 'root',
})
export class InvitationsService {
  private readonly api = inject(ApiClientService);

  sendInvitations(campaignId: string): Observable<sendIvitationsRespose> {
    return this.api.post<sendIvitationsRespose, void>(
      `/api/candidate-applications/${campaignId}/send-recommended-emails`,
    );
  }
}
