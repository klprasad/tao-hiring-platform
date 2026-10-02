import { Component, inject } from '@angular/core';

import { TAO_THEMES, TaoThemeName, TaoThemeService } from './tao-theme.service';

@Component({
  selector: 'tao-theme-switcher',
  templateUrl: './tao-theme-switcher.component.html',
  styleUrl: './tao-theme-switcher.component.scss',
})
export class TaoThemeSwitcherComponent {
  protected readonly themeService = inject(TaoThemeService);
  protected readonly themes = TAO_THEMES;

  protected selectTheme(themeName: TaoThemeName): void {
    this.themeService.setTheme(themeName);
  }
}
