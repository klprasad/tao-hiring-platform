import { Component, computed, inject, input, OnInit, output, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, EMPTY } from 'rxjs';

import { TaoPageHeaderComponent } from '@tao/ui';
import { AuthStore } from '@tao/core';
import { JobProfileService } from '../../data-access/job-profile.service';
import { mapJobProfileFormToRegenerateDto } from '../../data-access/job-profile.mapper';
import { JobProfileStatus } from '../../models/job-profile.dto';
import { JobProfileVm, RegenerateJobProfileForm } from '../../models/job-profile.vm';
import { JobProfileFormComponent } from '../../components/job-profile-form/job-profile-form';
@Component({
  selector: 'tao-job-profile-edit',
  imports: [TaoPageHeaderComponent, JobProfileFormComponent],
  templateUrl: './job-profile-edit.html',
  styleUrl: './job-profile-edit.scss',
})
export class JobProfileEditComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly service = inject(JobProfileService);
  private readonly authStore = inject(AuthStore);
  readonly refresh = output<boolean>();
  readonly profile = input.required<JobProfileVm>();

  readonly errorMessage = signal('');

  readonly status = JobProfileStatus;
  readonly campaignId = this.resolveCampaignId();
  private resolveCampaignId(): string {
    return (
      this.route.snapshot.paramMap.get('campaignId') ??
      this.route.parent?.snapshot.paramMap.get('campaignId') ??
      this.route.snapshot.queryParamMap.get('campaignId') ??
      ''
    );
  }

  cancel(): void {
    this.router.navigate(this.campaignId ? ['/campaigns', this.campaignId] : ['/job-profiles']);
  }

  regenerateProfile(value: RegenerateJobProfileForm): void {
    if (!value.id) {
      this.errorMessage.set('A Job Profile Id is required before regenerating a job profile.');
      return;
    }

    this.errorMessage.set('');

    this.service
      .regenerateJobProfile(value.id, mapJobProfileFormToRegenerateDto(value))
      .pipe(
        catchError(() => {
          this.errorMessage.set('The job profile could not be generated. Please try again.');
          return EMPTY;
        }),
      )
      .subscribe(() => {
        this.refresh.emit(true);
      });
  }
}
