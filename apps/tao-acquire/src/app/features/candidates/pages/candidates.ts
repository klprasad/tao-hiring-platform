import { Component } from '@angular/core';
import { TaoCardComponent, TaoPageHeaderComponent } from '@tao/ui';

@Component({
  selector: 'tao-candidates',
  imports: [TaoCardComponent, TaoPageHeaderComponent],
  templateUrl: './candidates.html',
  styleUrl: './candidates.scss',
})
export class Candidates {}
