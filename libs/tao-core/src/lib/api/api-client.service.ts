import { Injectable, inject } from '@angular/core';
import {
  HttpClient,
  HttpContext,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { Observable, map, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ApiError, ApiException } from './api-error';
import { API_RESPONSE_ERROR_NOTIFIER } from './api-response';
import { AppConfigService } from '../config/app-config.service';
import { SKIP_LOADING } from '../http/http-context.tokens';

type ApiClientResponse<T> = T extends { success: boolean; data: infer TData } ? TData : T;

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
  /**
   * Whether to skip default loading indicator
   */
  skipLoading?: boolean;
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
  private readonly responseErrorNotifier = inject(API_RESPONSE_ERROR_NOTIFIER, { optional: true });

  private buildUrl(endpoint: string): string {
    const baseUrl = this.appConfig.apiUrl.replace(/\/$/, '');

    const path = endpoint.replace(/^\//, '');

    return `${baseUrl}/${path}`;
  }
  /**
   * HTTP GET request.
   */
  get<TResponse>(
    url: string,
    options?: ApiRequestOptions,
  ): Observable<ApiClientResponse<TResponse>> {
    return this.http.get<TResponse>(this.buildUrl(url), this.buildOptions(options)).pipe(
      map((response) => this.unwrapResponse(response)),
      catchError((error) => this.handleError(error, 'GET', url)),
    );
  }

  /**
   * HTTP POST request.
   */
  post<TResponse, TRequest = unknown>(
    url: string,
    body?: TRequest,
    options?: ApiRequestOptions,
  ): Observable<ApiClientResponse<TResponse>> {
    return this.http.post<TResponse>(this.buildUrl(url), body, this.buildOptions(options)).pipe(
      map((response) => this.unwrapResponse(response)),
      catchError((error) => this.handleError(error, 'POST', url)),
    );
  }

  /**
   * HTTP PUT request.
   */
  put<TResponse, TRequest = unknown>(
    url: string,
    body?: TRequest,
    options?: ApiRequestOptions,
  ): Observable<ApiClientResponse<TResponse>> {
    return this.http.put<TResponse>(this.buildUrl(url), body, this.buildOptions(options)).pipe(
      map((response) => this.unwrapResponse(response)),
      catchError((error) => this.handleError(error, 'PUT', url)),
    );
  }

  /**
   * HTTP DELETE request.
   *
   * DELETE endpoints commonly return 204 No Content.
   */
  delete<TResponse = void>(
    url: string,
    options?: ApiRequestOptions,
  ): Observable<ApiClientResponse<TResponse>> {
    return this.http.delete<TResponse>(this.buildUrl(url), this.buildOptions(options)).pipe(
      map((response) => this.unwrapResponse(response)),
      catchError((error) => this.handleError(error, 'DELETE', url)),
    );
  }

  private unwrapResponse<TResponse>(response: TResponse): ApiClientResponse<TResponse> {
    if (!response || typeof response !== 'object' || !('success' in response)) {
      return response as ApiClientResponse<TResponse>;
    }

    const apiResponse = response as {
      success: unknown;
      data?: unknown;
      message?: unknown;
      errors?: unknown;
    };
    if (apiResponse.success === true) {
      if (
        apiResponse.data === null &&
        typeof apiResponse.message === 'string' &&
        apiResponse.message.trim()
      ) {
        this.responseErrorNotifier?.success(apiResponse.message);
      }

      return apiResponse.data as ApiClientResponse<TResponse>;
    }

    const message =
      typeof apiResponse.message === 'string' && apiResponse.message.trim()
        ? apiResponse.message
        : (this.formatErrors(apiResponse.errors) ?? 'The request failed.');

    throw new ApiException(message, 200);
  }

  private formatErrors(errors: unknown): string | undefined {
    if (typeof errors === 'string' && errors.trim()) {
      return errors;
    }

    if (!errors || typeof errors !== 'object') {
      return undefined;
    }

    const messages = Object.values(errors).flatMap((value) =>
      Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [],
    );

    return messages.length > 0 ? messages.join(' ') : undefined;
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
      context: this.buildContext(options),
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
  private buildContext(options?: ApiRequestOptions): HttpContext {
    return (options?.context ?? new HttpContext()).set(SKIP_LOADING, options?.skipLoading ?? false);
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
      this.responseErrorNotifier?.error(error.message);
      return throwError(() => error);
    }

    if (error instanceof HttpErrorResponse) {
      const apiResponse = error.error;
      const message =
        typeof apiResponse.message === 'string' && apiResponse.message.trim()
          ? apiResponse.message
          : (this.formatErrors(apiResponse.errors) ?? 'The request failed.');

      this.responseErrorNotifier?.error(message);
      return throwError(() => new ApiException(message, error.status, apiResponse));
    }

    const message = 'An unexpected error occurred.';
    this.responseErrorNotifier?.error(message);
    return throwError(() => new ApiException(message, 0));
  }
}
