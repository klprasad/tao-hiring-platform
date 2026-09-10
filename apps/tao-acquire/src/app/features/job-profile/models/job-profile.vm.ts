export type JobProfileStatus = 'draft' | 'published' | 'archived';

export interface JobProfileVm {
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
  updatedOn: string;
}

export interface JobProfileFormValue {
  title: string;
  department: string;
  location: string;
  employmentType: string;
  experienceLevel: string;
  description: string;
  responsibilities: string;
  requiredSkills: string;
}