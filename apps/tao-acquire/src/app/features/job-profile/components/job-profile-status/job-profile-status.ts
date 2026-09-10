import { Component, input } from '@angular/core';

import { JobProfileStatus } from '../../models/job-profile.vm';

@Component({
  selector: 'tao-job-profile-status',
  templateUrl: './job-profile-status.html',
  styleUrl: './job-profile-status.scss',
})
export class JobProfileStatusComponent {
  readonly status = input.required<JobProfileStatus>();
}