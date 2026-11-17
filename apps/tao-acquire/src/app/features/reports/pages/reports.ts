import { Component } from '@angular/core';
import { TaoButtonComponent, TaoCardComponent } from '@tao/ui';

@Component({
  selector: 'tao-reports',
  imports: [TaoButtonComponent, TaoCardComponent],
  templateUrl: './reports.html',
  styleUrl: './reports.scss',
})
export class Reports {}
