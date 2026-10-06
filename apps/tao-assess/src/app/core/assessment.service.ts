import { inject, Injectable, Service } from '@angular/core';
import { ApiClientService, UserSummary } from '@tao/core';
import { Observable } from 'rxjs';
import {
  AssessmentSessionDto,
  AssessmentSessionWorkflowDto,
  SaveCandidateResponseResult,
} from '../models/assessment-session.model';
import { HttpClient } from '@angular/common/http';
import { loginModelDto } from '../models/login.model';

@Injectable({
  providedIn: 'root',
})
export class AssessmentService {
  private readonly api = inject(ApiClientService);
  private readonly http = inject(HttpClient);
  createAssessmentSession(request: any): Observable<AssessmentSessionDto> {
    return this.api.post<AssessmentSessionDto, any>('/api/assessment-sessions', request);
  }
  getCurrentAssessmentSession(assessmentSessionId: string): Observable<AssessmentSessionDto> {
    return this.http.get<AssessmentSessionDto>('assets/assessmentsession.json');
  }
  startAssessment(sessionId: string): Observable<any> {
    return this.api.post(`/api/assessment-sessions/${sessionId}/start`);
  }
  getCurrentQuestion(sessionId: string): Observable<any> {
    return this.api.post(`/api/assessment-sessions/${sessionId}/current-question`);
  }
  getFollowUpQuestion(questionId: string): Observable<any> {
    return this.api.post(`/api/assessment-questions/${questionId}/follow-up`);
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
  advanceAssessment(sessionId: string): Observable<any> {
    return this.api.post(`/api/assessment-sessions/${sessionId}/advance`);
  }
  candidateSignUp(invitationId: string, request: loginModelDto): Observable<any> {
    return this.api.post(`/api/candidate/invitations/${invitationId}/signup`, request);
  }
  getAuthUser(): Observable<UserSummary> {
    return this.api.get<UserSummary>(`api/auth/me`);
  }
}
