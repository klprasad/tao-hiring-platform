/**
 * Standard API response returned by the backend.
 *
 * Example:
 *
 * {
 *   "success": true,
 *   "message": "Campaign retrieved successfully",
 *   "data": {
 *      "id": 1,
 *      "name": "Campaign 1"
 *   }
 * }
 */
export interface ApiResponse<T> {
  /**
   * Indicates whether the request was successfully processed.
   */
  success: boolean;

  /**
   * Optional human-readable message.
   */
  message?: string;

  /**
   * Response payload.
   */
  data: T;

  /**
   * Optional metadata.
   */
  metadata?: ApiMetadata;
}

/**
 * Metadata returned by APIs when additional information
 * is required by the client.
 */
export interface ApiMetadata {
  /**
   * Correlation/request identifier.
   */
  requestId?: string;

  /**
   * Server timestamp.
   */
  timestamp?: string;

  /**
   * Additional metadata that may be returned by the API.
   */
  [key: string]: unknown;
}

/**
 * Standard paginated API response.
 *
 * Example:
 *
 * {
 *   "success": true,
 *   "data": {
 *      "items": [],
 *      "page": 1,
 *      "pageSize": 20,
 *      "totalCount": 100,
 *      "totalPages": 5
 *   }
 * }
 */
export interface PaginatedResponse<T> {
  items: T[];

  page: number;

  pageSize: number;

  totalCount: number;

  totalPages: number;

  /**
   * Indicates whether another page is available.
   */
  hasNextPage: boolean;

  /**
   * Indicates whether a previous page is available.
   */
  hasPreviousPage: boolean;
}

/**
 * Convenience type for paginated API responses.
 */
export type ApiPaginatedResponse<T> = ApiResponse<PaginatedResponse<T>>;

/**
 * API response for operations that don't return data.
 *
 * Useful for DELETE and some PUT/POST operations.
 */
export type ApiEmptyResponse = ApiResponse<void>;
