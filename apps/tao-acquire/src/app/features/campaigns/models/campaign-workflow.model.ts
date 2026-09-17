export class CampaignWorkflowVm {
  campaignId = '';
  campaignName = '';
  currentStage = '';
  completionPercentage = 0;

  hasJobProfile = false;
  jobProfileStatus: string | null = null;
  jobProfileCreatedOn: Date | null = null;
  jobProfileApprovedOn: Date | null = null;

  hasHiringStrategy = false;
  hiringStrategyStatus: string | null = null;
  hiringStrategyCreatedOn: Date | null = null;
  hiringStrategyApprovedOn: Date | null = null;

  hasAssessmentStrategy = false;
  assessmentStrategyStatus: string | null = null;
  assessmentStrategyCreatedOn: Date | null = null;
  assessmentStrategyApprovedOn: Date | null = null;

  hasResumeImport = false;
  resumeImportStatus: string | null = null;
  totalResumes = 0;
  successfulResumes = 0;
  failedResumes = 0;
  resumeImportCompletedOn: Date | null = null;

  constructor(data?: Partial<CampaignWorkflowVm>) {
    if (data) {
      Object.assign(this, data);

      this.jobProfileCreatedOn = data.jobProfileCreatedOn
        ? new Date(data.jobProfileCreatedOn)
        : null;

      this.jobProfileApprovedOn = data.jobProfileApprovedOn
        ? new Date(data.jobProfileApprovedOn)
        : null;

      this.hiringStrategyCreatedOn = data.hiringStrategyCreatedOn
        ? new Date(data.hiringStrategyCreatedOn)
        : null;

      this.hiringStrategyApprovedOn = data.hiringStrategyApprovedOn
        ? new Date(data.hiringStrategyApprovedOn)
        : null;

      this.assessmentStrategyCreatedOn = data.assessmentStrategyCreatedOn
        ? new Date(data.assessmentStrategyCreatedOn)
        : null;

      this.assessmentStrategyApprovedOn = data.assessmentStrategyApprovedOn
        ? new Date(data.assessmentStrategyApprovedOn)
        : null;

      this.resumeImportCompletedOn = data.resumeImportCompletedOn
        ? new Date(data.resumeImportCompletedOn)
        : null;
    }
  }
}
