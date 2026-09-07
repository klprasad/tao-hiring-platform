import { Component } from '@angular/core';
import { TaoCardComponent, TaoPageHeaderComponent } from 'tao-ui';

@Component({
  selector: 'tao-campaigns-page',
  imports: [TaoCardComponent, TaoPageHeaderComponent],
  templateUrl: './campaigns.page.html',
  styleUrl: './campaigns.page.scss',
})
export class CampaignsPage {}
