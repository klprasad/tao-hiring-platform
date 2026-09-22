import { HttpContextToken } from '@angular/common/http';

/**
 * HttpContext token used to opt a request out of the default
 * loading indicator (see `httpLoadingInterceptor`).
 */
export const SKIP_LOADING = new HttpContextToken<boolean>(() => false);
