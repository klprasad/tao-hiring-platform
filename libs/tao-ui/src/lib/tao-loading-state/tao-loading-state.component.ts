import { Component, input } from '@angular/core';

@Component({
  selector: 'tao-loading-state',
  templateUrl: './tao-loading-state.component.html',
  styleUrl: './tao-loading-state.component.scss',
})
export class TaoLoadingStateComponent {
  readonly label = input('Loading');
}
