import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  output,
  viewChild,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

import { MatSort, MatSortModule, Sort } from '@angular/material/sort';

import { MatTableDataSource, MatTableModule } from '@angular/material/table';

import { MatCheckboxModule } from '@angular/material/checkbox';

import {
  TaoTableColumn,
  TaoTableConfig,
  TaoTablePageEvent,
  TaoTableRowEvent,
  TaoTableSelectionEvent,
  TaoTableSortEvent,
} from './tao-table.models';

@Component({
  selector: 'tao-table, tao-data-table',
  standalone: true,

  imports: [MatTableModule, MatPaginatorModule, MatSortModule, MatCheckboxModule, NgTemplateOutlet],

  templateUrl: './tao-data-table.component.html',

  styleUrl: './tao-data-table.component.scss',

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaoDataTableComponent<T extends object = object> {
  // --------------------------------------------------
  // INPUTS
  // --------------------------------------------------

  readonly columns = input<TaoTableColumn<T>[]>([]);

  readonly rows = input<T[]>([]);

  /**
   * Total number of records.
   *
   * Important for server-side pagination.
   */
  readonly totalCount = input<number>();

  readonly config = input<TaoTableConfig>({});

  /**
   * Optional external filter value.
   */
  readonly filter = input<string>('');

  // --------------------------------------------------
  // OUTPUTS
  // --------------------------------------------------

  readonly sortChange = output<TaoTableSortEvent>();

  readonly pageChange = output<TaoTablePageEvent>();

  readonly rowClick = output<TaoTableRowEvent<T>>();

  readonly selectionChange = output<TaoTableSelectionEvent<T>>();

  // --------------------------------------------------
  // MATERIAL REFERENCES
  // --------------------------------------------------

  readonly paginator = viewChild(MatPaginator);

  readonly sort = viewChild(MatSort);

  // --------------------------------------------------
  // DATA SOURCE
  // --------------------------------------------------

  readonly dataSource = new MatTableDataSource<T>();

  // --------------------------------------------------
  // COMPUTED CONFIG
  // --------------------------------------------------

  readonly visibleColumns = computed(() =>
    this.columns()
      .filter((column) => !column.hidden)
      .map((column) => column.key),
  );

  readonly effectivePageSize = computed(() => this.config().pageSize ?? 10);

  readonly effectivePageSizeOptions = computed(() => this.config().pageSizeOptions ?? [5, 10, 25]);

  readonly sortingEnabled = computed(() => this.config().sortable ?? true);

  readonly paginationEnabled = computed(() => this.config().pagination ?? true);

  readonly clientSorting = computed(() => this.config().sortMode !== 'server');

  readonly clientPagination = computed(() => this.config().paginationMode !== 'server');

  readonly selectionEnabled = computed(() => this.config().selectable ?? false);

  // --------------------------------------------------
  // STATE
  // --------------------------------------------------

  private readonly selectedRows = new Set<T>();

  constructor() {
    // ------------------------------------------------
    // Update data
    // ------------------------------------------------

    effect(() => {
      const rows = this.rows();

      this.dataSource.data = rows;

      this.configureFilter();
      this.configureSorting();
    });

    // ------------------------------------------------
    // Connect paginator and sort for CLIENT mode
    // ------------------------------------------------

    effect(() => {
      const paginator = this.paginator();
      const sort = this.sort();

      if (this.clientPagination() && paginator) {
        this.dataSource.paginator = paginator;
      }

      if (this.clientSorting() && sort) {
        this.dataSource.sort = sort;
      }
    });
  }

  // --------------------------------------------------
  // SORTING
  // --------------------------------------------------

  onSortChange(event: Sort): void {
    const sortEvent: TaoTableSortEvent = {
      active: event.active,
      direction: event.direction,
    };

    /*
     * In server mode the parent component performs
     * the actual sorting/API request.
     */
    if (!this.clientSorting()) {
      this.sortChange.emit(sortEvent);
    }
  }

  // --------------------------------------------------
  // PAGINATION
  // --------------------------------------------------

  onPageChange(event: TaoTablePageEvent): void {
    /*
     * Client-side pagination is automatically handled
     * by MatTableDataSource.
     *
     * Server-side pagination is handled by the parent.
     */
    if (!this.clientPagination()) {
      this.pageChange.emit(event);
    }
  }

  // --------------------------------------------------
  // ROW CLICK
  // --------------------------------------------------

  onRowClick(row: T, index: number): void {
    this.rowClick.emit({
      row,
      index,
    });
  }

  // --------------------------------------------------
  // SELECTION
  // --------------------------------------------------

  isSelected(row: T): boolean {
    return this.selectedRows.has(row);
  }

  toggleRow(row: T): void {
    if (this.isSelected(row)) {
      this.selectedRows.delete(row);
    } else {
      this.selectedRows.add(row);
    }

    this.emitSelection();
  }

  toggleAll(): void {
    const rows = this.dataSource.filteredData;

    const allSelected = rows.length > 0 && rows.every((row) => this.selectedRows.has(row));

    if (allSelected) {
      rows.forEach((row) => {
        this.selectedRows.delete(row);
      });
    } else {
      rows.forEach((row) => {
        this.selectedRows.add(row);
      });
    }

    this.emitSelection();
  }

  allSelected(): boolean {
    const rows = this.dataSource.filteredData;

    return rows.length > 0 && rows.every((row) => this.selectedRows.has(row));
  }

  someSelected(): boolean {
    const rows = this.dataSource.filteredData;

    const selectedCount = rows.filter((row) => this.selectedRows.has(row)).length;

    return selectedCount > 0 && selectedCount < rows.length;
  }

  private emitSelection(): void {
    this.selectionChange.emit({
      rows: Array.from(this.selectedRows),
    });
  }

  // --------------------------------------------------
  // FILTERING
  // --------------------------------------------------

  private configureFilter(): void {
    if (!this.config().filterable) {
      return;
    }

    this.dataSource.filter = this.filter().trim().toLowerCase();
  }

  // --------------------------------------------------
  // SORTING
  // --------------------------------------------------

  private configureSorting(): void {
    this.dataSource.sortingDataAccessor = (row: T, columnId: string): string | number => {
      const column = this.columns().find((column) => column.key === columnId);

      if (!column) {
        return '';
      }

      const value = row[column.key];

      if (typeof value === 'number') {
        return value;
      }

      if (value instanceof Date) {
        return value.getTime();
      }

      return String(value ?? '').toLowerCase();
    };
  }

  // --------------------------------------------------
  // CELL VALUE
  // --------------------------------------------------

  /**
   * Resolves whether a column should wrap its content onto
   * multiple lines.
   *
   * The column level `wrap` flag wins; otherwise the table level
   * `config.wrap` default is used.
   */
  isWrapped(column: TaoTableColumn<T>): boolean {
    return column.wrap ?? this.config().wrap ?? false;
  }

  /**
   * Resolves the maximum number of characters rendered for a column.
   *
   * The column level `maxLength` wins; otherwise the table level
   * `config.maxLength` default is used. `undefined` means no limit.
   */
  getMaxLength(column: TaoTableColumn<T>): number | undefined {
    return column.maxLength ?? this.config().maxLength;
  }

  /**
   * Cell value prepared for display.
   *
   * When the resolved `maxLength` is exceeded the value is truncated
   * and suffixed with an ellipsis. Truncation happens before wrapping,
   * so `wrap` and `maxLength` can be combined safely.
   */
  getDisplayValue(row: T, column: TaoTableColumn<T>): string {
    const value = this.getCellValue(row, column);
    const maxLength = this.getMaxLength(column);

    if (maxLength === undefined || maxLength <= 0 || value.length <= maxLength) {
      return value;
    }

    return `${value.slice(0, maxLength).trimEnd()}…`;
  }

  /**
   * Tooltip for a cell: the full value only when it was truncated,
   * otherwise `null` so no empty tooltip is rendered.
   *
   * Custom templates are responsible for their own content.
   */
  getCellTitle(row: T, column: TaoTableColumn<T>): string | null {
    if (column.type === 'custom') {
      return null;
    }

    const value = this.getCellValue(row, column);
    const maxLength = this.getMaxLength(column);

    if (maxLength === undefined || maxLength <= 0 || value.length <= maxLength) {
      return null;
    }

    return value;
  }

  getCellValue(row: T, column: TaoTableColumn<T>): string {
    const value = row[column.key];

    if (column.formatter) {
      return column.formatter(value, row);
    }

    if (value === null || value === undefined || value === '') {
      return '—';
    }

    return String(value);
  }

  getProgressValue(row: T, column: TaoTableColumn<T>): number {
    const value = row[column.key];
    const progress = typeof value === 'number' ? value : Number(value);

    if (!Number.isFinite(progress)) {
      return 0;
    }

    return Math.min(100, Math.max(0, progress));
  }
}
