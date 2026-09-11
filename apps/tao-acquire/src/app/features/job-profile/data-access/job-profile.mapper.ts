import { CreateJobProfileRequest } from '../models/job-profile.dto';
import { JobProfileFormValue, JobProfileVm } from '../models/job-profile.vm';
import { JobProfileDto } from '../models/job-profile.dto';

/**
 * Maps the job profile form value to the create job profile request body.
 */
export function mapJobProfileFormToCreateDto(value: JobProfileFormValue): CreateJobProfileRequest {
  return {
    originalJobDescription: value.description,
  };
}

/**
 * Maps a job profile DTO to the job profile view model.
 */
export function mapJobProfileDtoToVm(dto: JobProfileDto): JobProfileVm {
  return {
    id: dto.id,
    campaignId: dto.campaignId,
    originalJobDescription: dto.originalJobDescription,
    generatedContent: dto.generatedContent,
    structuredProfile: dto.structuredProfile,
    status: dto.status,
    generatedOn: dto.generatedOn,
  };
}
