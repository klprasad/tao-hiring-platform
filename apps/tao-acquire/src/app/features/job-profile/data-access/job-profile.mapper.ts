import { JobProfileDto, CreateJobProfileDto, UpdateJobProfileDto } from '../models/job-profile.dto';
import { JobProfileFormValue, JobProfileVm } from '../models/job-profile.vm';

export function mapJobProfileDtoToVm(dto: JobProfileDto): JobProfileVm {
  return {
    ...dto,
    updatedOn: dto.updatedAt,
  };
}

export function mapJobProfileFormToCreateDto(value: JobProfileFormValue): CreateJobProfileDto {
  return {
    title: value.title.trim(),
    department: value.department,
    location: value.location.trim(),
    employmentType: value.employmentType,
    experienceLevel: value.experienceLevel,
    description: value.description.trim(),
    responsibilities: value.responsibilities.trim(),
    requiredSkills: value.requiredSkills.trim(),
  };
}

export function mapJobProfileVmToUpdateDto(profile: JobProfileVm): UpdateJobProfileDto {
  const { id: _id, updatedOn: _updatedOn, ...value } = profile;

  return {
    ...value,
  };
}