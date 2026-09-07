import { Component } from '@angular/core';
import { TaoButtonComponent, TaoCardComponent, TaoPageHeaderComponent } from 'tao-ui';

@Component({
  selector: 'tao-candidates-page',
  imports: [TaoButtonComponent, TaoCardComponent, TaoPageHeaderComponent],
  templateUrl: './candidates.page.html',
  styleUrl: './candidates.page.scss',
})
export class CandidatesPage {}
