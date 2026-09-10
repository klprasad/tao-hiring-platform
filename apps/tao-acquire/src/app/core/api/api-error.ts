/**
 * Standard API error returned by the application.
 *
 * This interface is intentionally compatible with
 * ASP.NET Core ProblemDetails.
 *
 * Example:
 *
 * {
 *   "type": "https://api.example.com/errors/validation",
 *   "title": "Validation failed",
 *   "status": 400,
 *   "detail": "One or more validation errors occurred.",
 *   "instance": "/api/campaigns",
 *   "traceId": "00-abc123...",
 *   "errors": {
 *      "name": [
 *        "Name is required."
 *      ]
 *   }
 * }
 */
export interface ApiError {
  /**
   * URI identifying the type of error.
   */
  type?: string;

  /**
   * Short, human-readable summary of the problem.
   */
  title?: string;

  /**
   * HTTP status code.
   */
  status: number;

  /**
   * Human-readable explanation of the problem.
   */
  detail?: string;

  /**
   * URI identifying the specific occurrence of the problem.
   */
  instance?: string;

  /**
   * Application-specific error code.
   *
   * Example:
   *
   * CAMPAIGN_NOT_FOUND
   */
  code?: string;

  /**
   * Validation errors.
   *
   * Example:
   *
   * {
   *   "name": [
   *     "Name is required."
   *   ],
   *   "description": [
   *     "Description is too long."
   *   ]
   * }
   */
  errors?: Record<string, string[]>;

  /**
   * Correlation ID used for troubleshooting.
   */
  traceId?: string;

  /**
   * Request ID returned by the backend.
   */
  requestId?: string;

  /**
   * Allows additional properties returned by the API
   * without breaking the client contract.
   */
  [key: string]: unknown;
}

/**
 * Strongly typed application error used by the Angular API layer.
 *
 * Instead of exposing HttpErrorResponse throughout the
 * application, the API client can normalize errors into
 * this class.
 */
export class ApiException extends Error {
  /**
   * HTTP status code.
   */
  readonly status: number;

  /**
   * Backend error code.
   */
  readonly code?: string;

  /**
   * Complete backend error payload.
   */
  readonly error?: ApiError;

  /**
   * Validation errors.
   */
  readonly validationErrors: Record<string, string[]>;

  /**
   * Correlation/request ID.
   */
  readonly requestId?: string;

  constructor(message: string, status: number, error?: ApiError) {
    super(message);

    this.name = 'ApiException';

    this.status = status;
    this.error = error;

    this.code = error?.code;

    this.validationErrors = error?.errors ?? {};

    this.requestId = error?.requestId ?? error?.traceId;

    // Required when extending built-in Error
    // in some JavaScript environments.
    Object.setPrototypeOf(this, ApiException.prototype);
  }

  /**
   * Indicates whether this is a validation error.
   */
  get isValidationError(): boolean {
    return this.status === 400 && Object.keys(this.validationErrors).length > 0;
  }

  /**
   * Indicates whether authentication is required.
   */
  get isUnauthorized(): boolean {
    return this.status === 401;
  }

  /**
   * Indicates whether the user doesn't have permission.
   */
  get isForbidden(): boolean {
    return this.status === 403;
  }

  /**
   * Indicates whether the requested resource was not found.
   */
  get isNotFound(): boolean {
    return this.status === 404;
  }

  /**
   * Indicates whether the server failed.
   */
  get isServerError(): boolean {
    return this.status >= 500;
  }

  /**
   * Indicates whether the request failed because
   * of a client-side/network problem.
   */
  get isNetworkError(): boolean {
    return this.status === 0;
  }
}
