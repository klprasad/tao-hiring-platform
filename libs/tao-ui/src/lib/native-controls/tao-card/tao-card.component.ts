import { Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'tao-card',
  imports: [MatCardModule],
  templateUrl: './tao-card.component.html',
  styleUrl: './tao-card.component.scss',
})
export class TaoCardComponent {
  readonly title = input('');
}
