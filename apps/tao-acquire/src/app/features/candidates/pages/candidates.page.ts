import { Component } from '@angular/core';
import { TaoCardComponent, TaoPageHeaderComponent } from 'tao-ui';

@Component({
  selector: 'tao-candidates-page',
  imports: [TaoCardComponent, TaoPageHeaderComponent],
  templateUrl: './candidates.page.html',
  styleUrl: './candidates.page.scss',
})
export class CandidatesPage {}