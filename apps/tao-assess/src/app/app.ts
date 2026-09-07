import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TaoShellComponent } from 'tao-ui';

@Component({
  imports: [RouterOutlet, TaoShellComponent],
  selector: 'tao-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
}
