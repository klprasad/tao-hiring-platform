import { JobProfileStatus } from './job-profile.vm';

export interface JobProfileDto {
  id: string;
  title: string;
  department: string;
  location: string;
  employmentType: string;
  experienceLevel: string;
  description: string;
  responsibilities: string;
  requiredSkills: string;
  status: JobProfileStatus;
  updatedAt: string;
}

export type CreateJobProfileDto = Omit<JobProfileDto, 'id' | 'status' | 'updatedAt'>;
export type UpdateJobProfileDto = CreateJobProfileDto & { status: JobProfileStatus };