import { Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'tao-menu',
  imports: [MatButtonModule, MatMenuModule],
  templateUrl: './tao-menu.component.html',
  styleUrl: './tao-menu.component.scss',
})
export class TaoMenuComponent {
  readonly label = input('Actions');
  readonly items = input<string[]>([]);
  readonly selected = output<string>();
}
