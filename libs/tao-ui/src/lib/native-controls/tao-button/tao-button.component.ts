import { Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'tao-button',
  imports: [MatButtonModule, MatProgressSpinnerModule, MatTooltipModule],
  templateUrl: './tao-button.component.html',
  styleUrl: './tao-button.component.scss',
})
export class TaoButtonComponent {
  readonly label = input('Action');
  readonly appearance = input<'filled' | 'outlined' | 'text' | 'icon'>('filled');
  readonly color = input<'primary' | 'accent' | 'warn'>('primary');
  readonly disabled = input(false);
  readonly loading = input(false);
  readonly type = input<'button' | 'submit' | 'reset'>('button');
  readonly size = input<'small' | 'medium' | 'large'>('medium');
  readonly fullWidth = input(false);
  readonly tooltip = input('');
}
