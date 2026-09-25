import { inject, Injectable, Service } from '@angular/core';
import { ApiClientService } from '@tao/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AssessmentService {
  private readonly api = inject(ApiClientService);

  getCurrentAssessmentSession(request: any): Observable<any> {
    return this.api.post('/api/assessment-sessions', request);
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
}
