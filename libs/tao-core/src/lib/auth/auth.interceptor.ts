import { HttpInterceptorFn } from '@angular/common/http';
import { InjectionToken, inject } from '@angular/core';

export type TaoApplicationId = 'acquire' | 'assess';

export const TAO_APPLICATION_ID = new InjectionToken<TaoApplicationId>('TAO_APPLICATION_ID');

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const applicationId = inject(TAO_APPLICATION_ID);
  const authenticatedRequest = req.clone({
    withCredentials: true,
    setHeaders: { 'X-TAO-Application': applicationId },
  });
  return next(authenticatedRequest);
};
