import { Component, input } from '@angular/core';

@Component({
  selector: 'tao-data-table',
  templateUrl: './tao-data-table.component.html',
  styleUrl: './tao-data-table.component.scss',
})
export class TaoDataTableComponent {
  readonly columns = input<string[]>([]);
  readonly rows = input<string[][]>([]);
}
