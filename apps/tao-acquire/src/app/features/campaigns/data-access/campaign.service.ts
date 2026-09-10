import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiClientService } from '../../../core/api/api-client.service';

export interface Campaign {
  id: number;
  name: string;
  description: string;
  status: string;
}

export interface CreateCampaignRequest {
  organizationId: string;
  name: string;
  referenceNumber: string;
  recruiterId: string;
  hiringManagerId: string;
  numberOfOpenings: number;
}

@Injectable({
  providedIn: 'root',
})
export class CampaignService {
  private readonly api = inject(ApiClientService);

  private readonly baseUrl = '/api/campaigns';

  /**
   this.api.get<Campaign[]>(
  '/api/campaigns',
  {
    params: {
      page: 1,
      pageSize: 25,
      search: 'angular',
      active: true,
    },
  },
);
   */

  getCampaigns(): Observable<Campaign[]> {
    return this.api.get<Campaign[]>(this.baseUrl);
  }

  getCampaign(id: number): Observable<Campaign> {
    return this.api.get<Campaign>(`${this.baseUrl}/${id}`);
  }

  createCampaign(request: CreateCampaignRequest): Observable<Campaign> {
    return this.api.post<Campaign, CreateCampaignRequest>(this.baseUrl, request);
  }

  updateCampaign(id: number, request: CreateCampaignRequest): Observable<Campaign> {
    return this.api.put<Campaign, CreateCampaignRequest>(`${this.baseUrl}/${id}`, request);
  }

  deleteCampaign(id: number): Observable<void> {
    return this.api.delete<void>(`${this.baseUrl}/${id}`);
  }
}
