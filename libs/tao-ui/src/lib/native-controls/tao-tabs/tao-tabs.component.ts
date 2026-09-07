import { Component, input, output } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'tao-tabs',
  imports: [MatTabsModule],
  templateUrl: './tao-tabs.component.html',
  styleUrl: './tao-tabs.component.scss',
})
export class TaoTabsComponent {
  readonly tabs = input<string[]>([]);
  readonly activeIndex = input(0);
  readonly changed = output<number>();
}
