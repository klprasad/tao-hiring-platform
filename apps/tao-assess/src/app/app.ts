import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TaoLoadingStateComponent, TaoShellComponent } from '@tao/ui';
import { HttpLoadingService } from '@tao/core';
import { CandidateShellComponent } from './shell/candidate-shell.component';

@Component({
  imports: [CandidateShellComponent],
  selector: 'tao-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected loadingService = inject(HttpLoadingService);
  readonly loading = this.loadingService.isLoading;
}
