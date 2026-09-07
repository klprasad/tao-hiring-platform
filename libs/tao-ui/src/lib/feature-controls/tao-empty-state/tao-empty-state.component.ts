import { Component, input } from '@angular/core';

@Component({
  selector: 'tao-empty-state',
  templateUrl: './tao-empty-state.component.html',
  styleUrl: './tao-empty-state.component.scss',
})
export class TaoEmptyStateComponent {
  readonly title = input('Nothing here yet');
  readonly message = input('There is no data to display.');
}
