import { Component, input, output } from '@angular/core';

@Component({
  selector: 'tao-filter-bar',
  templateUrl: './tao-filter-bar.component.html',
  styleUrl: './tao-filter-bar.component.scss',
})
export class TaoFilterBarComponent {
  readonly placeholder = input('Search');
  readonly changed = output<string>();
}
