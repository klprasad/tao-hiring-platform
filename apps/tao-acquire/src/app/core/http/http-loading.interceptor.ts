import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';

import { SKIP_LOADING } from './http-context.tokens';
import { HttpLoadingService } from './loading.service';

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
