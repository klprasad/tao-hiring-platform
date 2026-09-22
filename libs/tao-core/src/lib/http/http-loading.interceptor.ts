import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';

import { SKIP_LOADING } from './http-context.tokens';
import { HttpLoadingService } from './loading.service';

/**
 * Global HTTP interceptor that keeps `HttpLoadingService` in sync with
 * the number of in-flight requests.
 *
 * Requests can opt out with `skipLoading: true` on `ApiRequestOptions`
 * or by setting the `SKIP_LOADING` context token directly.
 */
export const httpLoadingInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
) => {
  const loadingService = inject(HttpLoadingService);

  const skipLoading = req.context.get(SKIP_LOADING);

  if (skipLoading) {
    return next(req);
  }

  loadingService.start();

  return next(req).pipe(
    finalize(() => {
      loadingService.stop();
    }),
  );
};
