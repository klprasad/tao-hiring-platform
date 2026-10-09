import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, EMPTY } from 'rxjs';

import { TaoCardComponent, TaoPageHeaderComponent, ToasterService } from '@tao/ui';
import { ResumeImportService } from '../data-access/resume-import.service';
import {
  RESUME_IMPORT_ALLOWED_EXTENSIONS,
  RESUME_IMPORT_MAX_FILES,
} from '../models/resume-import.models';

@Component({
  selector: 'tao-resume-process',
  imports: [TaoCardComponent, TaoPageHeaderComponent],
  templateUrl: './resume-process.html',
  styleUrl: './resume-process.scss',
})
export class ResumeProcess {
  private readonly route = inject(ActivatedRoute);
  private readonly service = inject(ResumeImportService);
  private readonly router = inject(Router);
  private readonly toaster = inject(ToasterService);
  readonly isUploading = signal(false);
  readonly batchId = signal<string | undefined>(undefined);

  readonly acceptedFormats = RESUME_IMPORT_ALLOWED_EXTENSIONS.join(',');
  readonly maxFiles = RESUME_IMPORT_MAX_FILES;

  /**
   * Campaign the resumes are imported into.
   *
   * Comes from `/campaigns/:campaignId/resume-imports` (route param), or from
   * the `campaignId` query parameter when opened standalone.
   */
  readonly campaignId = this.resolveCampaignId();

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files ?? []);

    if (!this.campaignId) {
      this.toaster.error('A campaign is required to import resumes.');
      return;
    }

    if (files.length === 0) {
      return;
    }

    this.isUploading.set(true);

    this.service
      .importResumes(this.campaignId, files)
      .pipe(
        catchError(() => {
          this.toaster.error('The resumes could not be imported. Please try again.');
          this.isUploading.set(false);
          return EMPTY;
        }),
      )
      .subscribe((response) => {
        this.batchId.set(response);
        this.isUploading.set(false);
        this.toaster.success('Resume import started successfully.');
        input.value = '';
        this.candidatesScreening();
      });
  }
  candidatesScreening() {
    this.service
      .candidateScreening(this.campaignId)
      .pipe(
        catchError(() => {
          return EMPTY;
        }),
      )
      .subscribe(() => {
        this.router.navigate(['/campaigns', this.campaignId, 'candidates']);
      });
  }

  private resolveCampaignId(): string {
    return (
      this.route.snapshot.paramMap.get('campaignId') ??
      this.route.parent?.snapshot.paramMap.get('campaignId') ??
      this.route.snapshot.queryParamMap.get('campaignId') ??
      ''
    );
  }
}
