import { Component } from '@angular/core';
import { TaoButtonComponent, TaoCardComponent, TaoPageHeaderComponent } from 'tao-ui';

@Component({
  selector: 'tao-reports-page',
  imports: [TaoButtonComponent, TaoCardComponent, TaoPageHeaderComponent],
  templateUrl: './reports.page.html',
  styleUrl: './reports.page.scss',
})
export class ReportsPage {}
