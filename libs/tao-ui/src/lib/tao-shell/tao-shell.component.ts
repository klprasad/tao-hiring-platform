import { Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NavigationItem } from 'tao-contracts';

@Component({
  selector: 'tao-shell',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './tao-shell.component.html',
  styleUrl: './tao-shell.component.scss',
})
export class TaoShellComponent {
  readonly product = input('Acquire');
  readonly context = input('Workspace / Overview');
  readonly items = input<NavigationItem[]>([]);
}
