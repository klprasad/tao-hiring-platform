import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, EMPTY } from 'rxjs';

import { TaoButtonComponent, TaoPageHeaderComponent } from '@tao/ui';
import { JobProfileFormComponent } from '../../components/job-profile-form/job-profile-form';
import { JobProfileService } from '../../data-access/job-profile.service';
import { mapJobProfileDtoToVm, mapJobProfileFormToCreateDto } from '../../data-access/job-profile.mapper';
import { JobProfileFormValue, JobProfileVm } from '../../models/job-profile.vm';

@Component({
  selector: 'tao-job-profile-edit',
  imports: [TaoButtonComponent, TaoPageHeaderComponent, JobProfileFormComponent],
  templateUrl: './job-profile-edit.html',
  styleUrl: './job-profile-edit.scss',
})
export class JobProfileEditComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly service = inject(JobProfileService);
  readonly profile = signal<JobProfileVm | undefined>(undefined);
  readonly errorMessage = signal('');
  readonly isLoading = signal(true);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.cancel();
      return;
    }

    this.service.getJobProfile(id).pipe(catchError(() => {
      this.errorMessage.set('The job profile could not be loaded.');
      this.isLoading.set(false);
      return EMPTY;
    })).subscribe((profile) => {
      this.profile.set(mapJobProfileDtoToVm(profile));
      this.isLoading.set(false);
    });
  }

  cancel(): void { this.router.navigate(['/job-profiles']); }

  updateProfile(value: JobProfileFormValue): void {
    const profile = this.profile();
    if (!profile) return;

    this.service.updateJobProfile(profile.id, { ...mapJobProfileFormToCreateDto(value), status: profile.status }).pipe(
      catchError(() => {
        this.errorMessage.set('The job profile could not be updated. Please try again.');
        return EMPTY;
      }),
    ).subscribe(() => this.cancel());
  }
}