import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, EMPTY } from 'rxjs';

import { TaoButtonComponent, TaoPageHeaderComponent } from '@tao/ui';
import { JobProfileFormComponent } from '../../components/job-profile-form/job-profile-form';
import { JobProfileService } from '../../data-access/job-profile.service';
import { mapJobProfileFormToCreateDto } from '../../data-access/job-profile.mapper';
import { JobProfileFormValue } from '../../models/job-profile.vm';

@Component({
  selector: 'tao-job-profile-create',
  imports: [TaoButtonComponent, TaoPageHeaderComponent, JobProfileFormComponent],
  templateUrl: './job-profile-create.html',
  styleUrl: './job-profile-create.scss',
})
export class JobProfileCreateComponent {
  private readonly router = inject(Router);
  private readonly service = inject(JobProfileService);
  readonly errorMessage = signal('');

  cancel(): void { this.router.navigate(['/job-profiles']); }

  createProfile(value: JobProfileFormValue): void {
    this.service.createJobProfile(mapJobProfileFormToCreateDto(value)).pipe(
      catchError(() => {
        this.errorMessage.set('The job profile could not be saved. Please try again.');
        return EMPTY;
      }),
    ).subscribe(() => this.cancel());
  }
}