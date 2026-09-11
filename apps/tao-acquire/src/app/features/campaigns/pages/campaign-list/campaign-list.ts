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

  readonly selectedStatus = signal<number>(1);

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
      key: 'organisationId',
      label: 'Organisation Id',
      sortable: true,
    },

    {
      key: 'referenceNumber',
      label: 'Reference Number',
      sortable: true,
    },
    {
      key: 'hiringManagerId',
      label: 'Hiring Manager Id',
      sortable: true,
    },
    {
      key: 'recruiterId',
      label: 'Recruiter Id',
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
  // ---------------------------------------------------------
  // Campaign Data
  // ---------------------------------------------------------
  //
  // Temporary mock data.
  // This will eventually come from CampaignStore.
  //

  readonly campaigns = signal<CampaignVm[]>([
    {
      id: '01A05E11-5971-755E-A5E9-DFC4BF6DBE46',
      organisationId: '019FA8F7-E474-722F-B476-C07A63658297',
      name: 'Fresher .NET profile',
      referenceNumber: 'FNPP',
      hiringManagerId: '019FA8F7-E53A-76F6-A7E1-5F7096B2CCDF',
      recruiterId: '019FA8F7-E53A-7C15-B8CD-3529C4AE7992',
      status: 1,
      numberOfOpenings: 3,
      createdOn: '2026-09-01T17:43:10.4498174',
    },
    {
      id: '019FF5FE-1CC4-7C46-8E4C-704A608CEF6C',
      organisationId: '019FF5FE-1CBA-7BC2-95F3-6D57C4E711BC',
      name: 'Senior .NET Developer',
      referenceNumber: 'CMP-1ca42b226a2442c688338c7621b0fd8d',
      hiringManagerId: '019FF5FE-1CBF-7A76-8E69-77B27C776903',
      recruiterId: '019FF5FE-1CBD-7B52-85BC-9803C1F05C12',
      status: 1,
      numberOfOpenings: 2,
      createdOn: '2026-08-12T12:41:39.2688908',
    },
    {
      id: '019FF5FE-1CA5-7DE5-9FF1-0BC335285AED',
      organisationId: '019FF5FE-1C9D-7589-94D6-014E4556A3BE',
      name: 'Senior .NET Developer',
      referenceNumber: 'CMP-a54f28e963a7447b8c78fd7546348e83',
      hiringManagerId: '019FF5FE-1CA3-74A7-BA07-7EF6E10BF8F2',
      recruiterId: '019FF5FE-1CA0-7036-B758-D6D3155DC52F',
      status: 1,
      numberOfOpenings: 2,
      createdOn: '2026-08-12T12:41:39.2376322',
    },
    {
      id: '019FF5FE-1C67-7E7F-9DD7-6224262CB9FD',
      organisationId: '019FF5FE-1C58-7C49-A0D8-E7799E78F3FD',
      name: 'Senior .NET Developer',
      referenceNumber: 'CMP-8496a09a4bd14ee48b3f6d885d790591',
      hiringManagerId: '019FF5FE-1C65-7812-9740-EDF2427E1FA9',
      recruiterId: '019FF5FE-1C5F-745F-9B0D-D62392F8054C',
      status: 1,
      numberOfOpenings: 2,
      createdOn: '2026-08-12T12:41:39.1759068',
    },
    {
      id: '019FF5FE-1860-78A6-BFFC-152BEE680202',
      organisationId: '019FF5FE-170D-7039-868D-14CDDA867269',
      name: 'Senior .NET Developer',
      referenceNumber: 'CMP-6ad0f8d6c0b347368b9658938b527502',
      hiringManagerId: '019FF5FE-181F-7E63-A547-9DF6EE4E8118',
      recruiterId: '019FF5FE-181F-7E63-A547-9DF6EE4E8118',
      status: 1,
      numberOfOpenings: 2,
      createdOn: '2026-08-12T12:41:38.1444935',
    },
    {
      id: '019FEA88-5597-7D81-9C72-50467AE3C654',
      organisationId: '019FEA88-4BCB-714B-AD0D-05B475AC42E6',
      name: 'Senior .NET Developer',
      referenceNumber: 'CMP-700724b9781140e0b9740ae482d919f6',
      hiringManagerId: '019FEA88-50BF-7904-AD2E-42E0469A6F3E',
      recruiterId: '019FEA88-4F8F-7018-BB69-88C0B2611DEB',
      status: 1,
      numberOfOpenings: 2,
      createdOn: '2026-08-10T07:17:11.1917216',
    },
    {
      id: '019FEA87-DDF5-7429-AF80-C10B1AE4CB2A',
      organisationId: '019FEA87-DC52-7B04-A45F-36D80C73B08C',
      name: 'Senior .NET Developer',
      referenceNumber: 'CMP-a86ba8c2f5264585832a33d94f8657f2',
      hiringManagerId: '019FEA87-DDF1-7A23-B534-AC7FD2D9458B',
      recruiterId: '019FEA87-DDBC-7A61-ADDA-FBBA4391D35A',
      status: 1,
      numberOfOpenings: 2,
      createdOn: '2026-08-10T07:16:40.5653954',
    },
    {
      id: '019FEA87-B424-7014-8778-6E7A2A4463DF',
      organisationId: '019FEA87-B327-7494-9BC9-04CBC2C0220D',
      name: 'Senior .NET Developer',
      referenceNumber: 'CMP-baf02769045342a1bd7f4f5e3aa9e076',
      hiringManagerId: '019FEA87-B421-7492-9C5C-6134A375037D',
      recruiterId: '019FEA87-B3F4-721F-B125-9DB06CEA2201',
      status: 1,
      numberOfOpenings: 2,
      createdOn: '2026-08-10T07:16:29.8606665',
    },
    {
      id: '019FEA82-8724-7DD9-90CB-7653996C0FDC',
      organisationId: '019FEA82-85CE-7F25-B0B4-588DD4D1D8DF',
      name: 'Senior .NET Developer',
      referenceNumber: 'CMP-6fc466298c944c359e79efd4dac897df',
      hiringManagerId: '019FEA82-8720-74D0-A2E6-39E6A4047A68',
      recruiterId: '019FEA82-86E6-7332-9FBE-143DAE852E02',
      status: 1,
      numberOfOpenings: 2,
      createdOn: '2026-08-10T07:10:50.6607330',
    },
    {
      id: '019FEA80-7352-7B99-846B-0D2CDACB3945',
      organisationId: '019FEA80-71D1-7DC6-A242-838F4B929C96',
      name: 'Senior .NET Developer',
      referenceNumber: 'CMP-d32c78efee2a4dd8b0f02a7cd4db7eae',
      hiringManagerId: '019FEA80-734E-7A57-BA39-16C649F876EF',
      recruiterId: '019FEA80-730A-7D25-9116-9F422B57C5D4',
      status: 1,
      numberOfOpenings: 2,
      createdOn: '2026-08-10T07:08:34.5149153',
    },
    {
      id: '019FEA7B-E79A-701D-AB23-88F7CBCB254C',
      organisationId: '019FEA7B-E5E6-773E-924D-31B5D4E2849C',
      name: 'Senior .NET Developer',
      referenceNumber: 'CMP-0124bf3c23094b348075a30c3ce356f8',
      hiringManagerId: '019FEA7B-E793-7E80-BA87-2DE4A6D63F9C',
      recruiterId: '019FEA7B-E730-7AA8-9616-6C2B550AC44D',
      status: 1,
      numberOfOpenings: 2,
      createdOn: '2026-08-10T07:03:36.6029525',
    },
    {
      id: '019FEA7B-6610-7085-A1B1-CED2133C2CC3',
      organisationId: '019FEA7B-64DC-7151-85F6-9F66390214F5',
      name: 'Senior .NET Developer',
      referenceNumber: 'CMP-027370af6d7b4a6c8436cfb0197a7cc2',
      hiringManagerId: '019FEA7B-660C-7F76-967E-94155F7B62D8',
      recruiterId: '019FEA7B-65D4-7449-9C94-58FE047DE479',
      status: 1,
      numberOfOpenings: 2,
      createdOn: '2026-08-10T07:03:03.4404911',
    },
    {
      id: '019FAECD-446E-7A83-AE22-C9A5732453E7',
      organisationId: '019FAECD-4376-7AC2-9975-B8F2FE38872F',
      name: 'Senior .NET Developer',
      referenceNumber: 'CMP-e15223a68c454f7db5ea0b08c2089056',
      hiringManagerId: '019FAECD-446B-7E83-A9EF-C85B39094AA1',
      recruiterId: '019FAECD-4436-7940-A762-1AB5D4758621',
      status: 1,
      numberOfOpenings: 2,
      createdOn: '2026-07-29T16:55:15.8225845',
    },
    {
      id: '019FAEC6-3BCA-742D-BAF9-49E48FCB8B82',
      organisationId: '019FAEC4-EEA0-7C4D-99A6-B7C2A2563630',
      name: 'Senior .NET Developer',
      referenceNumber: 'CMP-02c3a5ac305446ec8d119a0c6638d539',
      hiringManagerId: '019FAEC5-0FB3-7B4D-B597-2D9AC0A23027',
      recruiterId: '019FAEC5-0D3A-76D1-9264-B20A70784556',
      status: 1,
      numberOfOpenings: 2,
      createdOn: '2026-07-29T16:47:34.8585680',
    },
    {
      id: '019FAEC4-0589-72A3-BAAE-89CC46777EAA',
      organisationId: '019FAEC4-0452-78B2-B116-2537245A8CDF',
      name: 'Senior .NET Developer',
      referenceNumber: 'CMP-e3e64c5b1d694cdc89d4432650d3babd',
      hiringManagerId: '019FAEC4-0585-739A-A8BF-7734A58C2BBA',
      recruiterId: '019FAEC4-054B-7FE6-BA46-63E1215B6300',
      status: 1,
      numberOfOpenings: 2,
      createdOn: '2026-07-29T16:45:09.8975179',
    },
    {
      id: '019FADD8-AF74-704D-8723-CFE7B052C5AC',
      organisationId: '019FADD8-AE67-7170-99CD-5A3A7719504B',
      name: 'Senior .NET Developer',
      referenceNumber: 'CMP-cfc182126daf42eca8da73db95b80a9a',
      hiringManagerId: '019FADD8-AF6F-7DBB-9832-A68F8DD66C34',
      recruiterId: '019FADD8-AF6E-7901-B3BF-E1A08B5FAD77',
      status: 1,
      numberOfOpenings: 2,
      createdOn: '2026-07-29T12:28:06.9000963',
    },
    {
      id: '019FAC5A-7B38-7671-90DE-5772B5358EF9',
      organisationId: '019FAC5A-78C8-7800-996B-21EAF607545D',
      name: 'Senior .NET Developer',
      referenceNumber: 'CMP-47509c6db4bf4bff8b30c51c877ed8da',
      hiringManagerId: '019FAC5A-7B24-7811-8295-B74237A2B475',
      recruiterId: '019FAC5A-7AC9-7071-ADE1-E2316D91294C',
      status: 1,
      numberOfOpenings: 2,
      createdOn: '2026-07-29T05:30:38.7768302',
    },
    {
      id: '019FAC45-9A31-7E2F-9390-EDFFAD5DA667',
      organisationId: '019FAC45-9701-784E-A61C-5B1D274D5A43',
      name: 'Senior .NET Developer',
      referenceNumber: 'CMP-e9a65c129a1c4977b9cc870fc0c762ba',
      hiringManagerId: '019FAC45-9A2A-7967-85EF-A0A6554DA1EF',
      recruiterId: '019FAC45-99B1-7C43-B740-70663E71DEED',
      status: 1,
      numberOfOpenings: 2,
      createdOn: '2026-07-29T05:07:50.4498536',
    },
    {
      id: '019FAC40-5ED3-7810-AB3F-E8F86B22B4B1',
      organisationId: '019FAC40-5C9D-7288-93B1-BF91E16A9C53',
      name: 'Senior .NET Developer',
      referenceNumber: 'CMP-0b9d0d0c24b54965af0c5f97ceeabee2',
      hiringManagerId: '019FAC40-5EBE-7C13-8A65-D3B3197CCC98',
      recruiterId: '019FAC40-5E62-781E-978D-581E3FCD0548',
      status: 1,
      numberOfOpenings: 2,
      createdOn: '2026-07-29T05:02:07.5715666',
    },
    {
      id: '019FAC3E-BB24-70DB-824A-0213D9968AE2',
      organisationId: '019FAC3E-B8A9-7F77-82F9-F0A7F5D3EA19',
      name: 'Senior .NET Developer',
      referenceNumber: 'CMP-428850549dd0417c9795bcbad589677f',
      hiringManagerId: '019FAC3E-BB0D-7559-BBAA-2D4FC2805FD8',
      recruiterId: '019FAC3E-BABA-78F2-8734-0823D292ACA9',
      status: 1,
      numberOfOpenings: 2,
      createdOn: '2026-07-29T05:00:20.1320923',
    },
    {
      id: '019FAC3D-2DA8-7AFE-AEF0-8841B5C66708',
      organisationId: '019FAC3D-2B64-7D6C-99B9-B1BCE93FD120',
      name: 'Senior .NET Developer',
      referenceNumber: 'CMP-a25fed1a7d3a48e79dbc6722ed570265',
      hiringManagerId: '019FAC3D-2D93-736A-A2DE-7D8B9A917812',
      recruiterId: '019FAC3D-2D33-766C-AFC3-02AEB64E7F29',
      status: 1,
      numberOfOpenings: 2,
      createdOn: '2026-07-29T04:58:38.3767766',
    },
    {
      id: '019FAC32-1EF4-7710-A1E6-333887429A8E',
      organisationId: '019FAC32-1C54-7A58-80FC-79B5D884988B',
      name: 'Senior .NET Developer',
      referenceNumber: 'CMP-384b87fd871843eeaae546c9a27a18db',
      hiringManagerId: '019FAC32-1EED-72FE-897B-EB89A7C8A59F',
      recruiterId: '019FAC32-1E7C-7603-BF8B-AB13E94B5218',
      status: 1,
      numberOfOpenings: 2,
      createdOn: '2026-07-29T04:46:33.7160759',
    },
    {
      id: '019FAC2B-B759-78F5-A497-115DDC1B4CF2',
      organisationId: '019FAC2B-A490-753D-B929-2194CAD02FAC',
      name: 'Senior .NET Developer',
      referenceNumber: 'CMP-73854705463046a7b7177ab8d86e25e4',
      hiringManagerId: '019FAC2B-AECF-701F-B0BB-33F1CF6851A8',
      recruiterId: '019FAC2B-AA73-765E-9F60-FD064AC6B406',
      status: 1,
      numberOfOpenings: 2,
      createdOn: '2026-07-29T04:39:33.9777795',
    },
    {
      id: '019FAC27-1CEF-7AEB-89B9-3353012843F1',
      organisationId: '019FAC26-E9AC-7FE6-844D-D0FF17F02892',
      name: 'Senior .NET Developer',
      referenceNumber: 'CMP-36ebde3d23a34e808fc7981eac307537',
      hiringManagerId: '019FAC27-17E9-7FBA-8048-A1E85809713A',
      recruiterId: '019FAC27-0D89-7B64-8020-944451C4F593',
      status: 1,
      numberOfOpenings: 2,
      createdOn: '2026-07-29T04:34:32.3035044',
    },
    {
      id: '019FAC22-9BEA-78A8-9E27-492BD4321485',
      organisationId: '019FAC22-9948-706D-9C7E-22EA009C1E7E',
      name: 'Senior .NET Developer',
      referenceNumber: 'CMP-f94df8f756f14e47ab2453e567a838a0',
      hiringManagerId: '019FAC22-9BDE-7493-AF75-7E78C89DB153',
      recruiterId: '019FAC22-9B67-7222-A52C-79D690B7B7CA',
      status: 1,
      numberOfOpenings: 2,
      createdOn: '2026-07-29T04:29:37.1302539',
    },
    {
      id: '019FA8F7-E8FA-76C1-9E2E-0EFCFFD29F8C',
      organisationId: '019FA8F7-E474-722F-B476-C07A63658297',
      name: 'Senior .NET Hiring',
      referenceNumber: 'CMP-0012',
      hiringManagerId: '019FA8F7-E53A-7C15-B8CD-3529C4AE7992',
      recruiterId: '019FA8F7-E53A-76F6-A7E1-5F7096B2CCDF',
      status: 1,
      numberOfOpenings: 3,
      createdOn: '2026-07-28T13:44:07.1622042',
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
        !search || campaign.name.toLowerCase().includes(search) || campaign.status === status;

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
