import { Component, input } from '@angular/core';

@Component({
  selector: 'tao-confidence',
  templateUrl: './tao-confidence.component.html',
  styleUrl: './tao-confidence.component.scss',
})
export class TaoConfidenceComponent {
  readonly value = input(0);
}
