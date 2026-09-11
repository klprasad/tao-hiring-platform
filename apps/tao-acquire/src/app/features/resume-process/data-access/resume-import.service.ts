import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiClientService } from '../../../core/api/api-client.service';
import { ApiResponse } from '../../../core/api/api-response';
import { RESUME_IMPORT_FORM_FIELD } from '../models/resume-import.models';

/**
 * Resume import API client.
 *
 * Endpoint (see Campaign Endpoints documentation):
 *  - POST /api/campaigns/{campaignId}/resume-imports
 */
@Injectable({ providedIn: 'root' })
export class ResumeImportService {
  private readonly api = inject(ApiClientService);

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
      formData.append(RESUME_IMPORT_FORM_FIELD, file, file.name);
    }

    return this.api.post<ApiResponse<string>>(
      `/api/campaigns/${campaignId}/resume-imports`,
      formData,
    );
  }
}
