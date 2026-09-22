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

@Component({
  imports: [
    TaoButtonComponent,
    TaoPageHeaderComponent,
    JobProfilePreviewComponent,
    JobProfileEditComponent,
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

  readonly loadedProfile = signal<JobProfileVm | undefined>(undefined);
  readonly isEditing = signal(false);
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
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.loadProfile(id);
    else {
      const campaignId = this.route.snapshot.paramMap.get('campaignId');
      if (campaignId) this.loadProfileByCampaign(campaignId);
    }
  }

  editProfile(): void {
    this.isEditing.set(true);
  }
  cancel(): void {
    const campaignId = this.route.snapshot.paramMap.get('campaignId');
    this.router.navigate(campaignId ? ['/campaigns', campaignId] : ['/job-profiles']);
  }

  approve(): void {
    const profile = this.loadedProfile();
    const approvedByUserId = '019FEA88-4F8F-7018-BB69-88C0B2611DEB'; // this.authStore.user()?.id;

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

  private loadProfile(id: string): void {
    this.service
      .getJobProfile(id)
      .pipe(
        catchError((error: unknown) => {
          this.errorMessage.set(this.describeError(error, 'The job profile could not be loaded.'));
          return EMPTY;
        }),
      )
      .subscribe((response: JobProfileDto) => {
        this.loadedProfile.set(mapJobProfileDtoToVm(response));
      });
  }
  private loadProfileByCampaign(id: string): void {
    this.service
      .getJobProfileByCampaign(id)
      .pipe(
        catchError((error: unknown) => {
          if (this.isJobProfileNotFound(error)) {
            this.router.navigate(['/campaigns', id, 'job-profile-create']);
          }
          this.errorMessage.set(this.describeError(error, 'The job profile could not be loaded.'));
          return EMPTY;
        }),
      )
      .subscribe((response: JobProfileDto) => {
        this.loadedProfile.set(mapJobProfileDtoToVm(response));
      });
  }
  private isJobProfileNotFound(error: unknown): boolean {
    return (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as { code?: unknown }).code === 'JobProfile.NotFound'
    );
  }
  private describeError(error: unknown, fallback: string): string {
    if (error instanceof Error && error.message) {
      return error.message;
    }

    return fallback;
  }
}
