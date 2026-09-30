import { inject, Injectable, Service } from '@angular/core';
import { ApiClientService } from '@tao/core';
import { Observable } from 'rxjs';
import {
  AssessmentSessionDto,
  AssessmentSessionWorkflowDto,
} from '../models/assessment-session.model';
import { HttpClient } from '@angular/common/http';

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
  saveCandidateResponse(questionId: string, request: any): Observable<any> {
    return this.api.post(`/api/assessment-questions/${questionId}/response`, request);
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
}
