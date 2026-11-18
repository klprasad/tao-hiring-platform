export interface CandidateDto {
  id: string;
  candidateName: string;
  email: string;
  phone: string;
  linkedInUrl: string;
  currentCompany: string | null;
  currentLocation: string;
  overallMatchPercentage: number;
  status: string;
  resumeUploadedOn: string;
  lastScreenedOn: string | null;
}
