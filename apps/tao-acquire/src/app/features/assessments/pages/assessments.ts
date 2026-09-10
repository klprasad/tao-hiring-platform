import { Component } from '@angular/core';
import { TaoButtonComponent, TaoCardComponent, TaoPageHeaderComponent } from 'tao-ui';

@Component({
  selector: 'tao-assessments',
  imports: [TaoButtonComponent, TaoCardComponent, TaoPageHeaderComponent],
  templateUrl: './assessments.html',
  styleUrl: './assessments.scss',
})
export class Assessments {}
