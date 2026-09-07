import { Component, input } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'tao-expansion-panel',
  imports: [MatExpansionModule],
  templateUrl: './tao-expansion-panel.component.html',
  styleUrl: './tao-expansion-panel.component.scss',
})
export class TaoExpansionPanelComponent {
  readonly title = input('Details');
  readonly expanded = input(false);
}
