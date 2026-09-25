import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authenticatedRequest = req.clone({
    withCredentials: true,
  });
  return next(authenticatedRequest);
};
