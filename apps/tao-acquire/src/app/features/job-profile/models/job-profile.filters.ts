import { JobProfileStatus } from './job-profile.vm';

export interface JobProfileFilters {
  search?: string;
  status?: JobProfileStatus | 'all';
}