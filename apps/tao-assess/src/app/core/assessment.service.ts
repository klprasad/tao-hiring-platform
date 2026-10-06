import { inject, Injectable } from '@angular/core';
import { ApiClientService, UserSummary } from '@tao/core';
import { Observable } from 'rxjs';
import {
  AssessmentContextDto,
  AssessmentQuestionDto,
  AssessmentSessionDto,
  AssessmentSessionWorkflowDto,
  SaveCandidateResponseResult,
} from '../models/assessment-session.model';
import { loginModelDto } from '../models/login.model';

@Injectable({
  providedIn: 'root',
})
export class AssessmentService {
  private readonly api = inject(ApiClientService);
  createAssessmentSession(request: any): Observable<AssessmentSessionDto> {
    return this.api.post<AssessmentSessionDto, any>('/api/assessment-sessions', request);
  }

  startAssessment(sessionId: string): Observable<any> {
    return this.api.post(`/api/assessment-sessions/${sessionId}/start`);
  }
  getCurrentQuestion(sessionId: string): Observable<any> {
    return this.api.post(`/api/assessment-sessions/${sessionId}/current-question`);
  }

  saveCandidateResponse(questionId: string, request: any): Observable<SaveCandidateResponseResult> {
    return this.api.post<SaveCandidateResponseResult>(
      `/api/assessment-questions/${questionId}/response`,
      request,
    );
  }
  saveCodeResponse(questionId: string, request: any): Observable<any> {
    return this.api.post(`/api/assessment-questions/${questionId}/code-response`, request);
  }
  skipQuestion(questionId: string): Observable<any> {
    return this.api.post(`/api/assessment-questions/${questionId}/skip`);
  }
  getAssessmentWorkflow(sessionId: string): Observable<AssessmentSessionWorkflowDto> {
    return this.api.get<AssessmentSessionWorkflowDto>(
      `/api/assessment-sessions/${sessionId}/workflow`,
    );
  }
  completeAssessmentQuestion(questionId: string): Observable<any> {
    return this.api.post(`/api/assessment-questions/${questionId}/complete`);
  }
  advanceAssessment(sessionId: string): Observable<AssessmentQuestionDto> {
    return this.api.post<AssessmentQuestionDto>(`/api/assessment-sessions/${sessionId}/advance`);
  }
  candidateSignUp(invitationId: string, request: loginModelDto): Observable<any> {
    return this.api.post(`/api/candidate/invitations/${invitationId}/signup`, request);
  }
  getAuthUser(): Observable<UserSummary> {
    return this.api.get<UserSummary>(`/api/auth/me`);
  }
  getAssessmentContext(invitationId: string): Observable<AssessmentContextDto> {
    return this.api.get<AssessmentContextDto>(
      `/api/candidate/invitations/${invitationId}/assessment-context`,
    );
  }
}
