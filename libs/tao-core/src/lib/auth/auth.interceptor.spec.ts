import { HttpRequest } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { of } from 'rxjs';

import { authInterceptor, TAO_APPLICATION_ID, TaoApplicationId } from './auth.interceptor';

describe('authInterceptor', () => {
  it.each(['acquire', 'assess'] as const)(
    'sends the %s application identity and cookies',
    (applicationId: TaoApplicationId) => {
      TestBed.configureTestingModule({
        providers: [{ provide: TAO_APPLICATION_ID, useValue: applicationId }],
      });
      const request = new HttpRequest('GET', '/api/campaigns');
      let forwardedRequest: HttpRequest<unknown> | undefined;

      TestBed.runInInjectionContext(() =>
        authInterceptor(request, (nextRequest) => {
          forwardedRequest = nextRequest;
          return of();
        }),
      );

      expect(forwardedRequest?.headers.get('X-TAO-Application')).toBe(applicationId);
      expect(forwardedRequest?.withCredentials).toBe(true);
    },
  );
});
