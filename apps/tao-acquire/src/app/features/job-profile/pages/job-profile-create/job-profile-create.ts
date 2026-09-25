import { Component, inject, output, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, EMPTY, map } from 'rxjs';

import { TaoButtonComponent, TaoPageHeaderComponent } from '@tao/ui';
import { JobProfileFormComponent } from '../../components/job-profile-form/job-profile-form';
import { JobProfileService } from '../../data-access/job-profile.service';
import {
  mapCreateJobProfileDtoToVm,
  mapJobProfileFormToCreateDto,
} from '../../data-access/job-profile.mapper';
import { JobProfileFormValue, JobProfileVm } from '../../models/job-profile.vm';

@Component({
  selector: 'tao-job-profile-create',
  imports: [TaoButtonComponent, TaoPageHeaderComponent, JobProfileFormComponent],
  templateUrl: './job-profile-create.html',
  styleUrl: './job-profile-create.scss',
})
export class JobProfileCreateComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly service = inject(JobProfileService);

  readonly errorMessage = signal('');
  readonly isSubmitting = signal(false);
  readonly jobProfile = output<JobProfileVm>();
  /**
   * Campaign the job profile belongs to.
   *
   * Comes from `/campaigns/:campaignId/job-profile` (route param), or from the
   * `campaignId` query parameter when the page is opened standalone.
   */
  readonly campaignId = this.resolveCampaignId();

  cancel(): void {
    this.router.navigate(this.campaignId ? ['/campaigns', this.campaignId] : ['/job-profiles']);
  }

  createProfile(value: JobProfileFormValue): void {
    if (!this.campaignId) {
      this.errorMessage.set('A campaign is required before generating a job profile.');
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set('');

    this.service
      .createJobProfile(this.campaignId, mapJobProfileFormToCreateDto(value))
      .pipe(
        map(mapCreateJobProfileDtoToVm),
        catchError(() => {
          this.errorMessage.set('The job profile could not be generated. Please try again.');
          this.isSubmitting.set(false);
          return EMPTY;
        }),
      )
      .subscribe((response) => {
        this.isSubmitting.set(false);
        this.jobProfile.emit(response);
        //this.router.navigate(['/campaigns', this.campaignId, 'job-profile']);
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
