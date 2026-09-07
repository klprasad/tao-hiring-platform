import { Component, input } from '@angular/core';

@Component({
  selector: 'tao-error-state',
  templateUrl: './tao-error-state.component.html',
  styleUrl: './tao-error-state.component.scss',
})
export class TaoErrorStateComponent {
  readonly title = input('Something went wrong');
  readonly message = input('Please try again.');
}
