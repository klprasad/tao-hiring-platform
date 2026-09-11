import { Component, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { TaoCardComponent, TaoDataTableComponent, TaoTableColumn, TaoTableConfig } from '@tao/ui';

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
    { key: 'campaignId', label: 'Campaign', sortable: true },
    {
      key: 'originalJobDescription',
      label: 'Job description',
      sortable: true,
      wrap: true,
      maxLength: 200,
      width: '40%',
    },
    { key: 'status', label: 'Status', sortable: true, type: 'status' },
    { key: 'generatedOn', label: 'Generated on', sortable: true, type: 'date' },
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
