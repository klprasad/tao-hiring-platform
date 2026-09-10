import { Injectable, inject } from '@angular/core';
import {
  HttpClient,
  HttpContext,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiError, ApiException } from './api-error';
import { AppConfigService } from '../config/app-config.service';
/**
 * Generic options supported by all API requests.
 */
export interface ApiRequestOptions {
  /**
   * Query string parameters.
   *
   * Example:
   * { page: 1, pageSize: 20, search: 'angular' }
   */
  params?: Record<string, string | number | boolean | null | undefined>;

  /**
   * Additional request headers.
   */
  headers?: Record<string, string>;

  /**
   * Angular HttpContext for interceptor configuration.
   */
  context?: HttpContext;

  /**
   * AbortSignal used to cancel the HTTP request.
   */
  signal?: AbortSignal;

  /**
   * Whether credentials such as cookies should be sent.
   */
  withCredentials?: boolean;
}

/**
 * Generic API client responsible only for HTTP communication.
 *
 * Feature-specific services should be built on top of this class.
 *
 * Example:
 *
 *   CampaignService
 *          ↓
 *   ApiClientService
 *          ↓
 *   Angular HttpClient
 */
@Injectable({
  providedIn: 'root',
})
export class ApiClientService {
  private readonly http = inject(HttpClient);
  private readonly appConfig = inject(AppConfigService);

  private buildUrl(endpoint: string): string {
    const baseUrl = this.appConfig.apiUrl.replace(/\/$/, '');

    const path = endpoint.replace(/^\//, '');

    return `${baseUrl}/${path}`;
  }
  /**
   * HTTP GET request.
   */
  get<TResponse>(url: string, options?: ApiRequestOptions): Observable<TResponse> {
    return this.http
      .get<TResponse>(this.buildUrl(url), this.buildOptions(options))
      .pipe(catchError((error) => this.handleError(error, 'GET', url)));
  }

  /**
   * HTTP POST request.
   */
  post<TResponse, TRequest = unknown>(
    url: string,
    body?: TRequest,
    options?: ApiRequestOptions,
  ): Observable<TResponse> {
    return this.http
      .post<TResponse>(this.buildUrl(url), body, this.buildOptions(options))
      .pipe(catchError((error) => this.handleError(error, 'POST', url)));
  }

  /**
   * HTTP PUT request.
   */
  put<TResponse, TRequest = unknown>(
    url: string,
    body?: TRequest,
    options?: ApiRequestOptions,
  ): Observable<TResponse> {
    return this.http
      .put<TResponse>(this.buildUrl(url), body, this.buildOptions(options))
      .pipe(catchError((error) => this.handleError(error, 'PUT', url)));
  }

  /**
   * HTTP DELETE request.
   *
   * DELETE endpoints commonly return 204 No Content.
   */
  delete<TResponse = void>(url: string, options?: ApiRequestOptions): Observable<TResponse> {
    return this.http
      .delete<TResponse>(this.buildUrl(url), this.buildOptions(options))
      .pipe(catchError((error) => this.handleError(error, 'DELETE', url)));
  }

  /**
   * Builds Angular HttpClient options from our generic options.
   */
  private buildOptions(options?: ApiRequestOptions): {
    params?: HttpParams;
    headers?: HttpHeaders;
    context?: HttpContext;
    withCredentials?: boolean;
    signal?: AbortSignal;
  } {
    return {
      params: this.buildParams(options?.params),
      headers: this.buildHeaders(options?.headers),
      context: options?.context,
      withCredentials: options?.withCredentials,
      signal: options?.signal,
    };
  }

  /**
   * Converts a plain object into HttpParams.
   *
   * Null and undefined values are ignored.
   */
  private buildParams(
    params?: Record<string, string | number | boolean | null | undefined>,
  ): HttpParams | undefined {
    if (!params) {
      return undefined;
    }

    let httpParams = new HttpParams();

    for (const [key, value] of Object.entries(params)) {
      if (value !== null && value !== undefined) {
        httpParams = httpParams.set(key, String(value));
      }
    }

    return httpParams;
  }

  /**
   * Converts plain headers into HttpHeaders.
   */
  private buildHeaders(headers?: Record<string, string>): HttpHeaders | undefined {
    if (!headers) {
      return undefined;
    }

    return new HttpHeaders(headers);
  }

  /**
   * Centralized HTTP error handling.
   *
   * Authentication, logging, notifications, etc. can later
   * be moved into interceptors if required.
   */
  private handleError(error: unknown, method: string, url: string): Observable<never> {
    console.error(`[API ${method}] ${url}`, error);

    if (error instanceof ApiException) {
      return throwError(() => error);
    }

    if (error instanceof HttpErrorResponse) {
      const apiError = this.extractApiError(error);

      const message =
        apiError.detail ?? apiError.title ?? error.message ?? 'An unexpected error occurred.';

      return throwError(() => new ApiException(message, error.status, apiError));
    }

    return throwError(() => new ApiException('An unexpected error occurred.', 0));
  }
  private extractApiError(error: HttpErrorResponse): ApiError {
    const backendError = error.error;

    // ASP.NET Core ProblemDetails response
    if (backendError && typeof backendError === 'object') {
      return {
        ...(backendError as ApiError),
        status: (backendError as ApiError).status ?? error.status,
      };
    }

    // Plain-text backend response
    if (typeof backendError === 'string') {
      return {
        status: error.status,
        detail: backendError,
      };
    }

    // Network/client-side error
    return {
      status: error.status,
      title: error.statusText,
      detail: error.message,
    };
  }
}
