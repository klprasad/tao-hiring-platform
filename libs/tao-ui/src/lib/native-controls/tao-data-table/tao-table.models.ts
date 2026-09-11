import { TemplateRef } from '@angular/core';

export type TaoSortDirection = 'asc' | 'desc' | '';

export type TaoTableSortMode = 'client' | 'server';

export type TaoTablePaginationMode = 'client' | 'server';

export type TaoTableAlign = 'left' | 'center' | 'right';

export type TaoTableDensity = 'comfortable' | 'compact';

export type TaoTableCellType =
  'text' | 'number' | 'date' | 'boolean' | 'status' | 'progress' | 'custom';

export interface TaoTableColumn<T extends object> {
  /**
   * Property from the row object.
   */
  key: keyof T & string;

  /**
   * Header displayed to the user.
   */
  label: string;

  /**
   * Whether this column can be sorted.
   *
   * Default: true
   */
  sortable?: boolean;

  /**
   * Value used for sorting.
   *
   * Useful when the displayed value differs
   * from the actual sort value.
   */
  sortKey?: string;

  /**
   * Column width.
   *
   * Examples:
   * '120px'
   * '20%'
   * '1fr'
   */
  width?: string;

  /**
   * Text alignment.
   */
  align?: TaoTableAlign;

  /**
   * Cell type.
   */
  type?: TaoTableCellType;

  /**
   * Optional formatter.
   */
  formatter?: (value: unknown, row: T) => string;

  /**
   * Optional custom template.
   */
  template?: TemplateRef<unknown>;

  /**
   * Allow cell content to wrap onto multiple lines instead of
   * forcing the column to grow horizontally.
   *
   * When enabled the cell no longer truncates with an ellipsis;
   * long values wrap within the available column width.
   *
   * Defaults to `TaoTableConfig.wrap` (or `false` when unset).
   */
  wrap?: boolean;

  /**
   * Maximum number of characters rendered in the cell.
   *
   * Longer values are truncated and suffixed with an ellipsis.
   * The full value is still exposed through the cell `title`
   * (hover tooltip).
   *
   * Combine with `wrap` to keep very long text readable:
   * the value is truncated first, then wrapped.
   *
   * Defaults to `TaoTableConfig.maxLength` (or no limit when unset).
   */
  maxLength?: number;

  /**
   * Make column sticky.
   */
  sticky?: boolean;

  /**
   * Hide column.
   */
  hidden?: boolean;
}

export interface TaoTableConfig {
  /**
   * Enable sorting.
   */
  sortable?: boolean;

  /**
   * Client-side or server-side sorting.
   */
  sortMode?: TaoTableSortMode;

  /**
   * Enable pagination.
   */
  pagination?: boolean;

  /**
   * Client-side or server-side pagination.
   */
  paginationMode?: TaoTablePaginationMode;

  /**
   * Enable filtering.
   */
  filterable?: boolean;

  /**
   * Default page size.
   */
  pageSize?: number;

  /**
   * Available page sizes.
   */
  pageSizeOptions?: number[];

  /**
   * Default sort column.
   */
  sortActive?: string;

  /**
   * Default sort direction.
   */
  sortDirection?: TaoSortDirection;

  /**
   * Show first/last paginator buttons.
   */
  showFirstLastButtons?: boolean;

  /**
   * Enable row hover.
   */
  rowHover?: boolean;

  /**
   * Enable row selection.
   */
  selectable?: boolean;

  /**
   * Allow multiple row selection.
   */
  multiSelect?: boolean;

  /**
   * Sticky header.
   */
  stickyHeader?: boolean;

  /**
   * Table density.
   */
  density?: TaoTableDensity;

  /**
   * Default wrapping behaviour applied to every column.
   *
   * Individual columns can override it with `TaoTableColumn.wrap`.
   * Useful for descriptions or any content that must not widen
   * the table horizontally.
   *
   * Default: false
   */
  wrap?: boolean;

  /**
   * Default maximum characters rendered per cell.
   *
   * Individual columns can override it with
   * `TaoTableColumn.maxLength`.
   *
   * Default: no limit
   */
  maxLength?: number;

  /**
   * Show loading state.
   */
  loading?: boolean;

  /**
   * Track rows by a property.
   */
  trackBy?: string;
}

export interface TaoTableSortEvent {
  active: string;
  direction: TaoSortDirection;
}

export interface TaoTablePageEvent {
  pageIndex: number;
  pageSize: number;
  previousPageIndex?: number;
}

export interface TaoTableRowEvent<T> {
  row: T;
  index: number;
}

export interface TaoTableSelectionEvent<T> {
  rows: T[];
}
