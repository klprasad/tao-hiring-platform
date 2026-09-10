import { Component, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import {
  TaoCardComponent,
  TaoDataTableComponent,
  TaoTableColumn,
  TaoTableConfig,
} from '@tao/ui';

import { JobProfileVm } from '../../models/job-profile.vm';

@Component({
  selector: 'tao-job-profile-table',
  imports: [MatIconModule, TaoCardComponent, TaoDataTableComponent],
  templateUrl: './job-profile-table.html',
  styleUrl: './job-profile-table.scss',
})
export class JobProfileTableComponent {
  readonly profiles = input.required<JobProfileVm[]>();
  readonly profileSelected = output<JobProfileVm>();
  readonly profileEdited = output<JobProfileVm>();

  readonly columns: TaoTableColumn<JobProfileVm>[] = [
    { key: 'title', label: 'Role', sortable: true },
    { key: 'department', label: 'Department', sortable: true },
    { key: 'location', label: 'Location', sortable: true },
    { key: 'employmentType', label: 'Employment', sortable: true },
    { key: 'experienceLevel', label: 'Experience', sortable: true },
    { key: 'status', label: 'Status', sortable: true, type: 'status' },
    { key: 'updatedOn', label: 'Updated', sortable: true, type: 'date' },
  ];

  readonly tableConfig: TaoTableConfig = {
    sortable: true,
    sortMode: 'client',
    pagination: true,
    paginationMode: 'client',
    pageSize: 10,
    pageSizeOptions: [5, 10, 25],
    showFirstLastButtons: true,
    rowHover: true,
    selectable: false,
    stickyHeader: false,
    density: 'comfortable',
  };

  selectProfile(event: { row: JobProfileVm }): void {
    this.profileSelected.emit(event.row);
  }

  editProfile(profile: JobProfileVm, event: Event): void {
    event.stopPropagation();
    this.profileEdited.emit(profile);
  }
}