import { Component } from '@angular/core';
import {
  TaoButtonComponent,
  TaoCardComponent,
  TaoDataTableComponent,
  TaoInputComponent,
  TaoPageHeaderComponent,
  TaoSelectComponent,
} from 'tao-ui';

@Component({
  selector: 'tao-campaigns-page',
  imports: [
    TaoButtonComponent,
    TaoCardComponent,
    TaoDataTableComponent,
    TaoInputComponent,
    TaoPageHeaderComponent,
    TaoSelectComponent,
  ],
  templateUrl: './campaigns.page.html',
  styleUrl: './campaigns.page.scss',
})
export class CampaignsPage {
  protected readonly campaignColumns = ['campaign', 'role', 'candidates', 'status', 'updated'];
  protected readonly campaignRows = [
    {
      campaign: 'Senior Product Designer',
      role: 'Product',
      candidates: 12,
      status: 'Active',
      updated: 'Today',
    },
    {
      campaign: 'Backend Engineer',
      role: 'Engineering',
      candidates: 42,
      status: 'Active',
      updated: 'Yesterday',
    },
    {
      campaign: 'Customer Success Lead',
      role: 'Customer Success',
      candidates: 28,
      status: 'Draft',
      updated: 'Aug 29',
    },
  ];
  protected readonly statuses = ['All statuses', 'Active', 'Draft', 'Completed'];
}
