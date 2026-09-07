import { Component, input } from '@angular/core';

@Component({
  selector: 'tao-page-header',
  templateUrl: './tao-page-header.component.html',
  styleUrl: './tao-page-header.component.scss',
})
export class TaoPageHeaderComponent {
  readonly kicker = input('TAO Acquire');
  readonly title = input('Overview');
  readonly description = input('A clear view of the work moving through your hiring pipeline.');
}
