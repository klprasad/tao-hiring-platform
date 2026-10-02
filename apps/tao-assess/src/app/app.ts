import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TaoLoadingStateComponent, TaoShellComponent } from '@tao/ui';
import { HttpLoadingService } from '@tao/core';
import { TaoThemeService } from '@tao/ui';
import { CandidateShellComponent } from './shell/candidate-shell.component';

@Component({
  imports: [CandidateShellComponent],
  selector: 'tao-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  private readonly themeService = inject(TaoThemeService);
  protected loadingService = inject(HttpLoadingService);
  readonly loading = this.loadingService.isLoading;
}
