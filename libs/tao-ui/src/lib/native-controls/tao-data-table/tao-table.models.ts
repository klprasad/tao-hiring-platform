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
