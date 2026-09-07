import { Component } from '@angular/core';
import { TaoCardComponent, TaoPageHeaderComponent } from 'tao-ui';

@Component({
  selector: 'tao-reports-page',
  imports: [TaoCardComponent, TaoPageHeaderComponent],
  templateUrl: './reports.page.html',
  styleUrl: './reports.page.scss',
})
export class ReportsPage {}