import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaoDataTableComponent } from './tao-data-table.component';

describe('TaoDataTableComponent', () => {
  let fixture: ComponentFixture<TaoDataTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TaoDataTableComponent] }).compileComponents();
    fixture = TestBed.createComponent(TaoDataTableComponent);
    fixture.detectChanges();
  });

  it('renders the component template', () => {
    expect(fixture.componentInstance).toBeInstanceOf(TaoDataTableComponent);
    expect(fixture.nativeElement.innerHTML).toBeTruthy();
  });

  it('filters hidden columns and uses default pagination and sorting settings', () => {
    fixture.componentRef.setInput('columns', [
      { key: 'name', label: 'Name' },
      { key: 'email', label: 'Email', hidden: true },
    ]);
    fixture.detectChanges();

    expect(fixture.componentInstance.visibleColumns()).toEqual(['name']);
    expect(fixture.componentInstance.effectivePageSize()).toBe(10);
    expect(fixture.componentInstance.sortingEnabled()).toBe(true);
    expect(fixture.componentInstance.paginationEnabled()).toBe(true);
  });

  it('emits row clicks and tracks row selection', () => {
    const row = { id: 'candidate-1' };
    const rowClick = vi.fn();
    const selectionChange = vi.fn();
    fixture.componentInstance.rowClick.subscribe(rowClick);
    fixture.componentInstance.selectionChange.subscribe(selectionChange);

    fixture.componentInstance.onRowClick(row, 2);
    fixture.componentInstance.toggleRow(row);
    expect(fixture.componentInstance.isSelected(row)).toBe(true);
    fixture.componentInstance.toggleRow(row);

    expect(rowClick).toHaveBeenCalledWith({ row, index: 2 });
    expect(selectionChange).toHaveBeenCalledTimes(2);
    expect(fixture.componentInstance.isSelected(row)).toBe(false);
  });

  it('emits sort and page changes only when server modes are configured', () => {
    const sortChange = vi.fn();
    const pageChange = vi.fn();
    fixture.componentInstance.sortChange.subscribe(sortChange);
    fixture.componentInstance.pageChange.subscribe(pageChange);
    fixture.componentInstance.onSortChange({ active: 'name', direction: 'asc' });
    fixture.componentInstance.onPageChange({ pageIndex: 1, pageSize: 25 });
    expect(sortChange).not.toHaveBeenCalled();
    expect(pageChange).not.toHaveBeenCalled();

    fixture.componentRef.setInput('config', { sortMode: 'server', paginationMode: 'server' });
    fixture.componentInstance.onSortChange({ active: 'name', direction: 'desc' });
    fixture.componentInstance.onPageChange({ pageIndex: 1, pageSize: 25 });
    expect(sortChange).toHaveBeenCalledWith({ active: 'name', direction: 'desc' });
    expect(pageChange).toHaveBeenCalledWith({ pageIndex: 1, pageSize: 25 });
  });
});
