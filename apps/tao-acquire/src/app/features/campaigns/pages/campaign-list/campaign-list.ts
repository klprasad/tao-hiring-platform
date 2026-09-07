import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

import { CampaignVm } from '../../models/campaign.models';

import {
  TaoButtonComponent,
  TaoCardComponent,
  TaoDataTableComponent,
  TaoEmptyStateComponent,
  TaoSelectComponent,
  TaoTableColumn,
  TaoTableConfig,
} from '@tao/ui';

@Component({
  selector: 'tao-campaign-list',
  imports: [
    FormsModule,
    TaoButtonComponent,
    TaoCardComponent,
    TaoSelectComponent,
    TaoDataTableComponent,
    TaoEmptyStateComponent,
    MatIconModule,
  ],
  templateUrl: './campaign-list.html',
  styleUrl: './campaign-list.scss',
})
export class CampaignListComponent {
  private readonly router = inject(Router);

  // ---------------------------------------------------------
  // UI State
  // ---------------------------------------------------------

  readonly searchTerm = signal('');

  readonly selectedStatus = signal<string>('all');

  // ---------------------------------------------------------
  // Status Filter Options
  // ---------------------------------------------------------

  readonly statusOptions = [
    'all',
    'active',
    'draft',
    'processing',
    'completed',
    'failed',
    'archived',
  ];

  // ---------------------------------------------------------
  // Table Configuration
  // ---------------------------------------------------------

  readonly columns: TaoTableColumn<CampaignVm>[] = [
    {
      key: 'name',
      label: 'Name',
      sortable: true,
    },

    {
      key: 'jobTitle',
      label: 'Job Title',
      sortable: true,
    },

    {
      key: 'candidateCount',
      label: 'Candidates',
      sortable: true,
      align: 'center',
      type: 'number',
    },

    {
      key: 'shortlistedCount',
      label: 'Shortlisted',
      sortable: true,
      align: 'center',
      type: 'number',
    },

    {
      key: 'progress',
      label: 'Progress',
      sortable: true,
      type: 'progress',
    },

    {
      key: 'status',
      label: 'Status',
      sortable: true,
      type: 'status',
    },

    {
      key: 'updatedOn',
      label: 'Updated On',
      sortable: true,
      type: 'date',
    },
  ];
  readonly tableConfig: TaoTableConfig = {
    sortable: true,
    sortMode: 'client',
    pagination: true,
    paginationMode: 'client',
    pageSize: 10,
    pageSizeOptions: [5, 10, 25, 50],
    showFirstLastButtons: true,
    rowHover: true,
    selectable: false,
    stickyHeader: false,
    density: 'comfortable',
  };
  // ---------------------------------------------------------
  // Campaign Data
  // ---------------------------------------------------------
  //
  // Temporary mock data.
  // This will eventually come from CampaignStore.
  //

  readonly campaigns = signal<CampaignVm[]>([
    {
      id: '1',
      name: 'Senior .NET Hiring',
      jobTitle: 'Senior .NET Developer',
      department: 'engineering',
      location: 'Hyderabad',
      candidateCount: 124,
      shortlistedCount: 18,
      assessmentCount: 6,
      progress: 15,
      status: 'active',
      createdOn: '2026-08-20',
      updatedOn: '2026-09-05',
    },

    {
      id: '2',
      name: 'Frontend Hiring',
      jobTitle: 'Senior Angular Developer',
      department: 'engineering',
      location: 'Bengaluru',
      candidateCount: 86,
      shortlistedCount: 10,
      assessmentCount: 4,
      progress: 12,
      status: 'draft',
      createdOn: '2026-08-22',
      updatedOn: '2026-09-04',
    },

    {
      id: '3',
      name: 'QA Engineering Hiring',
      jobTitle: 'QA Automation Engineer',
      department: 'quality-engineering',
      location: 'Pune',
      candidateCount: 53,
      shortlistedCount: 9,
      assessmentCount: 3,
      progress: 17,
      status: 'active',
      createdOn: '2026-08-25',
      updatedOn: '2026-09-03',
    },

    {
      id: '4',
      name: 'Backend Engineering',
      jobTitle: 'Backend Engineer',
      department: 'engineering',
      location: 'Remote',
      candidateCount: 0,
      shortlistedCount: 0,
      assessmentCount: 0,
      progress: 0,
      status: 'processing',
      createdOn: '2026-09-01',
      updatedOn: '2026-09-07',
    },
  ]);

  // ---------------------------------------------------------
  // Filtered Campaigns
  // ---------------------------------------------------------

  readonly filteredCampaigns = computed(() => {
    const search = this.searchTerm().trim().toLowerCase();

    const status = this.selectedStatus();

    return this.campaigns().filter((campaign) => {
      const matchesSearch =
        !search ||
        campaign.name.toLowerCase().includes(search) ||
        campaign.jobTitle.toLowerCase().includes(search) ||
        campaign.department.toLowerCase().includes(search) ||
        campaign.location.toLowerCase().includes(search);

      const matchesStatus = status === 'all' || campaign.status === status;

      return matchesSearch && matchesStatus;
    });
  });

  readonly tableRows = computed(
    () => this.filteredCampaigns() as unknown as Record<string, unknown>[],
  );

  // ---------------------------------------------------------
  // Actions
  // ---------------------------------------------------------

  createCampaign(): void {
    this.router.navigate(['/campaigns/create']);
  }

  onSearchInput(event: Event): void {
    this.searchTerm.set((event.target as HTMLInputElement).value);
  }

  openCampaign(campaign: CampaignVm): void {
    this.router.navigate(['/campaigns', campaign.id]);
  }

  editCampaign(campaign: CampaignVm): void {
    this.router.navigate(['/campaigns', campaign.id, 'edit']);
  }

  onRowAction(event: { action: string; row: CampaignVm }): void {
    switch (event.action) {
      case 'open':
        this.openCampaign(event.row);
        break;

      case 'edit':
        this.editCampaign(event.row);
        break;
    }
  }

  onRowClick(event: { row: CampaignVm }): void {
    this.openCampaign(event.row);
  }

  // ---------------------------------------------------------
  // Empty State
  // ---------------------------------------------------------

  get hasCampaigns(): boolean {
    return this.filteredCampaigns().length > 0;
  }
}
