import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

import { CampaignVm, mapCampaignDtoToVm } from '../../models/campaign.model';

import {
  TaoButtonComponent,
  TaoDataTableComponent,
  TaoEmptyStateComponent,
  TaoTableColumn,
  TaoTableConfig,
} from '@tao/ui';
import { CampaignService } from '../../data-access/campaign.service';

@Component({
  selector: 'tao-campaign-list',
  imports: [
    FormsModule,
    TaoButtonComponent,
    TaoDataTableComponent,
    TaoEmptyStateComponent,
    MatIconModule,
  ],
  templateUrl: './campaign-list.html',
  styleUrl: './campaign-list.scss',
})
export class CampaignListComponent {
  private readonly router = inject(Router);
  private readonly campaignService = inject(CampaignService);
  readonly searchTerm = signal('');
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
      key: 'referenceNumber',
      label: 'Reference Number',
      sortable: true,
    },
    {
      key: 'hiringManagerName',
      label: 'Hiring Manager',
      sortable: true,
    },
    {
      key: 'recruiterName',
      label: 'Recruiter',
      sortable: false,
    },
    {
      key: 'numberOfOpenings',
      label: 'Number of Openings',
      sortable: true,
      align: 'center',
      type: 'number',
    },

    {
      key: 'status',
      label: 'Status',
      sortable: true,
      type: 'status',
    },

    {
      key: 'createdOn',
      label: 'Created On',
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

  readonly campaigns = signal<CampaignVm[]>([]);

  ngOnInit() {
    this.loadCampaigns();
  }
  loadCampaigns() {
    this.campaignService.getAllCampaigns().subscribe((campaigns) => {
      this.campaigns.set(campaigns.map(mapCampaignDtoToVm));
    });
  }
  // ---------------------------------------------------------
  // Filtered Campaigns
  // ---------------------------------------------------------

  readonly filteredCampaigns = computed(() => {
    const search = this.searchTerm().trim().toLowerCase();
    return this.campaigns().filter((campaign) => {
      const matchesSearch = !search || campaign.name.toLowerCase().includes(search);
      return matchesSearch;
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
