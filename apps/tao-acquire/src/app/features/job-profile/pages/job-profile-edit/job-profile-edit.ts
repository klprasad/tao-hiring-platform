import { Component, computed, inject, input, OnInit, output, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, EMPTY } from 'rxjs';

import { TaoButtonComponent, TaoCardComponent, TaoPageHeaderComponent } from '@tao/ui';
import { AuthStore } from 'tao-core';
import { JobProfileService } from '../../data-access/job-profile.service';
import { mapJobProfileDtoToVm } from '../../data-access/job-profile.mapper';
import { JobProfileStatus } from '../../models/job-profile.dto';
import { JobProfileVm } from '../../models/job-profile.vm';
import { JobProfilePreviewComponent } from '../../components/job-profile-preview/job-profile-preview';
@Component({
  selector: 'tao-job-profile-edit',
  imports: [TaoButtonComponent, TaoPageHeaderComponent, JobProfilePreviewComponent],
  templateUrl: './job-profile-edit.html',
  styleUrl: './job-profile-edit.scss',
})
export class JobProfileEditComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly service = inject(JobProfileService);
  private readonly authStore = inject(AuthStore);

  /**
   * Profile under review.
   *
   * Host screens (for example the job profile list) supply the profile
   * directly so the editor can be rendered inline. When omitted the profile is
   * loaded from the `id` route parameter, keeping the routed page working.
   */
  readonly profile = input<JobProfileVm>();

  /** Emitted when the reviewer leaves the inline editor. */
  readonly closed = output<void>();

  /** Emitted after a successful approval so hosts can refresh their data. */
  readonly approved = output<JobProfileVm>();

  private readonly loadedProfile = signal<JobProfileVm | undefined>(undefined);

  /** Resolved profile, sourced from the input when supplied, otherwise the API. */
  readonly currentProfile = computed(() => this.profile() ?? this.loadedProfile());

  readonly errorMessage = signal('');
  readonly isLoading = signal(true);
  readonly isApproving = signal(false);

  readonly status = JobProfileStatus;

  ngOnInit(): void {
    if (this.profile()) {
      this.isLoading.set(false);
      return;
    }

    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.cancel();
      return;
    }

    this.loadProfile(id);
  }

  cancel(): void {
    if (this.profile()) {
      this.closed.emit();
      return;
    }

    const campaignId = this.resolveCampaignId();

    this.router.navigate(campaignId ? ['/campaigns', campaignId] : ['/job-profiles']);
  }

  approve(): void {
    const profile = this.currentProfile();
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
        this.approved.emit(updatedProfile);
        this.isApproving.set(false);
      });
  }

  private loadProfile(id: string): void {
    this.service
      .getJobProfile(id)
      .pipe(
        catchError((error: unknown) => {
          this.errorMessage.set(this.describeError(error, 'The job profile could not be loaded.'));
          this.isLoading.set(false);
          return EMPTY;
        }),
      )
      .subscribe((response) => {
        this.loadedProfile.set(mapJobProfileDtoToVm(response.value));
        this.isLoading.set(false);
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

  private describeError(error: unknown, fallback: string): string {
    if (error instanceof Error && error.message) {
      return error.message;
    }

    return fallback;
  }
}
