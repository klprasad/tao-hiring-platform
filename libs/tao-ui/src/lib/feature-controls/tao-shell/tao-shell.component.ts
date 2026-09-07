import { Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NavigationItem } from 'tao-contracts';
import { TaoButtonComponent } from '../../native-controls/tao-button/tao-button.component';
@Component({
  selector: 'tao-shell',
  imports: [RouterLink, RouterLinkActive, TaoButtonComponent],
  templateUrl: './tao-shell.component.html',
  styleUrl: './tao-shell.component.scss',
})
export class TaoShellComponent {
  readonly product = input('Acquire');
  readonly context = input('Workspace / Overview');
  readonly items = input<NavigationItem[]>([]);
}
