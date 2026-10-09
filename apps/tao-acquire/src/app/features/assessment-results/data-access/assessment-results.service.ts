import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClientService } from '@tao/core';
import {
  AssessmentCandidate,
  AssessmentQuestionResult,
  AssessmentRoundResult,
  AssessmentSummary,
} from '../models/assessment-result.models';

@Injectable({ providedIn: 'root' })
export class AssessmentResultService {
  private readonly api = inject(ApiClientService);

  getCandidatesResults(campaignId: string): Observable<AssessmentCandidate[]> {
    return this.api.get<AssessmentCandidate[]>(
      `/api/assessment-results/campaigns/${campaignId}/candidates`,
    );
  }

  getAssessmentSummary(sessionId: string): Observable<AssessmentSummary> {
    return this.api.get<AssessmentSummary>(`/api/assessment-results/${sessionId}`);
  }

  getAssessmentRoundResults(sessionId: string, roundId: string): Observable<AssessmentRoundResult> {
    return this.api.get<AssessmentRoundResult>(
      `/api/assessment-results/${sessionId}/rounds/${roundId}`,
    );
  }

  getQuestionResults(sessionId: string, questionId: string): Observable<AssessmentQuestionResult> {
    return this.api.get<AssessmentQuestionResult>(
      `/api/assessment-results/${sessionId}/questions/${questionId}`,
    );
  }
}
