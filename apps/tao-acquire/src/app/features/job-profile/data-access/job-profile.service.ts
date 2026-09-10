import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiClientService } from '../../../core/api/api-client.service';
import { JobProfileFilters } from '../models/job-profile.filters';
import { CreateJobProfileDto, JobProfileDto, UpdateJobProfileDto } from '../models/job-profile.dto';

@Injectable({ providedIn: 'root' })
export class JobProfileService {
  private readonly api = inject(ApiClientService);
  private readonly baseUrl = '/api/job-profiles';

  getJobProfiles(filters: JobProfileFilters = {}): Observable<JobProfileDto[]> {
    return this.api.get<JobProfileDto[]>(this.baseUrl, { params: { ...filters } });
  }

  getJobProfile(id: string): Observable<JobProfileDto> {
    return this.api.get<JobProfileDto>(`${this.baseUrl}/${id}`);
  }

  createJobProfile(request: CreateJobProfileDto): Observable<JobProfileDto> {
    return this.api.post<JobProfileDto, CreateJobProfileDto>(this.baseUrl, request);
  }

  updateJobProfile(id: string, request: UpdateJobProfileDto): Observable<JobProfileDto> {
    return this.api.put<JobProfileDto, UpdateJobProfileDto>(`${this.baseUrl}/${id}`, request);
  }

  deleteJobProfile(id: string): Observable<void> {
    return this.api.delete<void>(`${this.baseUrl}/${id}`);
  }
}