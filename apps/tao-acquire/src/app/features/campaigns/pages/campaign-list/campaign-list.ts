import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { CampaignVm } from '../../models/campaign.models';

import {
  TaoButtonComponent,
  TaoCardComponent,
  TaoDataTableComponent,
  TaoEmptyStateComponent,
  TaoInputComponent,
  TaoPageHeaderComponent,
  TaoSelectComponent,
} from '@tao/ui';

@Component({
  selector: 'tao-campaign-list',
  imports: [
    FormsModule,
    TaoPageHeaderComponent,
    TaoButtonComponent,
    TaoCardComponent,
    TaoInputComponent,
    TaoSelectComponent,
    TaoDataTableComponent,
    TaoEmptyStateComponent,
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

  readonly columns = [
    'name',
    'jobTitle',
    'candidateCount',
    'shortlistedCount',
    'status',
    'updatedOn',
  ];

  // ---------------------------------------------------------
  // Campaign Data
  // ---------------------------------------------------------
  //
  // Temporary mock data.
  // This will eventually come from CampaignStore.
  //

  readonly campaigns = signal<CampaignVm[]>([
    {
      id: 'cmp-001',
      name: 'Senior .NET Hiring',
      jobTitle: 'Senior .NET Developer',
      department: 'Engineering',
      location: 'Hyderabad',
      status: 'active',
      candidateCount: 124,
      shortlistedCount: 18,
      assessmentCount: 12,
      createdOn: '2026-08-20',
      updatedOn: '2026-09-05',
    },

    {
      id: 'cmp-002',
      name: 'Frontend Hiring',
      jobTitle: 'Senior Angular Developer',
      department: 'Engineering',
      location: 'Bangalore',
      status: 'draft',
      candidateCount: 86,
      shortlistedCount: 10,
      assessmentCount: 0,
      createdOn: '2026-08-25',
      updatedOn: '2026-09-04',
    },

    {
      id: 'cmp-003',
      name: 'QA Engineering Hiring',
      jobTitle: 'QA Automation Engineer',
      department: 'Quality Engineering',
      location: 'Pune',
      status: 'active',
      candidateCount: 53,
      shortlistedCount: 9,
      assessmentCount: 7,
      createdOn: '2026-08-28',
      updatedOn: '2026-09-03',
    },

    {
      id: 'cmp-004',
      name: 'Backend Engineering',
      jobTitle: 'Backend Engineer',
      department: 'Engineering',
      location: 'Chennai',
      status: 'processing',
      candidateCount: 0,
      shortlistedCount: 0,
      assessmentCount: 0,
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

  // ---------------------------------------------------------
  // Empty State
  // ---------------------------------------------------------

  get hasCampaigns(): boolean {
    return this.filteredCampaigns().length > 0;
  }
}
