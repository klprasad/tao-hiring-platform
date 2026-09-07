import { Component } from '@angular/core';
import { TaoButtonComponent, TaoCardComponent, TaoPageHeaderComponent } from 'tao-ui';

@Component({
  selector: 'tao-assessments-page',
  imports: [TaoButtonComponent, TaoCardComponent, TaoPageHeaderComponent],
  templateUrl: './assessments.page.html',
  styleUrl: './assessments.page.scss',
})
export class AssessmentsPage {}
