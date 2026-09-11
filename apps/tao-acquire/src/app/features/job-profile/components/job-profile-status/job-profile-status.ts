import { Component, computed, input } from '@angular/core';

import { JOB_PROFILE_STATUS_LABELS, JobProfileStatus } from '../../models/job-profile.dto';

@Component({
  selector: 'tao-job-profile-status',
  templateUrl: './job-profile-status.html',
  styleUrl: './job-profile-status.scss',
})
export class JobProfileStatusComponent {
  readonly status = input.required<JobProfileStatus>();

  readonly label = computed(() => JOB_PROFILE_STATUS_LABELS[this.status()]);
}
