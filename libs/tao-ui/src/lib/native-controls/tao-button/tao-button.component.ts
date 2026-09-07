import { Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'tao-button',
  imports: [MatButtonModule, MatIconModule, MatProgressSpinnerModule, MatTooltipModule],
  templateUrl: './tao-button.component.html',
  styleUrl: './tao-button.component.scss',
})
export class TaoButtonComponent {
  readonly label = input('Action');
  readonly icon = input('');
  readonly appearance = input<'filled' | 'outlined' | 'text' | 'icon'>('filled');
  readonly color = input<'primary' | 'accent' | 'warn' | 'basic'>('basic');
  readonly disabled = input(false);
  readonly loading = input(false);
  readonly type = input<'button' | 'submit' | 'reset'>('button');
  readonly size = input<'small' | 'medium' | 'large'>('medium');
  readonly fullWidth = input(false);
  readonly tooltip = input('');
}
