import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';

export type TaoButtonAppearance = 'filled' | 'outlined' | 'text' | 'icon';

export type TaoButtonColor = 'primary' | 'accent' | 'warn' | 'basic';

export type TaoButtonSize = 'small' | 'medium' | 'large';

export type TaoButtonType = 'button' | 'submit' | 'reset';

@Component({
  selector: 'tao-button',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatProgressSpinnerModule, MatTooltipModule],
  templateUrl: './tao-button.component.html',
  styleUrl: './tao-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaoButtonComponent {
  /**
   * Button text.
   */
  readonly label = input('Action');

  /**
   * Material icon name.
   *
   * Examples:
   * edit, save, add, delete, check
   */
  readonly icon = input('');

  /**
   * Button appearance.
   */
  readonly appearance = input<TaoButtonAppearance>('filled');

  /**
   * Button color.
   */
  readonly color = input<TaoButtonColor>('basic');

  /**
   * Whether the button is disabled.
   */
  readonly disabled = input(false);

  /**
   * Whether the button is showing a loading state.
   */
  readonly loading = input(false);

  /**
   * Native button type.
   */
  readonly type = input<TaoButtonType>('button');

  /**
   * Button size.
   */
  readonly size = input<TaoButtonSize>('medium');

  /**
   * Whether the button takes the full available width.
   */
  readonly fullWidth = input(false);

  /**
   * Tooltip shown on hover.
   */
  readonly tooltip = input('');

  /**
   * Computed disabled state.
   */
  readonly isDisabled = () => this.disabled() || this.loading();

  /**
   * Whether the button should display an icon.
   */
  readonly hasIcon = () => !!this.icon() && !this.loading();
}
