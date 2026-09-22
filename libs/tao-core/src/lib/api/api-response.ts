/**
 * Standard API response returned by the backend.
 *
 * Every successful response wraps its payload in `value` together with
 * an optional human-readable `message`.
 *
 * Example:
 *
 * {
 *   "value": {
 *      "id": 1,
 *      "name": "Campaign 1"
 *   },
 *   "message": "Campaign retrieved successfully"
 * }
 */
export interface ApiResponse<T> {
  /**
   * Response payload.
   */
  value: T;

  /**
   * Optional human-readable message.
   */
  message?: string;
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
 *   "value": {
 *      "items": [],
 *      "page": 1,
 *      "pageSize": 20,
 *      "totalCount": 100,
 *      "totalPages": 5
 *   },
 *   "message": "Campaigns retrieved successfully"
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
 * Response returned by create operations that yield the new resource id.
 *
 * Example (Create Campaign):
 *
 * {
 *   "value": "550e8400-e29b-41d4-a716-446655440100",
 *   "message": "Campaign created successfully"
 * }
 */
export type ApiCreatedResponse = ApiResponse<string>;

/**
 * Response for operations that don't return data (e.g. 204 No Content).
 *
 * The approval endpoints return an empty body.
 */
export type ApiEmptyResponse = void;
