import { Component, computed, effect, input, viewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

@Component({
  selector: 'tao-table, tao-data-table',
  imports: [MatPaginatorModule, MatSortModule, MatTableModule],
  templateUrl: './tao-data-table.component.html',
  styleUrl: './tao-data-table.component.scss',
})
export class TaoDataTableComponent {
  readonly columns = input<string[]>([]);
  readonly rows = input<Record<string, unknown>[]>([]);
  readonly pageSize = input(10);
  readonly pageSizeOptions = input([5, 10, 25]);
  readonly displayedColumns = computed(() => this.columns());
  readonly dataSource = new MatTableDataSource<Record<string, unknown>>();
  readonly paginator = viewChild(MatPaginator);
  readonly sort = viewChild(MatSort);

  constructor() {
    effect(() => {
      this.dataSource.data = this.rows();
      const paginator = this.paginator();
      const sort = this.sort();
      if (paginator) this.dataSource.paginator = paginator;
      if (sort) this.dataSource.sort = sort;
    });
  }
}
