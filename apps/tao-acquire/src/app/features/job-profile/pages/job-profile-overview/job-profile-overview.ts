import { Component, computed, inject, input, OnInit, output, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, EMPTY } from 'rxjs';

import { TaoButtonComponent, TaoPageHeaderComponent } from '@tao/ui';
import { AuthStore } from '@tao/core';
import { JobProfileService } from '../../data-access/job-profile.service';
import { mapJobProfileDtoToVm } from '../../data-access/job-profile.mapper';
import { JobProfileDto, JobProfileStatus } from '../../models/job-profile.dto';
import { JobProfileVm } from '../../models/job-profile.vm';
import { JobProfilePreviewComponent } from '../../components/job-profile-preview/job-profile-preview';
import { JobProfileEditComponent } from '../job-profile-edit/job-profile-edit';
import { JobProfileCreateComponent } from '../job-profile-create/job-profile-create';

@Component({
  imports: [
    TaoButtonComponent,
    TaoPageHeaderComponent,
    JobProfilePreviewComponent,
    JobProfileEditComponent,
    JobProfileCreateComponent,
  ],
  selector: 'tao-job-profile-overview',
  styleUrl: './job-profile-overview.scss',
  templateUrl: './job-profile-overview.html',
})
export class JobProfileOverview implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly service = inject(JobProfileService);
  private readonly authStore = inject(AuthStore);

  readonly loadedProfile = signal<JobProfileVm | null>(null);
  readonly isEditing = signal(false);
  readonly profileNotFound = signal(false);
  readonly errorMessage = signal('');
  readonly isApproving = signal(false);
  readonly status = JobProfileStatus;

  ngOnInit(): void {
    this.loadJobProfile();
  }
  reloadJobProfile() {
    this.isEditing.set(false);
    this.loadJobProfile();
  }
  loadJobProfile() {
    const campaignId = this.route.snapshot.paramMap.get('campaignId');
    if (campaignId) this.loadProfileByCampaign(campaignId);
  }

  editProfile(): void {
    this.isEditing.set(true);
  }
  createdJobProfile(profile: JobProfileVm): void {
    this.loadedProfile.set(profile);
    this.profileNotFound.set(false);
  }
  cancel(): void {
    const campaignId = this.route.snapshot.paramMap.get('campaignId');
    this.router.navigate(campaignId ? ['/campaigns', campaignId] : ['/job-profiles']);
  }

  approve(): void {
    const profile = this.loadedProfile();
    const approvedByUserId = this.authStore.user()?.id;

    if (!profile || this.isApproving()) {
      return;
    }

    if (!approvedByUserId) {
      this.errorMessage.set('You must be signed in to approve a job profile.');
      return;
    }
    this.isApproving.set(true);
    this.errorMessage.set('');

    this.service
      .approveJobProfile(profile.id, { approvedByUserId })
      .pipe(
        catchError((error: unknown) => {
          this.errorMessage.set(
            this.describeError(error, 'The job profile could not be approved.'),
          );
          this.isApproving.set(false);
          return EMPTY;
        }),
      )
      .subscribe(() => {
        const updatedProfile = { ...profile, status: JobProfileStatus.Approved };

        this.loadedProfile.set(updatedProfile);
        this.isApproving.set(false);
        this.router.navigate(['/campaigns', profile.campaignId, 'hiring-strategy-create']);
      });
  }

  private loadProfileByCampaign(id: string): void {
    this.service
      .getJobProfileByCampaign(id)
      .pipe(
        catchError((error: unknown) => {
          if (this.isJobProfileNotFound(error, id)) {
            this.loadedProfile.set(null);
            this.profileNotFound.set(true);
          }
          this.errorMessage.set(this.describeError(error, 'The job profile could not be loaded.'));
          return EMPTY;
        }),
      )
      .subscribe((response: JobProfileDto) => {
        this.loadedProfile.set(mapJobProfileDtoToVm(response));
        this.profileNotFound.set(false);
      });
  }
  isJobProfileNotFound = (error: unknown, campaignId: string): boolean => {
    if (typeof error !== 'object' || error === null) {
      return false;
    }

    const apiError = error as {
      error?: {
        detail?: unknown;
      };
    };

    return (
      typeof apiError.error?.detail === 'string' &&
      apiError.error.detail === `Job Profile for campaign '${campaignId}' was not found.`
    );
  };
  private describeError(error: unknown, fallback: string): string {
    if (error instanceof Error && error.message) {
      return error.message;
    }

    return fallback;
  }
}
