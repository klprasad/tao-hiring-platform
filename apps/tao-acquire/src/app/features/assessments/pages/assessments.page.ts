import { Component } from '@angular/core';
import { TaoCardComponent, TaoPageHeaderComponent } from 'tao-ui';

@Component({
  selector: 'tao-assessments-page',
  imports: [TaoCardComponent, TaoPageHeaderComponent],
  templateUrl: './assessments.page.html',
  styleUrl: './assessments.page.scss',
})
export class AssessmentsPage {}