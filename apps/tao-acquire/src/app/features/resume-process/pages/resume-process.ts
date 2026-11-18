import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { TaoButtonComponent, TaoCardComponent, ToasterService } from '@tao/ui';
import { ResumeImportService } from '../data-access/resume-import.service';
import {
  RESUME_IMPORT_ALLOWED_EXTENSIONS,
  RESUME_IMPORT_MAX_FILES,
} from '../models/resume-import.models';

@Component({
  selector: 'tao-resume-process',
  imports: [TaoCardComponent, TaoButtonComponent],
  templateUrl: './resume-process.html',
  styleUrl: './resume-process.scss',
})
export class ResumeProcess {
  private readonly route = inject(ActivatedRoute);
  private readonly service = inject(ResumeImportService);
  private readonly router = inject(Router);
  private readonly toaster = inject(ToasterService);
  readonly campaignId = this.resolveCampaignId();
  private readonly processing = this.service.stateForCampaign(this.campaignId);
  readonly isUploading = this.processing.isUploading;
  readonly isScreening = this.processing.isScreening;
  readonly batchId = this.processing.batchId;
  readonly importProgress = this.processing.importProgress;
  readonly screeningProgress = this.processing.screeningProgress;
  readonly progressError = this.processing.importError;
  readonly screeningError = this.processing.screeningError;
  readonly progressPercent = computed(() => {
    const progress = this.importProgress();
    return progress?.totalFiles
      ? Math.round((progress.processedFiles / progress.totalFiles) * 100)
      : 0;
  });
  readonly screeningPercent = computed(() => {
    const progress = this.screeningProgress();
    return progress?.totalCandidates
      ? Math.round((progress.processedCandidates / progress.totalCandidates) * 100)
      : 0;
  });

  readonly acceptedFormats = RESUME_IMPORT_ALLOWED_EXTENSIONS.join(',');
  readonly maxFiles = RESUME_IMPORT_MAX_FILES;

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

    this.service.startImport(this.campaignId, files);
    input.value = '';
  }

  navigateToCandidates(): void {
    this.router.navigate(['/campaigns', this.campaignId, 'candidates']);
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
